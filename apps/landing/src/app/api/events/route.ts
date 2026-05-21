import "server-only";
import type { Json } from "@crm-ascend/db";
import { NextResponse } from "next/server";
import { z } from "zod";
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

/** Nomes alinhados ao Meta Conversions API (quando integrar). */
const CHECKOUT_EVENTS = new Set(["InitiateCheckout", "checkout_click"]);

export async function POST(request: Request) {
  const sessionId = getSessionIdFromRequest(request);
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    await upsertLandingSession(request, sessionId, parsed.data.page);

    const result = await insertLandingEvent(request, sessionId, {
      event_name: parsed.data.event_name,
      event_id: parsed.data.event_id,
      page: parsed.data.page,
      payload: (parsed.data.payload ?? {}) as Json,
    });

    if (CHECKOUT_EVENTS.has(parsed.data.event_name)) {
      await ensureLeadForSession(sessionId, {
        reachedKiwify: true,
        lastEventAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      ok: true,
      session_id: sessionId,
      duplicate: result.duplicate,
      meta_capi: "skipped",
    });
  } catch {
    return NextResponse.json({ error: "Could not record event" }, { status: 500 });
  }
}
