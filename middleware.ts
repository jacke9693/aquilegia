import NextAuth from "next-auth";
import { authConfig } from "./app/(auth)/auth.config";

export const { auth: middleware } = NextAuth({
  ...authConfig,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      const publicPaths = [
        "/",
        "/login",
        "/register",
        "/om",
        "/integritetspolicy",
        "/ansvarsfriskrivning",
        "/anvandarvillkor",
      ];

      if (publicPaths.includes(pathname)) return true;

      // Allow sub-paths of marketing pages (if any)
      if (pathname.startsWith("/om/")) return true;

      if (isLoggedIn) return true;

      return false; // Auth.js redirects to authConfig.pages.signIn
    },
  },
});

export const config = {
  // Exclude API routes (they self-protect), static files, and Next.js internals
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|images).*)",
  ],
};
