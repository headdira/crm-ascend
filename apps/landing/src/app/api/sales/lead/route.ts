import "server-only";
import { createServiceSupabase, type Json } from "@crm-ascend/db";
import { hashEmail, hashPhone } from "@crm-ascend/validation";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getHashSalt } from "@/lib/env";
import { parseAttributionCookie } from "@/lib/sales/utm";

const leadSchema = z.object({
  full_name: z.string().min(2).max(200),
  email: z.string().email(),
  phone: z.string().optional(),
  marketing_consent: z.literal(true),
});

export async function POST(request: Request) {
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

  const attributionHeader = request.headers.get("cookie") ?? "";
  const attrMatch = attributionHeader.match(/(?:^|; )ascend_attribution=([^;]*)/);
  const utm = parseAttributionCookie(attrMatch?.[1]) as Json | null;

  const salt = getHashSalt();
  const supabase = createServiceSupabase();

  const { data, error } = await supabase
    .from("leads")
    .insert({
      full_name: parsed.data.full_name,
      email_hash: hashEmail(parsed.data.email, salt),
      phone_hash: parsed.data.phone ? hashPhone(parsed.data.phone, salt) : null,
      email_enc: parsed.data.email,
      phone_enc: parsed.data.phone ?? null,
      source: "landing",
      utm: (utm ?? {}) as Json,
      quiz_answers: { marketing_consent: true } as Json,
      status: "new",
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: "Could not save lead" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data.id });
}
