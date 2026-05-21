import "server-only";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getSessionIdFromRequest,
  upsertIdentifiedLead,
} from "@/lib/sales/tracking-server";

const leadSchema = z.object({
  full_name: z.string().min(2).max(200),
  email: z.string().email(),
  phone: z.string().optional(),
  marketing_consent: z.literal(true),
});

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

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const id = await upsertIdentifiedLead(request, sessionId, {
      full_name: parsed.data.full_name,
      email: parsed.data.email,
      phone: parsed.data.phone,
    });

    return NextResponse.json({ ok: true, id, session_id: sessionId });
  } catch {
    return NextResponse.json({ error: "Could not save lead" }, { status: 500 });
  }
}
