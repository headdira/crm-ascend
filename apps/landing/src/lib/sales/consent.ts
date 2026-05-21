export type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

export const CONSENT_COOKIE = "ascend_consent";
export const ATTRIBUTION_COOKIE = "ascend_attribution";
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 180; // 180 days

export function parseConsent(raw: string | undefined): ConsentState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as ConsentState;
    if (parsed && typeof parsed.analytics === "boolean") return parsed;
  } catch {
    /* ignore */
  }
  return null;
}

export function defaultConsent(): ConsentState {
  return {
    necessary: true,
    analytics: false,
    marketing: false,
    updatedAt: new Date().toISOString(),
  };
}
