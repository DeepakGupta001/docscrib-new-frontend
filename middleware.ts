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

  // For authentication checks, we rely on client-side validation
  // since tokens are stored in localStorage and middleware can't access them
  // The AuthGuard component and useAuth hook handle client-side authentication

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/", "/login", "/register", "/v2/login", "/v2/register"]
};
