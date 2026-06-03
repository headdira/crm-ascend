import type { Json } from "@crm-ascend/db";
import { createServiceSupabase } from "@crm-ascend/db";
import {
  buildIdempotencyKey,
  detectWebhookEventType,
  parseKiwifyWebhookPayload,
} from "@/lib/kiwify/parse-payload";
import {
  enrichLeadFromKiwifyEvent,
  provisionKiwifySale,
  suspendEnrollmentForKiwifyOrder,
} from "@/lib/kiwify/provision";
import type { KiwifyProcessResult, KiwifyWebhookTrigger } from "@/lib/kiwify/types";

export async function processKiwifyWebhook(input: {
  payload: Record<string, unknown>;
  url: URL;
}): Promise<{ eventType: KiwifyWebhookTrigger; result: KiwifyProcessResult }> {
  const eventType = detectWebhookEventType(input.payload, input.url);
  if (!eventType) {
    throw new Error("Tipo de evento Kiwify não reconhecido");
  }

  const parsedFields = parseKiwifyWebhookPayload(input.payload);
  const parsed = { eventType, ...parsedFields };
  const idempotencyKey = buildIdempotencyKey(
    eventType,
    parsed.orderId,
    parsed.customer?.email ?? null,
  );

  const supabase = createServiceSupabase();

  const { data: existing } = await supabase
    .from("kiwify_webhook_events")
    .select("id, result, processed_at")
    .eq("idempotency_key", idempotencyKey)
    .maybeSingle();

  if (existing?.processed_at && existing.result) {
    return {
      eventType,
      result: { ...(existing.result as KiwifyProcessResult), ok: true, skipped: true },
    };
  }

  const { data: eventRow, error: insertErr } = await supabase
    .from("kiwify_webhook_events")
    .upsert(
      {
        idempotency_key: idempotencyKey,
        event_type: eventType,
        kiwify_order_id: parsed.orderId,
        payload: input.payload as Json,
      },
      { onConflict: "idempotency_key" },
    )
    .select("id")
    .single();

  if (insertErr || !eventRow) {
    throw new Error(insertErr?.message ?? "Erro ao registrar evento Kiwify");
  }

  let result: KiwifyProcessResult;

  try {
    result = await dispatchEvent(eventType, parsed);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    await supabase
      .from("kiwify_webhook_events")
      .update({ error: message, processed_at: new Date().toISOString() })
      .eq("id", eventRow.id);
    throw err;
  }

  await supabase
    .from("kiwify_webhook_events")
    .update({
      result: result as Json,
      processed_at: new Date().toISOString(),
      error: result.ok ? null : (result.message ?? "failed"),
    })
    .eq("id", eventRow.id);

  return { eventType, result };
}

async function dispatchEvent(
  eventType: KiwifyWebhookTrigger,
  parsed: ReturnType<typeof parseKiwifyWebhookPayload> & { eventType: KiwifyWebhookTrigger },
): Promise<KiwifyProcessResult> {
  switch (eventType) {
    case "compra_aprovada":
      return provisionKiwifySale(parsed);
    case "carrinho_abandonado":
      return enrichLeadFromKiwifyEvent(parsed, "carrinho_abandonado");
    case "pix_gerado":
    case "boleto_gerado":
    case "compra_recusada":
      return enrichLeadFromKiwifyEvent(parsed, eventType);
    case "compra_reembolsada":
    case "chargeback":
      await enrichLeadFromKiwifyEvent(parsed, eventType);
      return suspendEnrollmentForKiwifyOrder(parsed.orderId, eventType);
    case "subscription_canceled":
    case "subscription_late":
    case "subscription_renewed":
      return enrichLeadFromKiwifyEvent(parsed, eventType);
    default:
      return { ok: false, message: `Evento não tratado: ${eventType}` };
  }
}
