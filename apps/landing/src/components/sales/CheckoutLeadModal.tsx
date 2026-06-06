"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Loader2, X } from "lucide-react";
import { ATTRIBUTION_COOKIE } from "@/lib/sales/consent";
import { ctaLabel } from "@/lib/sales/cta-labels";
import { parseAttributionCookie, readAttributionFromDocument } from "@/lib/sales/utm";
import { getClientCookie } from "@/lib/sales/utm";
import { getMetaBrowserIds } from "@/lib/sales/meta-attribution";
import { trackMetaLead } from "@/lib/sales/meta-pixel-client";
import { ensureLandingSession, trackEvent } from "@/lib/sales/track-client";
import { buildPersonalizedCheckoutUrl } from "@/lib/sales/checkout-url";
import { openCheckoutInNewTab } from "@/lib/sales/open-checkout";
import { brandCta, brandTypography } from "./brand-preview/tokens";
import {
  formatBrazilMobilePhone,
  isValidBrazilMobilePhone,
  stripPhoneDigits,
  BR_MOBILE_PHONE_PLACEHOLDER,
} from "@/lib/sales/br-phone";
import { cn } from "@/lib/utils";

type Step = "name" | "email" | "phone";

const STEP_ORDER: Step[] = ["name", "email", "phone"];

type Props = {
  open: boolean;
  onClose: () => void;
  checkoutUrl: string;
  trackLabel?: string;
};

function readUtm() {
  const rawAttribution = getClientCookie(ATTRIBUTION_COOKIE);
  const fromCookie = parseAttributionCookie(rawAttribution);
  const utm = { ...readAttributionFromDocument(), ...(fromCookie ?? {}) };
  return Object.keys(utm).length ? utm : undefined;
}

const stepCopy: Record<Step, { title: string; hint: string }> = {
  name: {
    title: "Como podemos te chamar?",
    hint: "Só seu primeiro nome — para personalizar o suporte e a confirmação.",
  },
  email: {
    title: "Seu melhor e-mail",
    hint: "Para liberar seu acesso ao checkout seguro da Kiwify.",
  },
  phone: {
    title: "Seu WhatsApp",
    hint: "Usamos só para suporte — em seguida você vai para o pagamento.",
  },
};

