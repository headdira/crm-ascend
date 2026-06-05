"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Loader2,
  Lock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { AdsQuizConfig, AdsQuizStep } from "@crm-ascend/validation/ads-quiz";
import { DEFAULT_ADS_QUIZ_CONFIG } from "@crm-ascend/validation/ads-quiz";
import { ATTRIBUTION_COOKIE } from "@/lib/sales/consent";
import { parseAttributionCookie, readAttributionFromDocument, getClientCookie } from "@/lib/sales/utm";
import { getMetaBrowserIds } from "@/lib/sales/meta-attribution";
import { trackMetaLead } from "@/lib/sales/meta-pixel-client";
import { ensureLandingSession, trackEvent } from "@/lib/sales/track-client";
import { buildPersonalizedCheckoutUrl } from "@/lib/sales/checkout-url";
import { openCheckoutInNewTab } from "@/lib/sales/open-checkout";
import { cn } from "@/lib/utils";

type Phase = "landing" | "steps" | "contact";
type ContactStep = "name" | "email" | "phone";

const funnel = {
  glow: "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,rgba(255,184,0,0.14),transparent_55%)]",
  glowBottom:
    "pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-[radial-gradient(ellipse_70%_80%_at_50%_100%,rgba(255,184,0,0.06),transparent)]",
  choice:
    "group w-full text-left rounded-2xl border border-white/[0.05] bg-[#070707] px-5 py-4 transition-all duration-200 hover:border-primary/45 hover:bg-primary/[0.03] hover:shadow-[0_0_32px_rgba(255,184,0,0.1)] active:scale-[0.985]",
  choiceSelected:
    "border-primary/55 bg-primary/[0.05] shadow-[0_0_36px_rgba(255,184,0,0.14)]",
  input:
    "w-full rounded-2xl bg-[#050505] border border-white/[0.07] px-5 py-4 text-white text-base font-inter placeholder:text-white/20 focus:border-primary/55 focus:outline-none focus:shadow-[0_0_0_3px_rgba(255,184,0,0.12)] transition-all",
  cta: "inline-flex items-center justify-center gap-2.5 w-full rounded-2xl bg-primary px-6 py-5 min-h-[52px] text-[#0a0a0a] font-black uppercase tracking-wider text-sm sm:text-[15px] hover:brightness-110 shadow-[0_0_48px_rgba(255,184,0,0.28)] transition-all disabled:opacity-35 disabled:shadow-none disabled:cursor-not-allowed",
  offerCard:
    "rounded-3xl border border-primary/20 bg-[#050505] p-6 sm:p-7 shadow-[0_0_60px_rgba(255,184,0,0.08)]",
} as const;

function readUtm() {
  const rawAttribution = getClientCookie(ATTRIBUTION_COOKIE);
  const fromCookie = parseAttributionCookie(rawAttribution);
  const utm = { ...readAttributionFromDocument(), ...(fromCookie ?? {}) };
  return Object.keys(utm).length ? utm : undefined;
}

function normalizePhone(value: string): string {
  return value.replace(/\D/g, "");
}

function StepShell({ children, stepKey }: { children: React.ReactNode; stepKey: string }) {
  return (
    <div key={stepKey} className="quiz-step-enter space-y-6">
      {children}
    </div>
  );
}

