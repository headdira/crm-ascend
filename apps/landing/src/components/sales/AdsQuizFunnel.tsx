"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import type { AdsQuizConfig, AdsQuizStep } from "@crm-ascend/validation";
import { DEFAULT_ADS_QUIZ_CONFIG } from "@crm-ascend/validation";
import { ATTRIBUTION_COOKIE } from "@/lib/sales/consent";
import { parseAttributionCookie, readAttributionFromDocument, getClientCookie } from "@/lib/sales/utm";
import { getMetaBrowserIds } from "@/lib/sales/meta-attribution";
import { trackMetaLead } from "@/lib/sales/meta-pixel-client";
import { ensureLandingSession, trackEvent } from "@/lib/sales/track-client";
import { buildPersonalizedCheckoutUrl } from "@/lib/sales/checkout-url";
import { openCheckoutInNewTab } from "@/lib/sales/open-checkout";
import { brandCta, brandTypography } from "@/components/sales/brand-preview/tokens";
import { cn } from "@/lib/utils";

type Phase = "landing" | "steps" | "contact";
type ContactStep = "name" | "email" | "phone";

function readUtm() {
  const rawAttribution = getClientCookie(ATTRIBUTION_COOKIE);
  const fromCookie = parseAttributionCookie(rawAttribution);
  const utm = { ...readAttributionFromDocument(), ...(fromCookie ?? {}) };
  return Object.keys(utm).length ? utm : undefined;
}

function normalizePhone(value: string): string {
  return value.replace(/\D/g, "");
}

