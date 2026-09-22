import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getCanonicalRedirectUrl } from "./lib/seo/canonical-origin";

export function middleware(request: NextRequest) {
  const redirectUrl = getCanonicalRedirectUrl({
    requestUrl: request.url,
    host: request.headers.get("host"),
    cfVisitor: request.headers.get("cf-visitor"),
    forwardedProto: request.headers.get("x-forwarded-proto")
  });

  if (!redirectUrl) return NextResponse.next();

  return NextResponse.redirect(redirectUrl, { status: 308 });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"]
};
