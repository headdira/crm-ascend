"use client";

import { getMetaBrowserIds } from "./meta-attribution";

export type TrackPayload = Record<string, unknown>;

const SESSION_STORAGE_KEY = "ascend_session_id";

let sessionReady: Promise<string | null> | null = null;

function getStoredSessionId(): string | null {
  try {
    return sessionStorage.getItem(SESSION_STORAGE_KEY);
  } catch {
    return null;
  }
}

function trackingHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const sid = getStoredSessionId();
  if (sid) headers["X-Ascend-Session"] = sid;
  return headers;
}

export function ensureLandingSession(): Promise<string | null> {
  if (typeof window === "undefined") return Promise.resolve(null);

  if (!sessionReady) {
    sessionReady = fetch("/api/session", {
      method: "POST",
      credentials: "same-origin",
      headers: trackingHeaders(),
    })
      .then(async (res) => {
        if (!res.ok) return getStoredSessionId();
        const data = (await res.json()) as { session_id?: string };
        if (data.session_id) {
          try {
            sessionStorage.setItem(SESSION_STORAGE_KEY, data.session_id);
          } catch {
            /* ignore */
          }
        }
        return data.session_id ?? getStoredSessionId();
      })
      .catch(() => getStoredSessionId());
  }

  return sessionReady;
}

export function trackEvent(eventName: string, payload?: TrackPayload) {
  if (typeof window === "undefined") return;

  void ensureLandingSession().then(() => {
    const body = JSON.stringify({
      event_name: eventName,
      event_id: crypto.randomUUID(),
      page: window.location.pathname,
      payload: {
        ...payload,
        browser: getBrowserSnapshot(),
        meta: getMetaBrowserIds(),
      },
    });

    fetch("/api/events", {
      method: "POST",
      headers: trackingHeaders(),
      credentials: "same-origin",
      body,
      keepalive: true,
    }).catch(() => undefined);
  });
}

function getBrowserSnapshot() {
  const ua = navigator.userAgent;
  const mobile = /Mobile|Android|iPhone|iPad/i.test(ua);
  let os: string | null = null;
  if (/Windows/i.test(ua)) os = "windows";
  else if (/Mac OS X|Macintosh/i.test(ua)) os = "macos";
  else if (/Android/i.test(ua)) os = "android";
  else if (/iPhone|iPad/i.test(ua)) os = "ios";
  else if (/Linux/i.test(ua)) os = "linux";

  return {
    user_agent: ua,
    language: navigator.language,
    device: mobile ? "mobile" : "desktop",
    os,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
  };
}
