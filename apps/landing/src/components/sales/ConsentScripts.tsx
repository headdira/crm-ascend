"use client";

import { useEffect } from "react";
import { parseConsent } from "@/lib/sales/consent";
import { CONSENT_COOKIE } from "@/lib/sales/consent";
import { getClientCookie } from "@/lib/sales/utm";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

function loadWhenIdle(fn: () => void) {
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(fn, { timeout: 3000 });
  } else {
    setTimeout(fn, 2000);
  }
}

export default function ConsentScripts() {
  useEffect(() => {
    const run = () => {
      const consent = parseConsent(getClientCookie(CONSENT_COOKIE));
      if (!consent?.analytics || !GA_ID) return;

      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag(...args: unknown[]) {
        window.dataLayer?.push(args);
      }
      window.gtag = gtag;
      gtag("js", new Date());
      gtag("config", GA_ID, { anonymize_ip: true });

      const onCta = (e: Event) => {
        const detail = (e as CustomEvent<{ label?: string }>).detail;
        gtag("event", "cta_click", { event_label: detail?.label });
      };
      window.addEventListener("ascend:cta_click", onCta);
      return () => window.removeEventListener("ascend:cta_click", onCta);
    };

    const onConsent = () => loadWhenIdle(run);
    window.addEventListener("ascend:consent_change", onConsent);
    loadWhenIdle(run);

    return () => window.removeEventListener("ascend:consent_change", onConsent);
  }, []);

  return null;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
