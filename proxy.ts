import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { isDevelopmentEnvironment } from "./lib/constants";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/om",
  "/integritetspolicy",
  "/ansvarsfriskrivning",
  "/anvandarvillkor",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/ping")) {
    return new Response("pong", { status: 200 });
  }

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Allow public marketing and auth pages without a token
  if (PUBLIC_PATHS.includes(pathname) || pathname.startsWith("/om/")) {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
      secureCookie: !isDevelopmentEnvironment,
    });
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    // Redirect logged-in users away from login/register
    if (token && ["/login", "/register"].includes(pathname)) {
      return NextResponse.redirect(new URL(`${base}/`, request.url));
    }
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: !isDevelopmentEnvironment,
  });

  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  if (!token) {
    return NextResponse.redirect(new URL(`${base}/login`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\.ico|sitemap\.xml|robots\.txt|images).*)",
  ],
};