function TrustFooter() {
  return (
    <footer className="mt-10 pt-6 border-t border-white/[0.04] space-y-3">
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] uppercase tracking-wider text-white/30 font-inter">
        <span className="inline-flex items-center gap-1.5">
          <Lock className="w-3 h-3 text-primary/70" />
          Sem cartão agora
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="w-3 h-3 text-primary/70" />
          Dados protegidos
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-primary/70" />
          Pagamento Kiwify
        </span>
      </div>
      <p className="text-center text-[10px] text-white/20 font-inter leading-relaxed max-w-sm mx-auto">
        Ao continuar, você concorda em receber comunicações sobre o programa. Seus dados não são
        compartilhados com terceiros.
      </p>
    </footer>
  );
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
  const inputRef = useRef<HTMLInputElement>(null);

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

  const progressPct = progressTotal > 0 ? Math.round((progressDone / progressTotal) * 100) : 0;

  useEffect(() => {
    if (phase !== "contact") return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => window.clearTimeout(t);
  }, [phase, contactStep]);

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
    window.setTimeout(() => {
      if (stepIndex < steps.length - 1) setStepIndex((i) => i + 1);
      else setPhase("contact");
    }, 180);
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

  const canAdvanceContact =
    (contactStep === "name" && nameOk) ||
    (contactStep === "email" && emailOk) ||
    (contactStep === "phone" && phoneOk && !submitting);

  const advanceContact = () => {
    if (contactStep === "name" && nameOk) setContactStep("email");
    else if (contactStep === "email" && emailOk) setContactStep("phone");
    else if (contactStep === "phone" && phoneOk) void finishCheckout();
  };

  useEffect(() => {
    if (phase !== "contact") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;
      if (contactStep === "name" && nameOk) {
        e.preventDefault();
        setContactStep("email");
      } else if (contactStep === "email" && emailOk) {
        e.preventDefault();
        setContactStep("phone");
      } else if (contactStep === "phone" && phoneOk && !submitting) {
        e.preventDefault();
        void finishCheckout();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, contactStep, nameOk, emailOk, phoneOk, submitting]);

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const { landing, contact } = config;
  const stepLabel =
    phase === "landing"
      ? "Início"
      : phase === "contact"
        ? `Contato · ${contactStep === "name" ? "nome" : contactStep === "email" ? "e-mail" : "WhatsApp"}`
        : `Pergunta ${stepIndex + 1}`;

  return (
    <div className="relative min-h-screen flex flex-col bg-black">
      <div className={funnel.glow} aria-hidden />
      <div className={funnel.glowBottom} aria-hidden />

      <header className="relative z-10 px-5 sm:px-6 pt-5 pb-3">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-primary/90 font-bold">Ascend Club</p>
            {progressDone > 0 && (
              <p className="text-[10px] text-white/30 font-inter mt-0.5">{stepLabel}</p>
            )}
          </div>
          {progressDone > 0 && (
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-white/30 font-inter">Progresso</p>
              <p className="text-sm font-black text-primary tabular-nums">{progressPct}%</p>
            </div>
          )}
        </div>

        {progressDone > 0 && (
          <div className="max-w-lg mx-auto mt-4">
            <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary/80 to-primary shadow-[0_0_12px_rgba(255,184,0,0.5)] transition-all duration-500 ease-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10 flex-1 max-w-lg mx-auto w-full px-5 sm:px-6 py-8 sm:py-10">
        {phase === "landing" && (
          <StepShell stepKey="landing">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-[10px] uppercase tracking-wider text-white/45 font-inter">
              <Clock className="w-3 h-3 text-primary" />
              Menos de 2 minutos · 100% gratuito
            </div>

            <p className="text-xs tracking-[0.28em] uppercase text-primary font-bold">{landing.eyebrow}</p>
            <h1 className="text-3xl sm:text-[2.35rem] font-black uppercase leading-[1.02] tracking-tight text-white">
              {landing.headline}
            </h1>
            <p className="text-base text-white/50 font-inter leading-relaxed">{landing.subheadline}</p>

            {landing.socialProof && (
              <div className="rounded-2xl border border-primary/15 bg-primary/[0.04] px-4 py-3">
                <p className="text-sm text-primary font-semibold font-inter">{landing.socialProof}</p>
              </div>
            )}

            <ul className="space-y-2 text-sm text-white/40 font-inter">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary/80 shrink-0" />
                Diagnóstico personalizado com base nas suas respostas
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary/80 shrink-0" />
                Sem compromisso — você só paga se quiser entrar
              </li>
            </ul>

            <button type="button" onClick={startQuiz} className={cn(funnel.cta, "mt-2")}>
              {landing.ctaLabel}
              <ArrowRight className="w-5 h-5" />
            </button>

            {loadError && (
              <p className="text-xs text-amber-400/70 font-inter text-center">
                Usando configuração padrão (não foi possível carregar do servidor).
              </p>
            )}
          </StepShell>
        )}

        {phase === "steps" && currentStep && (
          <StepShell stepKey={`step-${stepIndex}`}>
            {currentStep.type === "choice" && (
              <>
                <div>
                  <h2 className="text-2xl sm:text-[1.65rem] font-black text-white uppercase tracking-tight leading-tight">
                    {currentStep.title}
                  </h2>
                  {currentStep.hint && (
                    <p className="text-sm text-white/45 font-inter leading-relaxed mt-2">
                      {currentStep.hint}
                    </p>
                  )}
                </div>
                <div className="space-y-2.5">
                  {currentStep.options.map((opt) => {
                    const selected = answers[currentStep.id] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => pickOption(currentStep.id, opt.id)}
                        className={cn(funnel.choice, selected && funnel.choiceSelected)}
                      >
                        <p className="font-bold text-white text-[15px]">{opt.label}</p>
                        {opt.subtitle && (
                          <p className="text-xs text-white/40 mt-1 font-inter group-hover:text-white/55 transition-colors">
                            {opt.subtitle}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {currentStep.type === "message" && (
              <>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                  {currentStep.title}
                </h2>
                <div className="rounded-2xl border border-white/[0.05] bg-[#060606] px-5 py-5">
                  <p className="text-sm text-white/60 font-inter leading-relaxed whitespace-pre-line">
                    {currentStep.body}
                  </p>
                </div>
                <button type="button" onClick={advanceMessageOrOffer} className={funnel.cta}>
                  {currentStep.ctaLabel}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </>
            )}

            {currentStep.type === "offer" && (
              <>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                  {currentStep.title}
                </h2>
                <div className={funnel.offerCard}>
                  <p className="text-sm text-white/50 font-inter">{currentStep.body}</p>
                  <p className="text-5xl sm:text-6xl font-black text-primary mt-4 leading-none drop-shadow-[0_0_24px_rgba(255,184,0,0.3)]">
                    {currentStep.priceLabel}
                  </p>
                  {currentStep.priceNote && (
                    <p className="text-xs text-white/35 font-inter mt-2 uppercase tracking-wide">
                      {currentStep.priceNote}
                    </p>
                  )}
                  <ul className="space-y-2.5 mt-6 pt-5 border-t border-white/[0.06]">
                    {currentStep.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-sm text-white/65 font-inter">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <button type="button" onClick={advanceMessageOrOffer} className={funnel.cta}>
                  {currentStep.ctaLabel}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </>
            )}
          </StepShell>
        )}

        {phase === "contact" && (
          <StepShell stepKey={`contact-${contactStep}`}>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-primary/80 font-bold mb-2">
                Quase lá
              </p>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                {contactStep === "name"
                  ? contact.nameTitle
                  : contactStep === "email"
                    ? contact.emailTitle
                    : contact.phoneTitle}
              </h2>
              <p className="text-sm text-white/45 font-inter mt-2">
                {contactStep === "name"
                  ? contact.nameHint
                  : contactStep === "email"
                    ? contact.emailHint
                    : contact.phoneHint}
              </p>
            </div>

            <div className="flex gap-1.5">
              {(["name", "email", "phone"] as const).map((s, i) => (
                <span
                  key={s}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-colors",
                    (contactStep === "name" && i === 0) ||
                      (contactStep === "email" && i <= 1) ||
                      (contactStep === "phone" && i <= 2)
                      ? "bg-primary shadow-[0_0_8px_rgba(255,184,0,0.4)]"
                      : "bg-white/[0.06]",
                  )}
                />
              ))}
            </div>

            {contactStep === "name" && (
              <input
                ref={inputRef}
                type="text"
                autoComplete="given-name"
                placeholder="Seu primeiro nome"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={funnel.input}
              />
            )}
            {contactStep === "email" && (
              <input
                ref={inputRef}
                type="email"
                autoComplete="email"
                placeholder="voce@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={funnel.input}
              />
            )}
            {contactStep === "phone" && (
              <input
                ref={inputRef}
                type="tel"
                autoComplete="tel"
                placeholder="(11) 99999-9999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={funnel.input}
              />
            )}

            <button
              type="button"
              disabled={!canAdvanceContact}
              onClick={advanceContact}
              className={funnel.cta}
            >
              {contactStep === "phone" && submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Liberando acesso…
                </>
              ) : (
                <>
                  {contactStep === "phone" ? contact.submitLabel : "Continuar"}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {contactStep !== "name" && (
              <button
                type="button"
                onClick={() =>
                  setContactStep(contactStep === "phone" ? "email" : "name")
                }
                className="w-full text-xs font-inter uppercase tracking-wider text-white/30 hover:text-white/50 transition-colors py-2"
              >
                Voltar
              </button>
            )}

            <TrustFooter />
          </StepShell>
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
