import type { APIRoute } from "astro";
import { SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/sales/session-constants";
import {
  getSessionIdFromRequest,
  newSessionId,
  upsertLandingSession,
} from "@/lib/sales/tracking-server";

export const POST: APIRoute = async ({ request, cookies, url }) => {
  let sessionId = getSessionIdFromRequest(request);

  const headers = new Headers({ "Content-Type": "application/json" });

  if (!sessionId) {
    sessionId = newSessionId();
    cookies.set(SESSION_COOKIE, sessionId, {
      path: "/",
      maxAge: SESSION_MAX_AGE,
      sameSite: "lax",
      secure: url.protocol === "https:",
      httpOnly: true,
    });
  }

  try {
    const page = new URL(request.url).searchParams.get("page") ?? undefined;
    await upsertLandingSession(request, sessionId, page);
    return new Response(JSON.stringify({ ok: true, session_id: sessionId }), {
      status: 200,
      headers,
    });
  } catch {
    return new Response(JSON.stringify({ error: "Could not init session" }), {
      status: 500,
      headers,
    });
  }
};
