"use client";

import { getMetaPixelId } from "./meta-config";

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

type Fbq = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  loaded: boolean;
  version: string;
  push: Fbq;
};

let pixelInitialized = false;

export function initMetaPixel(): boolean {
  if (typeof window === "undefined") return false;
  const pixelId = getMetaPixelId();
  if (!pixelId || pixelInitialized) return Boolean(window.fbq);

  if (!window.fbq) {
    const q: Fbq = function (...args: unknown[]) {
      if (q.callMethod) {
        q.callMethod(...args);
      } else {
        q.queue.push(args);
      }
    } as Fbq;
    q.queue = [];
    q.loaded = true;
    q.version = "2.0";
    q.push = q;
    window.fbq = q;
    if (!window._fbq) window._fbq = q;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  window.fbq!("init", pixelId);
  window.fbq!("track", "PageView");
  pixelInitialized = true;
  return true;
}

export function trackMetaPixel(
  eventName: string,
  params?: Record<string, unknown>,
  eventId?: string,
): void {
  if (typeof window === "undefined" || !window.fbq) return;
  if (eventId) {
    window.fbq("track", eventName, params ?? {}, { eventID: eventId });
  } else {
    window.fbq("track", eventName, params ?? {});
  }
}

export function trackMetaInitiateCheckout(eventId: string, cta?: string): void {
  trackMetaPixel(
    "InitiateCheckout",
    {
      content_name: "Ascend Club",
      currency: "BRL",
      value: 197,
      ...(cta ? { content_category: cta } : {}),
    },
    eventId,
  );
}

export function trackMetaLead(eventId: string, cta?: string): void {
  trackMetaPixel(
    "Lead",
    {
      content_name: "Ascend Club",
      currency: "BRL",
      value: 197,
      ...(cta ? { content_category: cta } : {}),
    },
    eventId,
  );
}
