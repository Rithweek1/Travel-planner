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
    // Inner try/catch can still be used for fine-grained errors
    return await handleItineraryRequest(req);
  } catch (outerError: any) {
    console.error("[/api/plan] FATAL:", outerError);
    return NextResponse.json(
      { error: "A server error occurred. Please check your environment variables and logs." },
      { status: 500 }
    );
  }
}

async function handleItineraryRequest(req: Request) {
  try {
    // 1. Rate limiting (in-memory dev / Redis production)
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "anonymous";
    // ... rest of the logic remains same

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

    const { destination: rawDest, days: rawDays, budget: rawBudget, activities: rawActs } =
      body as Record<string, unknown>;

    // 3. Validate
    const destination = validateDestination(rawDest);
    const days = validateDays(rawDays);
    const budget = typeof rawBudget === "string" ? rawBudget : "flexible";
    const activities = validateActivities(rawActs);

    // 4. Build prompt
    const activitiesClause =
      activities.length > 0
        ? `The user is interested in these activities: ${activities.join(", ")}.`
        : "";

    const budgetClause = 
      budget !== "flexible" 
        ? `The total budget for this trip is approximately $${parseInt(budget).toLocaleString()}. Ensure all suggested accommodations and dining fit this budget.`
        : "The budget is flexible.";

    const prompt = `Act as a world-class travel consultant. Create a high-end, detailed day-by-day itinerary for a ${days}-day trip to ${destination}.
    
Context:
- Destination: ${destination}
- Duration: ${days} days
- Budget: ${budgetClause}
- Interests: ${activitiesClause}

Formatting Rules (CRITICAL):
1. Start the first line with a warm, enthusiastic greeting in the primary native language of ${destination}.
2. Use ONLY simple plain text. No markdown, no bold (**), no hashtags, no asterisks (*).
3. Use exact headers for days and times: "Day 1", "Day 2", "Morning", "Afternoon", "Evening".
4. Use hyphens (-) for activity bullet points.
5. Suggest specific, real-world locations (restaurants, parks, museums, hotels).
6. Provide brief, engaging descriptions for each activity.

Structure:
- Greeting
- Day 1
  - Morning: [Activity]
  - Afternoon: [Activity]
  - Evening: [Activity]
- Day 2
  ... and so on.
- Final "Summary" or "Pro Tip" section at the end.`;

    // 5. Call Groq with Fallback
    let completion;
    try {
      completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.1-70b-versatile",
        max_tokens: 3000,
        temperature: 0.7,
      });
    } catch (modelError) {
      console.warn("[/api/plan] 70B model failed, falling back to 8B:", modelError);
      completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.1-8b-instant",
        max_tokens: 2048,
        temperature: 0.7,
      });
    }

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
