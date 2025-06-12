import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/admin",
  "/agences",
  "/contrat",
  "login/first-connexion",
];

export function middleware(request: NextRequest) {
  const isAuth = request.cookies.get("isAuth")?.value;
  const pathname = request.nextUrl.pathname;

  if (isAuth && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (pathname == "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (protectedRoutes.some((path) => pathname.startsWith(path)) && !isAuth) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/admin/:path*",
    "/",
    "/first-connexion",
    "/agences",
    "/contrat/:path*",
  ],
};
