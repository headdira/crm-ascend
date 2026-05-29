import { getSiteUrl } from "@/lib/site-url";
import {
  getMetaCapiAccessToken,
  getMetaPixelId,
  getMetaTestEventCode,
  isMetaCapiConfigured,
} from "./meta-config";
import {
  hashMetaEmail,
  hashMetaExternalId,
  hashMetaFirstName,
  hashMetaPhone,
} from "./meta-hash";

export type MetaUserData = {
  email?: string;
  phone?: string;
  firstName?: string;
  clientIp?: string | null;
  clientUserAgent?: string | null;
  fbp?: string | null;
  fbc?: string | null;
  externalId?: string | null;
};

export type MetaCustomData = Record<string, string | number | boolean | null | undefined>;

export type SendMetaEventInput = {
  eventName: string;
  eventId: string;
  eventSourceUrl?: string;
  userData?: MetaUserData;
  customData?: MetaCustomData;
};

export type MetaCapiResult =
  | { ok: true; eventsReceived?: number }
  | { ok: false; error: string; skipped?: boolean };

export function clientContextFromRequest(request: Request): {
  ip: string | null;
  userAgent: string | null;
} {
  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    null;
  return {
    ip,
    userAgent: request.headers.get("user-agent"),
  };
}

function buildUserData(user: MetaUserData | undefined): Record<string, string | string[]> {
  if (!user) return {};
  const out: Record<string, string | string[]> = {};

  if (user.email) out.em = [hashMetaEmail(user.email)];
  if (user.phone) {
    const ph = hashMetaPhone(user.phone);
    if (ph) out.ph = [ph];
  }
  if (user.firstName) {
    const fn = hashMetaFirstName(user.firstName);
    if (fn) out.fn = [fn];
  }
  if (user.clientIp) out.client_ip_address = user.clientIp;
  if (user.clientUserAgent) out.client_user_agent = user.clientUserAgent;
  if (user.fbp) out.fbp = user.fbp;
  if (user.fbc) out.fbc = user.fbc;
  if (user.externalId) out.external_id = [hashMetaExternalId(user.externalId)];

  return out;
}

function buildCustomData(data: MetaCustomData | undefined): Record<string, unknown> | undefined {
  if (!data) return undefined;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    if (v !== undefined && v !== null) out[k] = v;
  }
  return Object.keys(out).length ? out : undefined;
}

/** Envia evento para Meta Conversions API (Graph API). */
export async function sendMetaCapiEvent(input: SendMetaEventInput): Promise<MetaCapiResult> {
  if (!isMetaCapiConfigured()) {
    return { ok: false, error: "Meta CAPI not configured", skipped: true };
  }

  const pixelId = getMetaPixelId()!;
  const accessToken = getMetaCapiAccessToken()!;
  const testCode = getMetaTestEventCode();

  const eventTime = Math.floor(Date.now() / 1000);
  const eventSourceUrl = input.eventSourceUrl ?? getSiteUrl();

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: input.eventName,
        event_time: eventTime,
        event_id: input.eventId,
        event_source_url: eventSourceUrl,
        action_source: "website",
        user_data: buildUserData(input.userData),
        custom_data: buildCustomData(input.customData),
      },
    ],
  };

  if (testCode) payload.test_event_code = testCode;

  const url = `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const body = (await res.json().catch(() => ({}))) as {
      events_received?: number;
      error?: { message?: string };
    };

    if (!res.ok) {
      const msg = body.error?.message ?? `HTTP ${res.status}`;
      console.error("[meta-capi]", input.eventName, msg);
      return { ok: false, error: msg };
    }

    return { ok: true, eventsReceived: body.events_received };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "network_error";
    console.error("[meta-capi]", input.eventName, msg);
    return { ok: false, error: msg };
  }
}

/** Evento principal de otimização — lead quente (formulário completo). */
export async function sendMetaLeadEvent(
  input: SendMetaEventInput & {
    userData: MetaUserData & { email: string; phone: string; firstName: string };
  },
): Promise<MetaCapiResult> {
  return sendMetaCapiEvent({
    ...input,
    eventName: "Lead",
    customData: {
      currency: "BRL",
      value: 197,
      content_name: "Ascend Club",
      ...input.customData,
    },
  });
}

/** Mapeia eventos internos da landing para eventos padrão Meta. */
export function metaEventNameForInternal(eventName: string): string | null {
  switch (eventName) {
    case "PageView":
      return "PageView";
    case "checkout_click":
    case "checkout_modal_open":
      return "InitiateCheckout";
    case "checkout_completed":
      return "Lead";
    default:
      return null;
  }
}
