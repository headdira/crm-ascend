import { createHmac, timingSafeEqual } from "node:crypto";
import { getKiwifyWebhookToken } from "@/lib/env";
import type { KiwifyWebhookTrigger } from "@/lib/kiwify/types";
import { KIWIFY_WEBHOOK_TRIGGERS } from "@/lib/kiwify/types";

function readRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function readString(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
}

function readNested(obj: Record<string, unknown>, ...keys: string[]): unknown {
  for (const key of keys) {
    if (obj[key] != null) return obj[key];
  }
  return null;
}

const ORDER_STATUS_TO_EVENT: Record<string, KiwifyWebhookTrigger> = {
  paid: "compra_aprovada",
  approved: "compra_aprovada",
  refused: "compra_recusada",
  refunded: "compra_reembolsada",
  chargedback: "chargeback",
  waiting_payment: "pix_gerado",
  abandoned: "carrinho_abandonado",
  abandoned_cart: "carrinho_abandonado",
  cart_abandoned: "carrinho_abandonado",
  carrinho_abandonado: "carrinho_abandonado",
};

function normalizeTrigger(value: string | null): KiwifyWebhookTrigger | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if ((KIWIFY_WEBHOOK_TRIGGERS as readonly string[]).includes(normalized)) {
    return normalized as KiwifyWebhookTrigger;
  }
  return ORDER_STATUS_TO_EVENT[normalized] ?? null;
}

export function validateKiwifyWebhookRequest(input: {
  url: URL;
  rawBody: string;
  payload: Record<string, unknown>;
}): boolean {
  const expected = getKiwifyWebhookToken();

  const queryToken =
    input.url.searchParams.get("token") ??
    input.url.searchParams.get("webhook_token");
  if (queryToken && safeEqual(queryToken, expected)) return true;

  const headerToken = readString(readNested(input.payload, "token"));
  if (headerToken && safeEqual(headerToken, expected)) return true;

  const signature =
    input.url.searchParams.get("signature") ??
    readString(readNested(input.payload, "signature"));
  if (signature) {
    const hmac = createHmac("sha1", expected).update(input.rawBody).digest("hex");
    if (safeEqual(signature, hmac)) return true;
  }

  // Kiwify dashboard test events may omit token on first setup
  if (process.env.KIWIFY_WEBHOOK_ALLOW_UNSIGNED === "true") return true;

  return false;
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function detectWebhookEventType(
  payload: Record<string, unknown>,
  url: URL,
): KiwifyWebhookTrigger | null {
  const fromQuery = normalizeTrigger(url.searchParams.get("event"));
  if (fromQuery) return fromQuery;

  const candidates = [
    readString(
      readNested(
        payload,
        "webhook_event_type",
        "Webhook_event_type",
        "event_type",
        "event",
        "trigger",
        "type",
      ),
    ),
    readString(readNested(payload, "order_status", "status")),
  ];

  for (const candidate of candidates) {
    const event = normalizeTrigger(candidate);
    if (event) return event;
  }

  return null;
}

export function parseKiwifyWebhookPayload(payload: Record<string, unknown>): {
  orderId: string | null;
  reference: string | null;
  customer: ReturnType<typeof parseCustomer>;
  product: { id: string | null; name: string | null };
  chargeAmountCents: number | null;
  tracking: Record<string, string | null>;
} {
  const orderId =
    readString(
      readNested(
        payload,
        "order_id",
        "orderId",
        "id",
        "sale_id",
      ),
    ) ??
    readString(readNested(readRecord(readNested(payload, "Subscription")) ?? {}, "order_id"));

  const reference = readString(readNested(payload, "reference", "order_ref"));

  const productRaw =
    readRecord(readNested(payload, "Product", "product")) ??
    readRecord(readNested(payload, "plan", "Plan")) ??
    {};

  const paymentRaw = readRecord(readNested(payload, "Payment", "payment")) ?? {};
  const trackingRaw = readRecord(readNested(payload, "Tracking", "tracking")) ?? {};

  const chargeAmount =
    readNumber(readNested(paymentRaw, "charge_amount")) ??
    readNumber(readNested(payload, "charge_amount")) ??
    readNumber(readNested(payload, "Commissions", "commissions", "my_commission"));

  return {
    orderId,
    reference,
    customer: parseCustomer(payload),
    product: {
      id: readString(readNested(productRaw, "id", "product_id")),
      name: readString(readNested(productRaw, "name", "product_name")),
    },
    chargeAmountCents: chargeAmount,
    tracking: parseTracking(trackingRaw, payload),
  };
}

function parseCustomer(payload: Record<string, unknown>) {
  const raw =
    readRecord(readNested(payload, "Customer", "customer", "buyer", "Client", "lead")) ??
    payload;

  const email =
    readString(readNested(raw, "email", "Email", "customer_email")) ??
    readString(readNested(payload, "email", "customer_email"));
  if (!email) return null;

  return {
    email: email.toLowerCase(),
    name:
      readString(readNested(raw, "full_name", "name", "customer_name")) ??
      email.split("@")[0] ??
      "Cliente Kiwify",
    phone: readString(readNested(raw, "mobile", "phone", "phone_number")),
    cpf: readString(readNested(raw, "cpf", "CPF")),
    cnpj: readString(readNested(raw, "cnpj", "CNPJ")),
    kiwifyCustomerId: readString(readNested(raw, "id", "customer_id")),
  };
}

function parseTracking(
  trackingRaw: Record<string, unknown>,
  payload: Record<string, unknown>,
): Record<string, string | null> {
  const keys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "src",
    "sck",
    "s1",
    "s2",
    "s3",
  ] as const;

  const out: Record<string, string | null> = {};
  for (const key of keys) {
    out[key] =
      readString(trackingRaw[key]) ??
      readString(readNested(payload, key)) ??
      null;
  }
  return out;
}

function readNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return Math.round(value);
  if (typeof value === "string" && value.trim()) {
    const n = Number(value);
    if (Number.isFinite(n)) return Math.round(n);
  }
  return null;
}

export function buildIdempotencyKey(
  eventType: string,
  orderId: string | null,
  email: string | null,
): string {
  if (orderId) return `${eventType}:${orderId}`;
  if (email) return `${eventType}:email:${email.toLowerCase()}:${new Date().toISOString().slice(0, 10)}`;
  return `${eventType}:anonymous:${Date.now()}`;
}
