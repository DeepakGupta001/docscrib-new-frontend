import { NextResponse, type NextRequest } from "next/server";
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/login") {
    return NextResponse.redirect(new URL("/v2/login", request.url));
  }

  if (pathname === "/register") {
    return NextResponse.redirect(new URL("/v2/register", request.url));
  }

  return NextResponse.redirect(new URL("/dashboard/default", request.url));
}

export const config = {
  matcher: ["/dashboard", "/", "/login", "/register"]
};
