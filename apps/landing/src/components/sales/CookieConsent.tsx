"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  const [leadOpen, setLeadOpen] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadStatus, setLeadStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");

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

  const submitLead = async () => {
    if (!marketing) return;
    setLeadStatus("loading");
    try {
      const res = await fetch("/api/sales/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: leadName,
          email: leadEmail,
          marketing_consent: true,
        }),
      });
      if (!res.ok) throw new Error("fail");
      setLeadStatus("ok");
      setLeadName("");
      setLeadEmail("");
    } catch {
      setLeadStatus("err");
    }
  };

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
          <Link href="/privacidade" className="text-primary underline underline-offset-2">
            Política de Privacidade
          </Link>
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
            {marketing && (
              <div className="pt-2 border-t border-white/10">
                <button
                  type="button"
                  className="text-primary text-xs font-bold uppercase tracking-wide"
                  onClick={() => setLeadOpen((v) => !v)}
                >
                  {leadOpen ? "Ocultar" : "Quero receber informações por e-mail"}
                </button>
                {leadOpen && (
                  <div className="mt-3 grid gap-2">
                    <input
                      className="rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-white text-sm"
                      placeholder="Seu nome"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                    />
                    <input
                      className="rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-white text-sm"
                      placeholder="Seu e-mail"
                      type="email"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={submitLead}
                      disabled={leadStatus === "loading" || !leadName || !leadEmail}
                      className="rounded-lg bg-primary text-black font-bold text-xs uppercase py-2 disabled:opacity-50"
                    >
                      Enviar
                    </button>
                    {leadStatus === "ok" && (
                      <p className="text-xs text-green-400">Recebemos seus dados. Obrigado!</p>
                    )}
                    {leadStatus === "err" && (
                      <p className="text-xs text-red-400">Não foi possível enviar. Tente de novo.</p>
                    )}
                  </div>
                )}
              </div>
            )}
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
