import { ATTRIBUTION_COOKIE } from "./consent";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "fbclid",
  "gclid",
] as const;

export type Attribution = Record<string, string> & {
  landing_path?: string;
  captured_at?: string;
};

export function readAttributionFromSearch(search: string, pathname: string): Attribution | null {
  const params = new URLSearchParams(search);
  const utm: Attribution = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) utm[key] = value;
  }
  if (Object.keys(utm).length === 0) return null;
  utm.landing_path = pathname;
  utm.captured_at = new Date().toISOString();
  return utm;
}

export function serializeAttribution(data: Attribution): string {
  return encodeURIComponent(JSON.stringify(data));
}

export function parseAttributionCookie(raw: string | undefined): Attribution | null {
  if (!raw) return null;
  try {
    return JSON.parse(decodeURIComponent(raw)) as Attribution;
  } catch {
    return null;
  }
}

export function appendAttributionToUrl(baseUrl: string, attribution: Attribution | null): string {
  if (!attribution) return baseUrl;
  const url = new URL(baseUrl);
  for (const key of UTM_KEYS) {
    const value = attribution[key];
    if (value) url.searchParams.set(key, value);
  }
  return url.toString();
}

export function getClientCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? match[1] : undefined;
}

export function setClientCookie(name: string, value: string, maxAge: number) {
  const secure = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
}

export function readAttributionFromDocument(): Attribution | null {
  return parseAttributionCookie(getClientCookie(ATTRIBUTION_COOKIE));
}
