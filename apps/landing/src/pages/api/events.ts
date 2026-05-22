import type { APIRoute } from "astro";
import { z } from "zod";
import type { Json } from "@crm-ascend/db";
import {
  ensureLeadForSession,
  getSessionIdFromRequest,
  insertLandingEvent,
  upsertLandingSession,
} from "@/lib/sales/tracking-server";

const eventSchema = z.object({
  event_name: z.string().min(1).max(64),
  event_id: z.string().uuid(),
  page: z.string().max(500).optional(),
  payload: z.record(z.unknown()).optional(),
});

const CHECKOUT_TOUCH_EVENTS = new Set([
  "checkout_click",
  "checkout_modal_open",
  "InitiateCheckout",
]);

export const POST: APIRoute = async ({ request }) => {
  const sessionId = getSessionIdFromRequest(request);
  if (!sessionId) {
    return new Response(JSON.stringify({ error: "Missing session" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    await upsertLandingSession(request, sessionId, parsed.data.page);

    const result = await insertLandingEvent(request, sessionId, {
      event_name: parsed.data.event_name,
      event_id: parsed.data.event_id,
      page: parsed.data.page,
      payload: (parsed.data.payload ?? {}) as Json,
    });

    if (CHECKOUT_TOUCH_EVENTS.has(parsed.data.event_name)) {
      await ensureLeadForSession(sessionId, {
        lastEventAt: new Date().toISOString(),
      });
    }

    return new Response(
      JSON.stringify({
        ok: true,
        session_id: sessionId,
        duplicate: result.duplicate,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch {
    return new Response(JSON.stringify({ error: "Could not record event" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
