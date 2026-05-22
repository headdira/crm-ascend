import type { APIRoute } from "astro";
import { z } from "zod";
import type { Json } from "@crm-ascend/db";
import { upsertCheckoutLead } from "@/lib/sales/lead-server";

const leadSchema = z.object({
  full_name: z.string().min(2).max(80),
  email: z.string().email(),
  phone: z.string().min(10).max(20),
  marketing_consent: z.literal(true),
  utm: z.record(z.unknown()).optional(),
});

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const id = await upsertCheckoutLead({
      full_name: parsed.data.full_name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      utm: (parsed.data.utm ?? {}) as Json,
    });

    return new Response(JSON.stringify({ ok: true, id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Could not save lead" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
