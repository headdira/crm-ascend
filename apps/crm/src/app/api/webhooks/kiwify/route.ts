import { NextResponse } from "next/server";
import { getKiwifyWebhookToken } from "@/lib/env";
import { validateKiwifyWebhookRequest } from "@/lib/kiwify/parse-payload";
import { processKiwifyWebhook } from "@/lib/kiwify/process-webhook";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "kiwify-webhook",
    webhook_token_hint: "Configure URL com ?token=...",
  });
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const rawBody = await request.text();

  let payload: Record<string, unknown>;
  try {
    payload = rawBody ? (JSON.parse(rawBody) as Record<string, unknown>) : {};
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!validateKiwifyWebhookRequest({ url, rawBody, payload })) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { eventType, result } = await processKiwifyWebhook({ payload, url });
    return NextResponse.json({ ok: true, event_type: eventType, result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook processing failed";
    console.error("[kiwify-webhook]", message, err);
    return NextResponse.json({ error: message }, { status: 422 });
  }
}

export function buildKiwifyWebhookPublicUrl(baseUrl: string): string {
  const token = getKiwifyWebhookToken();
  const url = new URL("/api/webhooks/kiwify", baseUrl.replace(/\/$/, ""));
  url.searchParams.set("token", token);
  return url.toString();
}
