"use client";

export type TrackPayload = Record<string, unknown>;

let sessionReady: Promise<void> | null = null;

export function ensureLandingSession(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (!sessionReady) {
    sessionReady = fetch("/api/session", {
      method: "POST",
      credentials: "same-origin",
    })
      .then(() => undefined)
      .catch(() => undefined);
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
      },
    });

    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body,
      keepalive: true,
    }).catch(() => {
      /* falha silenciosa */
    });
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
