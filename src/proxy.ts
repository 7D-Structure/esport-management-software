import { auth } from "@/auth";
import { NextResponse } from "next/server";

const ADMIN_ROLES = new Set(["ADMIN", "STAFF", "MANAGER", "COACH"]);

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isSpaceRoute = pathname.startsWith("/space");

  const redirectToLogin = () => {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  };

  // Admin area: only ADMIN, STAFF and COACH.
  if (isAdminRoute) {
    const role = req.auth?.user?.role;
    if (!req.auth || !role || !ADMIN_ROLES.has(role)) {
      return redirectToLogin();
    }
  }

  // Player/coach space: any authenticated user.
  if (isSpaceRoute && !req.auth) {
    return redirectToLogin();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/space/:path*"],
};
