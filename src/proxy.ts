import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Require authentication for these areas. Fine-grained authorization
// (organization membership, site-admin) is enforced in the server components
// via requireOrgAdmin / requireSiteAdmin.
const PROTECTED_PREFIXES = ["/admin", "/site", "/space", "/onboarding"];

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  if (isProtected && !req.auth) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/site/:path*",
    "/space/:path*",
    "/onboarding/:path*",
  ],
};
