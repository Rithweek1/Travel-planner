import { NextRequest, NextResponse } from "next/server";

/**
 * Edge Middleware — runs on EVERY request before it hits any page or API.
 *
 * Handles:
 *  1. CSRF protection for API routes (checks Origin header)
 *  2. Blocks obviously malicious user-agents
 *  3. Enforces HTTPS in production
 *  4. Adds security headers early (before page render)
 *  5. [Auth] Route protection skeleton (activate when NextAuth is set up)
 */

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  // Add your production domain here when deploying:
  // "https://voyagr.vercel.app",
  // "https://yourdomain.com",
];

const BLOCKED_USER_AGENTS = [
  /sqlmap/i,
  /nikto/i,
  /nessus/i,
  /masscan/i,
  /zgrab/i,
];

export function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;
  const isProduction = process.env.NODE_ENV === "production";

  // ── 1. Enforce HTTPS in production ──────────────────────────────────────
  if (isProduction && req.headers.get("x-forwarded-proto") === "http") {
    return NextResponse.redirect(`https://${req.nextUrl.host}${pathname}`, 301);
  }

  // ── 2. Block malicious scanners ─────────────────────────────────────────
  const ua = req.headers.get("user-agent") ?? "";
  if (BLOCKED_USER_AGENTS.some((pattern) => pattern.test(ua))) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // ── 3. CSRF: check Origin on mutating API requests ───────────────────────
  if (pathname.startsWith("/api/") && req.method !== "GET") {
    const requestOrigin = req.headers.get("origin");
    
    // In production: enforce strict origin check
    if (isProduction && requestOrigin && !ALLOWED_ORIGINS.includes(requestOrigin)) {
      return new NextResponse("Forbidden: Invalid origin", { status: 403 });
    }
  }

  // ── 4. Add base security headers to all responses ───────────────────────
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // ── 5. Auth route protection (UNCOMMENT when NextAuth is activated) ──────
  // import { auth } from "@/lib/auth";
  // const session = await auth();
  // const protectedPaths = ["/my-trips"];
  // if (protectedPaths.some(p => pathname.startsWith(p)) && !session) {
  //   return NextResponse.redirect(new URL("/signin", req.url));
  // }

  return response;
}

export const config = {
  matcher: [
    // Apply to everything EXCEPT Next.js internals and static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