export default function CheckoutLeadModal({ open, onClose, checkoutUrl: _checkoutUrl, trackLabel }: Props) {
  const [step, setStep] = useState<Step>("name");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const completedRef = useRef(false);
  const openedRef = useRef(false);

  const reset = useCallback(() => {
    setStep("name");
    setFirstName("");
    setEmail("");
    setPhone("");
    setStatus("idle");
    setErrorMsg(null);
    completedRef.current = false;
    openedRef.current = false;
  }, []);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || openedRef.current) return;
    openedRef.current = true;
    void ensureLandingSession();
    trackEvent("checkout_modal_open", {
      cta: trackLabel,
      cta_label: ctaLabel(trackLabel),
    });
  }, [open, trackLabel]);

  if (!open) return null;

  const stepIndex = STEP_ORDER.indexOf(step);
  const firstNameValue = firstName.trim().split(/\s+/)[0] ?? "";
  const nameOk = firstNameValue.length >= 2;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const phoneDigits = stripPhoneDigits(phone);
  const phoneOk = isValidBrazilMobilePhone(phone);

  const goToKiwify = (url: string) => {
    openCheckoutInNewTab(url);
    onClose();
  };

  const buildCheckoutUrl = () =>
    buildPersonalizedCheckoutUrl(
      {
        email: email.trim().toLowerCase(),
        name: firstNameValue,
        phone: phoneDigits,
      },
      readUtm(),
    );

  const reportAbandon = () => {
    if (completedRef.current) return;
    const hasProgress = nameOk || emailOk || phone.length > 0;
    if (!hasProgress) return;

    trackEvent("checkout_modal_abandon", {
      cta: trackLabel,
      cta_label: ctaLabel(trackLabel),
      step,
      has_name: nameOk,
      has_email: emailOk,
      has_phone: phone.length > 0,
    });

    void ensureLandingSession().then(() =>
      fetch("/api/sales/lead", {
      method: "POST",
      headers: (() => {
        const h: Record<string, string> = { "Content-Type": "application/json" };
        try {
          const sid = sessionStorage.getItem("ascend_session_id");
          if (sid) h["X-Ascend-Session"] = sid;
        } catch {
          /* ignore */
        }
        return h;
      })(),
      credentials: "same-origin",
      keepalive: true,
      body: JSON.stringify({
        type: "abandon",
        step,
        cta: trackLabel,
        first_name: nameOk ? firstNameValue : undefined,
        email: emailOk ? email.trim().toLowerCase() : undefined,
        phone: phoneDigits.length >= 8 ? phoneDigits : undefined,
        utm: readUtm(),
      }),
      }),
    ).catch(() => undefined);
  };

  const handleClose = () => {
    reportAbandon();
    onClose();
  };

  const goBack = () => {
    setErrorMsg(null);
    if (step === "email") setStep("name");
    else if (step === "phone") setStep("email");
  };

  const goNext = () => {
    setErrorMsg(null);
    if (step === "name" && nameOk) {
      trackEvent("checkout_modal_step", { step: "name", next: "email", cta: trackLabel });
      setStep("email");
    } else if (step === "email" && emailOk) {
      trackEvent("checkout_modal_step", { step: "email", next: "phone", cta: trackLabel });
      setStep("phone");
    }
  };

  const submitAndCheckout = async () => {
    if (!phoneOk) return;
    setStatus("loading");
    setErrorMsg(null);

    const personalizedUrl = buildCheckoutUrl();
    completedRef.current = true;
    goToKiwify(personalizedUrl);

    try {
      await ensureLandingSession();
      const leadEventId = crypto.randomUUID();
      const metaIds = getMetaBrowserIds();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      try {
        const sid = sessionStorage.getItem("ascend_session_id");
        if (sid) headers["X-Ascend-Session"] = sid;
      } catch {
        /* ignore */
      }

      const res = await fetch("/api/sales/lead", {
        method: "POST",
        headers,
        credentials: "same-origin",
        keepalive: true,
        body: JSON.stringify({
          type: "complete",
          full_name: firstNameValue,
          email: email.trim().toLowerCase(),
          phone: phoneDigits,
          marketing_consent: true,
          cta: trackLabel,
          utm: readUtm(),
          meta: {
            event_id: leadEventId,
            ...metaIds,
          },
        }),
      });

      trackMetaLead(leadEventId, trackLabel);
      trackEvent("checkout_completed", {
        cta: trackLabel,
        cta_label: ctaLabel(trackLabel),
        meta_event_id: leadEventId,
      });

      if (!res.ok) {
        console.error("[checkout] lead save failed", await res.text().catch(() => ""));
      }
    } catch (err) {
      console.error("[checkout] lead save error", err);
    } finally {
      setStatus("idle");
    }
  };

  const { title, hint } = stepCopy[step];
  const canContinue =
    (step === "name" && nameOk) || (step === "email" && emailOk) || (step === "phone" && phoneOk);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Dados para continuar ao pagamento"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        aria-label="Fechar"
        onClick={handleClose}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#111] p-6 sm:p-8 shadow-2xl">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <p className={cn(brandTypography.eyebrow, "text-[10px] mb-2")}>Quase lá</p>
        <h2 className="text-xl font-black text-white uppercase tracking-tight mb-2">{title}</h2>
        <p className="text-sm text-white/55 font-inter mb-6 leading-relaxed">{hint}</p>

        <div className="flex gap-2 mb-6">
          {STEP_ORDER.map((s, i) => (
            <span
              key={s}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                i <= stepIndex ? "bg-primary" : "bg-white/10",
              )}
            />
          ))}
        </div>

        <div className="space-y-4">
          {step === "name" && (
            <input
              type="text"
              autoComplete="given-name"
              placeholder="Seu primeiro nome"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3.5 text-white text-sm font-inter placeholder:text-white/30 focus:border-primary/50 focus:outline-none"
            />
          )}
          {step === "email" && (
            <input
              type="email"
              autoComplete="email"
              placeholder="voce@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3.5 text-white text-sm font-inter placeholder:text-white/30 focus:border-primary/50 focus:outline-none"
            />
          )}
          {step === "phone" && (
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder={BR_MOBILE_PHONE_PLACEHOLDER}
              value={phone}
              onChange={(e) => setPhone(formatBrazilMobilePhone(e.target.value))}
              maxLength={16}
              className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3.5 text-white text-sm font-inter placeholder:text-white/30 focus:border-primary/50 focus:outline-none"
            />
          )}

          {errorMsg && <p className="text-xs text-red-400 font-inter">{errorMsg}</p>}

          {step === "phone" ? (
            <button
              type="button"
              disabled={!canContinue || status === "loading"}
              onClick={() => void submitAndCheckout()}
              className={cn(brandCta.primary, "w-full py-4 text-base disabled:opacity-45")}
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Salvando…
                </>
              ) : (
                <>
                  Ir para pagamento
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              disabled={!canContinue}
              onClick={goNext}
              className={cn(brandCta.primary, "w-full py-4 text-base disabled:opacity-45")}
            >
              Continuar
              <ArrowRight className="w-5 h-5" />
            </button>
          )}

          {stepIndex > 0 && (
            <button
              type="button"
              onClick={goBack}
              className="w-full text-xs font-inter font-bold uppercase text-white/40 hover:text-white/60"
            >
              Voltar
            </button>
          )}
        </div>

        <p className="mt-5 text-[10px] text-white/35 font-inter leading-relaxed">
          Ao continuar, você concorda em receber comunicações sobre o programa. Pagamento processado
          pela Kiwify.
        </p>
      </div>
    </div>
  );
}
