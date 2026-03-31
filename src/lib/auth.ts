/**
 * NextAuth.js configuration — Auth infrastructure skeleton.
 *
 * STATUS: Ready to activate. Currently does NOT protect any routes.
 *
 * TO ACTIVATE:
 *  1. Run: npm install next-auth
 *  2. Add to .env.local:
 *       NEXTAUTH_SECRET=<run: openssl rand -base64 32>
 *       NEXTAUTH_URL=https://yourdomain.com
 *       GOOGLE_CLIENT_ID=...         (from Google Cloud Console)
 *       GOOGLE_CLIENT_SECRET=...
 *  3. Create src/app/api/auth/[...nextauth]/route.ts:
 *       import { handlers } from "@/lib/auth";
 *       export const { GET, POST } = handlers;
 *  4. Wrap your layout with <SessionProvider> from "next-auth/react"
 *  5. Uncomment the matcher in middleware.ts to protect routes.
 */

// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import GitHubProvider from "next-auth/providers/github";

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   secret: process.env.NEXTAUTH_SECRET,
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//     GitHubProvider({
//       clientId: process.env.GITHUB_CLIENT_ID!,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET!,
//     }),
//   ],
//   callbacks: {
//     async session({ session, token }) {
//       if (token?.sub) session.user.id = token.sub;
//       return session;
//     },
//     async jwt({ token, user }) {
//       if (user) token.sub = user.id;
//       return token;
//     },
//   },
//   pages: {
//     signIn: "/signin",
//     error: "/signin",
//   },
// });

export {};
