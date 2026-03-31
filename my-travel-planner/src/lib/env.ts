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
  GROQ_API_KEY: requireEnv("GROQ_API_KEY"),

  // Upstash Redis (optional — enables persistent rate limiting across deploys)
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL ?? null,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN ?? null,

  // NextAuth (optional — enable when adding user auth)
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ?? null,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? "http://localhost:3000",

  // Runtime
  NODE_ENV: process.env.NODE_ENV ?? "development",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
};
