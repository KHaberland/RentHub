import { NextResponse } from "next/server";

const SESSION_COOKIE_NAMES = [
  "authjs.session-token",
  "__Secure-authjs.session-token"
];

export default function middleware(request: Request) {
  const url = new URL(request.url);
  const cookieHeader = request.headers.get("cookie") ?? "";
  const hasSession = SESSION_COOKIE_NAMES.some((name) =>
    cookieHeader.includes(`${name}=`)
  );

  if (hasSession) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to /login for protected pages.
  const loginUrl = new URL("/login", url.origin);
  loginUrl.searchParams.set("from", url.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*", "/my-prompts/:path*"]
};
