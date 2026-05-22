import type { APIRoute } from "astro";
import { SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/sales/session-constants";
import {
  ensureColdLeadForSession,
  getSessionIdFromRequest,
  newSessionId,
  upsertLandingSession,
} from "@/lib/sales/tracking-server";

export const POST: APIRoute = async ({ request, cookies, url }) => {
  let sessionId = getSessionIdFromRequest(request);
  const isNew = !sessionId;

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
    const page =
      new URL(request.url).searchParams.get("page") ??
      request.headers.get("referer") ??
      "/";
    await upsertLandingSession(request, sessionId, page);
    await ensureColdLeadForSession(sessionId, {
      eventName: isNew ? "session_start" : "session_ping",
    });

    return new Response(JSON.stringify({ ok: true, session_id: sessionId }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[api/session]", err);
    return new Response(JSON.stringify({ error: "Could not init session" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
