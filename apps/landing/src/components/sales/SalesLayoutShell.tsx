"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import LightExperienceInit from "@/components/sales/LightExperienceInit";
import DeferredClient from "@/components/sales/DeferredClient";

const StarfieldBackground = dynamic(() => import("@/components/sales/StarfieldBackground"), {
  ssr: false,
  loading: () => null,
});
const AttributionCapture = dynamic(() => import("@/components/sales/AttributionCapture"), {
  ssr: false,
  loading: () => null,
});
const CookieConsent = dynamic(() => import("@/components/sales/CookieConsent"), {
  ssr: false,
  loading: () => null,
});
const ConsentScripts = dynamic(() => import("@/components/sales/ConsentScripts"), {
  ssr: false,
  loading: () => null,
});

export default function SalesLayoutShell({ children }: { children: ReactNode }) {
  return (
    <div className="sales-landing sales-landing-brand relative min-h-screen bg-[#0a0a0a] text-[#fafafa] overflow-x-hidden">
      <DeferredClient idleMs={800}>
        <StarfieldBackground />
      </DeferredClient>
      <DeferredClient idleMs={400}>
        <AttributionCapture />
      </DeferredClient>
      <LightExperienceInit />
      <div className="relative z-[1]">{children}</div>
      <DeferredClient idleMs={1500}>
        <CookieConsent />
        <ConsentScripts />
      </DeferredClient>
    </div>
  );
}
