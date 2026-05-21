"use client";

export type TrackPayload = Record<string, unknown>;

export function trackEvent(eventName: string, payload?: TrackPayload) {
  if (typeof window === "undefined") return;

  const eventId = crypto.randomUUID();
  const body = JSON.stringify({
    event_name: eventName,
    event_id: eventId,
    page: window.location.pathname,
    payload: payload ?? {},
  });

  fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    /* falha silenciosa — não bloqueia UX */
  });
}
