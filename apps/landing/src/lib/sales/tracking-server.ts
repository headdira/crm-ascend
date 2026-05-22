import { createServiceSupabase, type Json, type TablesUpdate } from "@crm-ascend/db";
import { hashEmail, hashIdentifier, hashPhone } from "@crm-ascend/validation";
import { getHashSalt } from "@/lib/env";
import { COLD_LEAD_NAME, LEAD_STATUS_FRIO, LEAD_STATUS_QUENTE } from "@/lib/sales/lead-temperature";
import { SESSION_COOKIE } from "@/lib/sales/session-constants";
import { parseAttributionCookie } from "@/lib/sales/utm";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function newSessionId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function getSessionIdFromRequest(request: Request): string | null {
  const header = request.headers.get("x-ascend-session")?.trim();
  if (header && UUID_RE.test(header)) return header;

  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(new RegExp(`(?:^|; )${SESSION_COOKIE}=([^;]*)`));
  const fromCookie = match?.[1]?.trim();
  if (fromCookie && UUID_RE.test(fromCookie)) return fromCookie;

  return null;
}

function hashIp(ip: string, salt: string): string {
  return hashIdentifier(ip, salt);
}

function parseUserAgent(ua: string | null): { device: string | null; os: string | null } {
  if (!ua) return { device: null, os: null };
  const device = /Mobile|Android|iPhone|iPad/i.test(ua) ? "mobile" : "desktop";
  let os: string | null = null;
  if (/Windows/i.test(ua)) os = "windows";
  else if (/Mac OS X|Macintosh/i.test(ua)) os = "macos";
  else if (/Android/i.test(ua)) os = "android";
  else if (/iPhone|iPad/i.test(ua)) os = "ios";
  else if (/Linux/i.test(ua)) os = "linux";
  return { device, os };
}

function readAttributionFromRequest(request: Request): Json {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(/(?:^|; )ascend_attribution=([^;]*)/);
  return (parseAttributionCookie(match?.[1]) ?? {}) as Json;
}

export async function upsertLandingSession(request: Request, sessionId: string, page?: string) {
  const supabase = createServiceSupabase();
  const salt = getHashSalt();
  const now = new Date().toISOString();

  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "";
  const ua = request.headers.get("user-agent");
  const { device, os } = parseUserAgent(ua);
  const utmFromCookie = readAttributionFromRequest(request);
  const referrer = request.headers.get("referer");

  const { data: existing } = await supabase
    .from("landing_sessions")
    .select("id, utm")
    .eq("id", sessionId)
    .maybeSingle();

  const mergedUtm = {
    ...((existing?.utm as Record<string, unknown> | undefined) ?? {}),
    ...(utmFromCookie as Record<string, unknown>),
  } as Json;

  const row = {
    last_seen: now,
    ip_hash: ip ? hashIp(ip, salt) : null,
    user_agent: ua,
    device,
    os,
    country: request.headers.get("cf-ipcountry"),
    city: request.headers.get("cf-ipcity"),
    utm: mergedUtm,
    referrer,
    landing_path: page ?? null,
  };

  if (existing) {
    await supabase.from("landing_sessions").update(row).eq("id", sessionId);
  } else {
    await supabase.from("landing_sessions").insert({
      id: sessionId,
      first_seen: now,
      ...row,
    });
  }
}

function metaCapiStatus(): string {
  return process.env.META_CAPI_ACCESS_TOKEN && process.env.META_PIXEL_ID ? "pending" : "skipped";
}

export async function insertLandingEvent(
  sessionId: string,
  input: {
    event_name: string;
    event_id: string;
    page?: string;
    payload?: Json;
  },
) {
  const supabase = createServiceSupabase();
  const now = new Date().toISOString();

  const { error } = await supabase.from("landing_events").insert({
    session_id: sessionId,
    event_name: input.event_name,
    event_id: input.event_id,
    page: input.page ?? null,
    payload: (input.payload ?? {}) as Json,
    meta_capi_status: metaCapiStatus(),
    ga4_status: process.env.GA4_MEASUREMENT_ID ? "pending" : "skipped",
    ts: now,
  });

  if (error?.code === "23505") {
    return { duplicate: true as const };
  }
  if (error) throw error;

  return { duplicate: false as const };
}

function coldQuizAnswers(extra?: Record<string, unknown>): Json {
  return {
    lead_temperature: "frio",
    anonymous: true,
    ...extra,
  } as Json;
}

