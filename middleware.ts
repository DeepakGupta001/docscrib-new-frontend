import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect old login/register routes to new v2 routes
  if (pathname === "/dashboard") {
    return NextResponse.redirect(new URL("/dashboard/default", request.url));
  }
  if (pathname === "/login") {
    return NextResponse.redirect(new URL("/v2/login", request.url));
  }

  if (pathname === "/register") {
    return NextResponse.redirect(new URL("/v2/register", request.url));
  }

  // Check if accessing login/register pages while authenticated
  if (pathname === "/v2/login" || pathname === "/v2/register") {
    const connectSid = request.cookies.get("connect.sid");
    if (connectSid) {
      // User is authenticated, redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard/default", request.url));
    }
    // Not authenticated, allow access to login/register pages
    return NextResponse.next();
  }

  // Check if accessing dashboard routes
  if (pathname.startsWith("/dashboard")) {
    // Check for authentication cookie
    const connectSid = request.cookies.get("connect.sid");

    if (!connectSid) {
      // Not authenticated, redirect to login with return URL
      const loginUrl = new URL("/v2/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // NOTE: In production, you should validate the session with your backend API
    // For now, we trust the presence of the cookie for simplicity
    // You could add: const response = await fetch(`${API_BASE_URL}/api/auth/validate`, { credentials: "include" })
  }

  // Redirect root to dashboard if authenticated, otherwise to login
  if (pathname === "/") {
    const connectSid = request.cookies.get("connect.sid");
    if (connectSid) {
      return NextResponse.redirect(new URL("/dashboard/default", request.url));
    } else {
      return NextResponse.redirect(new URL("/v2/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/", "/login", "/register", "/v2/login", "/v2/register"]
};
