"use client";

import { useEffect, useState } from "react";
import {
  CONSENT_COOKIE,
  CONSENT_MAX_AGE,
  defaultConsent,
  parseConsent,
  type ConsentState,
} from "@/lib/sales/consent";
import { getClientCookie, setClientCookie } from "@/lib/sales/utm";

function saveConsent(state: ConsentState) {
  const payload = encodeURIComponent(JSON.stringify(state));
  setClientCookie(CONSENT_COOKIE, payload, CONSENT_MAX_AGE);
  window.dispatchEvent(new CustomEvent("ascend:consent_change", { detail: state }));
}

export default function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const existing = parseConsent(getClientCookie(CONSENT_COOKIE));
    if (!existing) setOpen(true);
  }, []);

  const apply = (state: ConsentState) => {
    saveConsent(state);
    setOpen(false);
    setCustomize(false);
  };

  const acceptAll = () =>
    apply({
      necessary: true,
      analytics: true,
      marketing: true,
      updatedAt: new Date().toISOString(),
    });

  const rejectOptional = () => apply(defaultConsent());

  const saveCustom = () =>
    apply({
      necessary: true,
      analytics,
      marketing,
      updatedAt: new Date().toISOString(),
    });

  if (!open) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[60] p-4 sm:p-6"
      role="dialog"
      aria-label="Preferências de cookies"
    >
      <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-[#111] p-5 sm:p-6 shadow-2xl">
        <p className="font-inter text-sm text-white/80 leading-relaxed">
          Usamos cookies necessários para atribuição de campanha (UTM) e, com seu consentimento,
          cookies de análise e marketing. Leia nossa{" "}
          <a href="/privacidade" className="text-primary underline underline-offset-2">
            Política de Privacidade
          </a>
          .
        </p>

        {customize && (
          <div className="mt-4 space-y-3 text-sm font-inter text-white/70">
            <label className="flex items-center gap-2 opacity-60">
              <input type="checkbox" checked disabled readOnly className="accent-primary" />
              Necessários (sempre ativos)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="accent-primary"
              />
              Análise de uso (ex.: páginas visitadas)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="accent-primary"
              />
              Marketing e remarketing
            </label>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={rejectOptional}
            className="rounded-lg border border-white/15 px-4 py-2.5 text-xs font-inter font-bold uppercase text-white/70 hover:bg-white/5"
          >
            Recusar opcionais
          </button>
          <button
            type="button"
            onClick={() => setCustomize((v) => !v)}
            className="rounded-lg border border-white/15 px-4 py-2.5 text-xs font-inter font-bold uppercase text-white/70 hover:bg-white/5"
          >
            Personalizar
          </button>
          <button
            type="button"
            onClick={customize ? saveCustom : acceptAll}
            className="rounded-lg bg-primary px-4 py-2.5 text-xs font-inter font-black uppercase text-black hover:brightness-110"
          >
            {customize ? "Salvar preferências" : "Aceitar todos"}
          </button>
        </div>
      </div>
    </div>
  );
}
