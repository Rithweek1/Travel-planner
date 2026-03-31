import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { env } from "@/lib/env";
import { checkRateLimit } from "@/lib/ratelimit";

const groq = new Groq({ apiKey: env.GROQ_API_KEY });

// ── Input sanitization ─────────────────────────────────────────────────────
function sanitize(input: string): string {
  return input
    .replace(/[<>]/g, "")
    .replace(/[`"\\]/g, "")
    .replace(/ignore\s+previous/gi, "")
    .replace(/system\s*:/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 150);
}

// ── Validation ─────────────────────────────────────────────────────────────
const ALLOWED_DAYS = new Set(["1", "2", "3", "4", "5", "6", "7", "10", "14"]);

function validateDestination(dest: unknown): string {
  if (typeof dest !== "string" || dest.trim().length === 0)
    throw new Error("Destination is required.");
  const cleaned = sanitize(dest);
  if (cleaned.length < 2) throw new Error("Destination is too short.");
  return cleaned;
}

function validateDays(days: unknown): string {
  if (typeof days !== "string" || !ALLOWED_DAYS.has(days))
    throw new Error(`Days must be one of: ${[...ALLOWED_DAYS].join(", ")}.`);
  return days;
}

function validateActivities(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return (raw as unknown[])
    .filter((a): a is string => typeof a === "string")
    .map(sanitize)
    .filter((a) => a.length > 1)
    .slice(0, 6);
}

// ── Route handler ──────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    // 1. Rate limiting (in-memory dev / Redis production)
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "anonymous";

    const { success, remaining } = await checkRateLimit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a minute before generating another itinerary." },
        {
          status: 429,
          headers: { "Retry-After": "60", "X-RateLimit-Remaining": "0" },
        }
      );
    }

    // 2. Parse body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    if (typeof body !== "object" || body === null) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const { destination: rawDest, days: rawDays, activities: rawActs } =
      body as Record<string, unknown>;

    // 3. Validate
    const destination = validateDestination(rawDest);
    const days = validateDays(rawDays);
    const activities = validateActivities(rawActs);

    // 4. Build prompt
    const activitiesClause =
      activities.length > 0
        ? `IMPORTANT: You MUST include these specific activities: ${activities.join(", ")}.`
        : "";

    const prompt = `Act as an expert travel agent. Create a realistic, detailed day-by-day itinerary for a ${days}-day trip to ${destination}.
${activitiesClause}
CRITICAL: Begin the very first line by enthusiastically welcoming the user in the primary native language of ${destination} (e.g., "Bonjour!" for Paris). The rest MUST be in English.
Format in simple plain text. DO NOT use asterisks, markdown, hashtags, or special symbols. Use hyphens (-) for bullet points. Include morning, afternoon, and evening activities. Suggest specific real places. Be helpful and professional.`;

    // 5. Call Groq
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      max_tokens: 2048,
      temperature: 0.7,
    });

    const itinerary = completion.choices[0]?.message?.content ?? "";
    if (!itinerary) throw new Error("No itinerary was generated. Please try again.");

    return NextResponse.json(
      { itinerary },
      { headers: { "X-RateLimit-Remaining": String(remaining) } }
    );
  } catch (error: unknown) {
    console.error("[/api/plan] Error:", error instanceof Error ? error.message : error);
    const message =
      error instanceof Error ? error.message : "Failed to generate itinerary.";
    const status =
      message.includes("required") || message.includes("must be") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
