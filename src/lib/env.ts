/**
 * Environment variable validation.
 * Crashes at startup with a clear message if required vars are missing.
 * Add every required server-side env var here.
 */

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value || value.trim() === "") {
    throw new Error(
      `[Voyagr] Missing required environment variable: ${key}\n` +
      `Please add it to your .env.local file.\n` +
      `See .env.local.example for reference.`
    );
  }
  return value.trim();
}

export const env = {
  get GROQ_API_KEY() { return requireEnv("GROQ_API_KEY"); },

  // Upstash Redis (optional — enables persistent rate limiting across deploys)
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL ?? null,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN ?? null,

  // NextAuth (optional — enable when adding user auth)
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ?? null,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? "http://localhost:3000",

  // Runtime
  get NODE_ENV() { return process.env.NODE_ENV ?? "development"; },
  get IS_PRODUCTION() { return process.env.NODE_ENV === "production"; },
};

// Safe verification log for the user
if (!env.IS_PRODUCTION) {
  const keyMatch = env.GROQ_API_KEY.match(/^(gsk_[a-zA-Z0-9]{4}).*$/);
  const displayKey = keyMatch ? `${keyMatch[1]}***` : "invalid_format";
  console.log(`[Voyagr] Environment loaded. Groq Key: ${displayKey}`);
}
