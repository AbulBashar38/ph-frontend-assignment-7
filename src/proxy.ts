import { type NextRequest, NextResponse } from "next/server";
import type { UserRole } from "@/types";
import { decodeTokenClaims, getDashboardPath, isTokenLive } from "@/utils";

// Which roles may open each protected area ("admin" means ADMIN and SUPER_ADMIN)
const AREAS: { prefix: string; roles: UserRole[] }[] = [
  { prefix: "/dashboard", roles: ["TENANT"] },
  { prefix: "/owner", roles: ["OWNER"] },
  { prefix: "/admin", roles: ["ADMIN", "SUPER_ADMIN"] },
  // Stripe sends tenants back here after checkout
  { prefix: "/payment", roles: ["TENANT"] },
];

const AUTH_PAGES = ["/login", "/register"];

const startsWithSegment = (pathname: string, prefix: string) =>
  pathname === prefix || pathname.startsWith(`${prefix}/`);

/**
 * Route gate (an optimistic check, not the security boundary: the API verifies every request).
 * - Signed out → protected areas redirect to /login?redirect=<path>
 * - Signed in but in another role's area → their own dashboard
 * - Signed in on /login or /register → their dashboard (only with a live access token, so a revoked
 *   session can never bounce between the login page and the dashboard)
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const access = decodeTokenClaims(request.cookies.get("accessToken")?.value);
  const refresh = decodeTokenClaims(request.cookies.get("refreshToken")?.value);

  const area = AREAS.find(({ prefix }) => startsWithSegment(pathname, prefix));

  if (area) {
    // An expired access token is fine while the refresh token is live: the API client renews it on the next call
    const session = isTokenLive(access)
      ? access
      : isTokenLive(refresh)
        ? refresh
        : null;

    if (!session) {
      const login = new URL("/login", request.url);
      login.searchParams.set("redirect", `${pathname}${search}`);
      return NextResponse.redirect(login);
    }

    if (!area.roles.includes(session.role)) {
      return NextResponse.redirect(
        new URL(getDashboardPath(session.role), request.url),
      );
    }

    return NextResponse.next();
  }

  if (
    AUTH_PAGES.some((page) => startsWithSegment(pathname, page)) &&
    isTokenLive(access)
  ) {
    return NextResponse.redirect(
      new URL(getDashboardPath(access.role), request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/owner/:path*",
    "/admin/:path*",
    "/payment/:path*",
    "/login",
    "/register/:path*",
  ],
};
