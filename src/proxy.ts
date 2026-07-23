import { auth } from "@/auth";
import { NextResponse } from "next/server";

const ADMIN_ROLES = new Set(["ADMIN", "STAFF", "COACH"]);

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    const role = req.auth?.user?.role;
    if (!req.auth || !role || !ADMIN_ROLES.has(role)) {
      const loginUrl = new URL("/login", req.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
