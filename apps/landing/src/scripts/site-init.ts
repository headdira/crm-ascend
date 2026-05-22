const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "fbclid",
  "gclid",
] as const;

const ATTRIBUTION_COOKIE = "ascend_attribution";
const ATTRIBUTION_MAX_AGE = 60 * 60 * 24 * 30;

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; samesite=lax`;
}

function initLightExperience() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
    .connection;
  const saveData = conn?.saveData === true;
  const slow =
    conn?.effectiveType != null && ["slow-2g", "2g", "3g"].includes(conn.effectiveType);
  const isLight = reduced || saveData || slow;
  document.documentElement.toggleAttribute("data-light", isLight);
}

function captureAttribution() {
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) utm[key] = value;
  }
  if (Object.keys(utm).length === 0) return;
  utm.landing_path = window.location.pathname;
  utm.captured_at = new Date().toISOString();
  setCookie(ATTRIBUTION_COOKIE, encodeURIComponent(JSON.stringify(utm)), ATTRIBUTION_MAX_AGE);
}

import { ensureLandingSession } from "@/lib/sales/track-client";

export function initSite() {
  initLightExperience();
  captureAttribution();
  void ensureLandingSession();
}

initSite();
