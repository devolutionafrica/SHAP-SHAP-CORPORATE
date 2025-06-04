import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protéger ces chemins
const protectedRoutes = ["/dashboard", "/profile", "/admin", ""];

export function middleware(request: NextRequest) {
  const isAuth = request.cookies.get("isAuth")?.value;

  const pathname = request.nextUrl.pathname;

  // Si la route est protégée et que isAuth est absent
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
    "/agences",
    "/contrat/:path*",
  ],
};