/** Lead frio: criado no 1º acesso / evento — vinculado à sessão para jornada no CRM */
export async function ensureColdLeadForSession(
  sessionId: string,
  opts?: { lastEventAt?: string; eventName?: string },
) {
  const supabase = createServiceSupabase();
  const salt = getHashSalt();
  const now = opts?.lastEventAt ?? new Date().toISOString();

  const { data: session } = await supabase
    .from("landing_sessions")
    .select("utm")
    .eq("id", sessionId)
    .maybeSingle();

  const { data: existing } = await supabase
    .from("leads")
    .select("id, status, quiz_answers, reached_kiwify_at")
    .eq("session_id", sessionId)
    .maybeSingle();

  if (existing) {
    const patch: TablesUpdate<"leads"> = { last_event_at: now };
    if (existing.status !== LEAD_STATUS_QUENTE && existing.status !== "converted") {
      patch.status = LEAD_STATUS_FRIO;
    }
    const prev = (existing.quiz_answers ?? {}) as Record<string, unknown>;
    patch.quiz_answers = {
      ...prev,
      lead_temperature: existing.status === LEAD_STATUS_QUENTE ? "quente" : "frio",
      last_event_name: opts?.eventName ?? prev.last_event_name,
    } as Json;
    await supabase.from("leads").update(patch).eq("id", existing.id);
    return existing.id;
  }

  const emailHash = hashIdentifier(`session:${sessionId}`, salt);
  const { data, error } = await supabase
    .from("leads")
    .insert({
      full_name: COLD_LEAD_NAME,
      email_hash: emailHash,
      source: "landing",
      session_id: sessionId,
      utm: (session?.utm ?? {}) as Json,
      quiz_answers: coldQuizAnswers({
        journey_started_at: now,
        first_event_name: opts?.eventName ?? "session_start",
      }),
      status: LEAD_STATUS_FRIO,
      reached_kiwify_at: null,
      last_event_at: now,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

export async function promoteLeadToQuente(
  leadId: string,
  extra: Record<string, unknown>,
) {
  const supabase = createServiceSupabase();
  const now = new Date().toISOString();

  const { data: lead } = await supabase
    .from("leads")
    .select("quiz_answers")
    .eq("id", leadId)
    .single();

  const prev = (lead?.quiz_answers ?? {}) as Record<string, unknown>;

  await supabase
    .from("leads")
    .update({
      status: LEAD_STATUS_QUENTE,
      reached_kiwify_at: now,
      last_event_at: now,
      quiz_answers: {
        ...prev,
        lead_temperature: "quente",
        ...extra,
      } as Json,
    })
    .eq("id", leadId);
}

export async function upsertIdentifiedLead(
  request: Request,
  sessionId: string,
  input: {
    full_name: string;
    email: string;
    phone?: string;
  },
) {
  const supabase = createServiceSupabase();
  const salt = getHashSalt();
  const now = new Date().toISOString();
  const utm = readAttributionFromRequest(request);

  await upsertLandingSession(request, sessionId);

  const { data: session } = await supabase
    .from("landing_sessions")
    .select("utm")
    .eq("id", sessionId)
    .maybeSingle();

  const mergedUtm = {
    ...((session?.utm as Record<string, unknown> | undefined) ?? {}),
    ...(utm as Record<string, unknown>),
  } as Json;

  const emailHash = hashEmail(input.email, salt);
  const phoneHash = input.phone ? hashPhone(input.phone, salt) : null;

  const { data: existing } = await supabase
    .from("leads")
    .select("id, quiz_answers, status")
    .eq("session_id", sessionId)
    .maybeSingle();

  const prevQuiz = (existing?.quiz_answers ?? {}) as Record<string, unknown>;

  const base = {
    full_name: input.full_name,
    email_hash: emailHash,
    phone_hash: phoneHash,
    email_enc: input.email,
    phone_enc: input.phone ?? null,
    utm: mergedUtm,
    quiz_answers: {
      ...prevQuiz,
      lead_temperature: "quente",
      marketing_consent: true,
    } as Json,
    last_event_at: now,
    status: LEAD_STATUS_QUENTE,
  };

  if (existing) {
    const { data, error } = await supabase
      .from("leads")
      .update(base)
      .eq("id", existing.id)
      .select("id")
      .single();
    if (error) throw error;
    return data.id;
  }

  const { data, error } = await supabase
    .from("leads")
    .insert({
      ...base,
      source: "landing",
      session_id: sessionId,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}
