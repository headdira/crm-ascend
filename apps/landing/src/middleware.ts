import { type NextRequest, NextResponse } from "next/server";

/** Evita import com alias no bundle Edge (causa comum de MIDDLEWARE_INVOCATION_FAILED). */
const SESSION_COOKIE = "ascend_session_id";
const SESSION_MAX_AGE = 60 * 60 * 24 * 180;

function newSessionId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function middleware(request: NextRequest) {
  try {
    const response = NextResponse.next();
    const existing = request.cookies.get(SESSION_COOKIE)?.value;

    if (!existing) {
      response.cookies.set(SESSION_COOKIE, newSessionId(), {
        httpOnly: true,
        secure: request.nextUrl.protocol === "https:",
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_MAX_AGE,
      });
    }

    return response;
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
