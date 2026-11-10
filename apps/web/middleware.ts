import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow API routes and media handlers to execute freely
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const session = request.cookies.get("eduplay_session")?.value;
  const isAuthenticated = session === "student";

  // If user is authenticated and visits /login, redirect to /subjects
  if (isAuthenticated) {
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/subjects", request.url));
    }
    return NextResponse.next();
  }

  // If user is NOT authenticated:
  // Allow public landing page (/) and /login
  if (pathname === "/" || pathname === "/login") {
    return NextResponse.next();
  }

  // Redirect unauthenticated requests to protected pages to /login
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - logo.svg
     * - icon.svg
     */
    "/((?!_next/static|_next/image|favicon.ico|logo.svg|icon.svg).*)",
  ],
};