export default function AdsQuizFunnel() {
  const [config, setConfig] = useState<AdsQuizConfig | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [phase, setPhase] = useState<Phase>("landing");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [contactStep, setContactStep] = useState<ContactStep>("name");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void ensureLandingSession().then(() => {
      trackEvent("PageView", { title: "Quiz anúncios", page: "/form" });
    });
  }, []);

  useEffect(() => {
    void fetch("/api/quiz/config")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j: { config: AdsQuizConfig }) => setConfig(j.config))
      .catch(() => {
        setLoadError(true);
        setConfig(DEFAULT_ADS_QUIZ_CONFIG);
      });
  }, []);

  const steps = config?.steps ?? [];
  const currentStep: AdsQuizStep | undefined = steps[stepIndex];

  const progressTotal = steps.length + 3;
  const progressDone = useMemo(() => {
    if (phase === "landing") return 0;
    if (phase === "steps") return stepIndex + 1;
    const contactOffset = { name: 1, email: 2, phone: 3 }[contactStep];
    return steps.length + contactOffset;
  }, [phase, stepIndex, contactStep, steps.length]);

  const persistProgress = useCallback(
    (stepId: string, nextAnswers: Record<string, string>) => {
      void ensureLandingSession().then(() =>
        fetch("/api/sales/lead", {
          method: "POST",
          headers: sessionHeaders(),
          credentials: "same-origin",
          keepalive: true,
          body: JSON.stringify({
            type: "quiz_progress",
            step_id: stepId,
            answers: nextAnswers,
            utm: readUtm(),
          }),
        }),
      );
    },
    [],
  );

  const pickOption = (stepId: string, optionId: string) => {
    const next = { ...answers, [stepId]: optionId };
    setAnswers(next);
    persistProgress(stepId, next);
    trackEvent("quiz_step", { step_id: stepId, option_id: optionId });
    if (stepIndex < steps.length - 1) setStepIndex((i) => i + 1);
    else setPhase("contact");
  };

  const advanceMessageOrOffer = () => {
    if (!currentStep) return;
    trackEvent("quiz_step", { step_id: currentStep.id, action: "continue" });
    if (stepIndex < steps.length - 1) setStepIndex((i) => i + 1);
    else setPhase("contact");
  };

  const startQuiz = () => {
    trackEvent("quiz_start", { cta: "quiz_form" });
    setPhase("steps");
    setStepIndex(0);
  };

  const firstNameValue = firstName.trim().split(/\s+/)[0] ?? "";
  const nameOk = firstNameValue.length >= 2;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const phoneDigits = normalizePhone(phone);
  const phoneOk = phoneDigits.length >= 10;

  const finishCheckout = async () => {
    if (!phoneOk || !config) return;
    setSubmitting(true);
    const personalizedUrl = buildPersonalizedCheckoutUrl(
      {
        email: email.trim().toLowerCase(),
        name: firstNameValue,
        phone: phoneDigits,
      },
      readUtm(),
    );
    openCheckoutInNewTab(personalizedUrl);

    try {
      await ensureLandingSession();
      const leadEventId = crypto.randomUUID();
      const metaIds = getMetaBrowserIds();
      await fetch("/api/sales/lead", {
        method: "POST",
        headers: sessionHeaders(),
        credentials: "same-origin",
        keepalive: true,
        body: JSON.stringify({
          type: "quiz_complete",
          full_name: firstNameValue,
          email: email.trim().toLowerCase(),
          phone: phoneDigits,
          marketing_consent: true,
          cta: "quiz_form",
          utm: readUtm(),
          answers,
          meta: { event_id: leadEventId, ...metaIds },
        }),
      });
      trackMetaLead(leadEventId, "quiz_form");
      trackEvent("checkout_completed", {
        cta: "quiz_form",
        cta_label: "Quiz anúncios",
        meta_event_id: leadEventId,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!config) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-white/50 font-inter">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const { landing, contact } = config;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-white/5 px-6 py-4">
        <p className={cn(brandTypography.eyebrow, "text-[10px] text-center")}>Ascend Club</p>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-6 py-10">
        {progressDone > 0 && (
          <div className="flex gap-1.5 mb-8">
            {Array.from({ length: progressTotal }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  i < progressDone ? "bg-primary" : "bg-white/10",
                )}
              />
            ))}
          </div>
        )}

        {phase === "landing" && (
          <div className="space-y-6">
            <p className={cn(brandTypography.eyebrow, "text-[11px]")}>{landing.eyebrow}</p>
            <h1 className={cn(brandTypography.h1, "text-3xl sm:text-4xl")}>{landing.headline}</h1>
            <p className={cn(brandTypography.body, "text-white/65")}>{landing.subheadline}</p>
            {landing.socialProof && (
              <p className="text-sm text-primary font-semibold font-inter">{landing.socialProof}</p>
            )}
            <button type="button" onClick={startQuiz} className={cn(brandCta.primary, "w-full py-4 mt-4")}>
              {landing.ctaLabel}
              <ArrowRight className="w-5 h-5" />
            </button>
            {loadError && (
              <p className="text-xs text-amber-400/80 font-inter">
                Usando configuração padrão (não foi possível carregar do servidor).
              </p>
            )}
          </div>
        )}

        {phase === "steps" && currentStep && (
          <div className="space-y-6">
            {currentStep.type === "choice" && (
              <>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">{currentStep.title}</h2>
                {currentStep.hint && (
                  <p className="text-sm text-white/55 font-inter leading-relaxed">{currentStep.hint}</p>
                )}
                <div className="space-y-3">
                  {currentStep.options.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => pickOption(currentStep.id, opt.id)}
                      className="w-full text-left rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 hover:border-primary/40 hover:bg-primary/5 transition-colors"
                    >
                      <p className="font-bold text-white text-sm">{opt.label}</p>
                      {opt.subtitle && (
                        <p className="text-xs text-white/45 mt-1 font-inter">{opt.subtitle}</p>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}

            {currentStep.type === "message" && (
              <>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">{currentStep.title}</h2>
                <p className="text-sm text-white/65 font-inter leading-relaxed whitespace-pre-line">
                  {currentStep.body}
                </p>
                <button type="button" onClick={advanceMessageOrOffer} className={cn(brandCta.primary, "w-full py-4")}>
                  {currentStep.ctaLabel}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </>
            )}

            {currentStep.type === "offer" && (
              <>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">{currentStep.title}</h2>
                <p className="text-sm text-white/60 font-inter">{currentStep.body}</p>
                <p className="text-4xl font-black text-primary">{currentStep.priceLabel}</p>
                {currentStep.priceNote && (
                  <p className="text-sm text-white/45 font-inter">{currentStep.priceNote}</p>
                )}
                <ul className="space-y-2 mt-4">
                  {currentStep.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-white/70 font-inter">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {b}
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={advanceMessageOrOffer} className={cn(brandCta.primary, "w-full py-4 mt-6")}>
                  {currentStep.ctaLabel}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        )}

        {phase === "contact" && (
          <div className="space-y-6">
            {contactStep === "name" && (
              <>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">{contact.nameTitle}</h2>
                {contact.nameHint && (
                  <p className="text-sm text-white/55 font-inter">{contact.nameHint}</p>
                )}
                <input
                  type="text"
                  autoComplete="given-name"
                  placeholder="Seu primeiro nome"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3.5 text-white text-sm font-inter placeholder:text-white/30 focus:border-primary/50 focus:outline-none"
                />
                <button
                  type="button"
                  disabled={!nameOk}
                  onClick={() => setContactStep("email")}
                  className={cn(brandCta.primary, "w-full py-4 disabled:opacity-45")}
                >
                  Continuar
                  <ArrowRight className="w-5 h-5" />
                </button>
              </>
            )}
            {contactStep === "email" && (
              <>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">{contact.emailTitle}</h2>
                {contact.emailHint && (
                  <p className="text-sm text-white/55 font-inter">{contact.emailHint}</p>
                )}
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="voce@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3.5 text-white text-sm font-inter placeholder:text-white/30 focus:border-primary/50 focus:outline-none"
                />
                <button
                  type="button"
                  disabled={!emailOk}
                  onClick={() => setContactStep("phone")}
                  className={cn(brandCta.primary, "w-full py-4 disabled:opacity-45")}
                >
                  Continuar
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setContactStep("name")}
                  className="w-full text-xs font-inter text-white/40 hover:text-white/60"
                >
                  Voltar
                </button>
              </>
            )}
            {contactStep === "phone" && (
              <>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">{contact.phoneTitle}</h2>
                {contact.phoneHint && (
                  <p className="text-sm text-white/55 font-inter">{contact.phoneHint}</p>
                )}
                <input
                  type="tel"
                  autoComplete="tel"
                  placeholder="(11) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3.5 text-white text-sm font-inter placeholder:text-white/30 focus:border-primary/50 focus:outline-none"
                />
                <button
                  type="button"
                  disabled={!phoneOk || submitting}
                  onClick={() => void finishCheckout()}
                  className={cn(brandCta.primary, "w-full py-4 disabled:opacity-45")}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Salvando…
                    </>
                  ) : (
                    <>
                      {contact.submitLabel}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setContactStep("email")}
                  className="w-full text-xs font-inter text-white/40 hover:text-white/60"
                >
                  Voltar
                </button>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function sessionHeaders(): Record<string, string> {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  try {
    const sid = sessionStorage.getItem("ascend_session_id");
    if (sid) h["X-Ascend-Session"] = sid;
  } catch {
    /* ignore */
  }
  return h;
}
