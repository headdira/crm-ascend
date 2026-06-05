"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Loader2,
  Lock,
  Quote,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import type { AdsQuizConfig, AdsQuizStep, QuizOptionInsight } from "@crm-ascend/validation/ads-quiz";
import {
  DEFAULT_ADS_QUIZ_CONFIG,
  collectProfileTags,
  resolveCalculatingMessages,
  resolveDynamicBody,
  resolveResultDisplay,
} from "@crm-ascend/validation/ads-quiz";
import { ATTRIBUTION_COOKIE } from "@/lib/sales/consent";
import { parseAttributionCookie, readAttributionFromDocument, getClientCookie } from "@/lib/sales/utm";
import { getMetaBrowserIds } from "@/lib/sales/meta-attribution";
import { trackMetaLead } from "@/lib/sales/meta-pixel-client";
import { ensureLandingSession, trackEvent } from "@/lib/sales/track-client";
import { buildPersonalizedCheckoutUrl } from "@/lib/sales/checkout-url";
import { openCheckoutInNewTab } from "@/lib/sales/open-checkout";
import { cn } from "@/lib/utils";

type Phase = "landing" | "steps" | "insight" | "calculating" | "result" | "contact";
type ContactStep = "name" | "email" | "phone";

const DEFAULT_OFFER = DEFAULT_ADS_QUIZ_CONFIG.steps.find((s) => s.type === "offer")!;
const DEFAULT_CALCULATING = DEFAULT_ADS_QUIZ_CONFIG.calculating!;
const DEFAULT_RESULT = DEFAULT_ADS_QUIZ_CONFIG.result!;

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
  ctaShimmer:
    "funnel-cta-shimmer inline-flex items-center justify-center gap-2.5 w-full rounded-2xl px-6 py-5 min-h-[52px] text-[#0a0a0a] font-black uppercase tracking-wider text-sm sm:text-[15px] hover:brightness-110 shadow-[0_0_48px_rgba(255,184,0,0.28)] transition-all disabled:opacity-35 disabled:shadow-none disabled:cursor-not-allowed",
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

function useCountUp(target: string, run: boolean): string {
  const [display, setDisplay] = useState(target);

  useEffect(() => {
    if (!run) {
      setDisplay(target);
      return;
    }

    const match = target.match(/(\d+)/);
    if (!match) {
      setDisplay(target);
      return;
    }

    const end = Number.parseInt(match[1], 10);
    const startIdx = target.indexOf(match[1]);
    const prefix = target.slice(0, startIdx);
    const suffix = target.slice(startIdx + match[1].length);
    const duration = 1200;
    let frame = 0;
    let startTime = 0;

    const tick = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      const value = Math.round(eased * end);
      setDisplay(`${prefix}${value}${suffix}`);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    setDisplay(`${prefix}0${suffix}`);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, run]);

  return display;
}

function chipLabelForStep(step: AdsQuizStep): string {
  if (step.type !== "choice" && step.type !== "multichoice") return step.id;
  const title = step.title.trim();
  const beforeQ = title.split("?")[0]?.trim() ?? title;
  if (beforeQ.length <= 28) return beforeQ;
  return step.id.charAt(0).toUpperCase() + step.id.slice(1).replace(/_/g, " ");
}

function optionLabelForStep(step: AdsQuizStep, optionId: string): string | null {
  if (step.type !== "choice" && step.type !== "multichoice") return null;
  return step.options.find((o) => o.id === optionId)?.label ?? null;
}

function InsightProof({ insight }: { insight: QuizOptionInsight }) {
  const proof = insight.proof;
  if (!proof) return null;

  const isPrint =
    insight.variant === "print" || (Boolean(proof.imageUrl) && !proof.quote);

  if (isPrint && proof.imageUrl) {
    return (
      <figure className="rounded-2xl border border-white/[0.08] bg-[#060606] overflow-hidden min-h-[12rem]">
        <img
          src={proof.imageUrl}
          alt={proof.imageCaption ?? "Print real de resultado"}
          className="w-full max-h-[22rem] object-cover object-top"
          loading="lazy"
        />
        {proof.imageCaption && (
          <figcaption className="px-4 py-3 text-[11px] uppercase tracking-wider text-white/40 font-inter border-t border-white/[0.06]">
            {proof.imageCaption}
          </figcaption>
        )}
      </figure>
    );
  }

  if (insight.variant === "stat" && proof.statLabel) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] px-4 py-4 min-h-[4.5rem] flex items-center gap-3">
        <Users className="w-5 h-5 text-primary shrink-0" />
        <p className="text-sm font-bold text-primary font-inter">{proof.statLabel}</p>
      </div>
    );
  }

  if (proof.quote) {
    return (
      <blockquote className="rounded-2xl border border-white/[0.06] bg-[#060606] px-4 py-4 min-h-[5.5rem]">
        <div className="flex gap-3">
          {proof.imageUrl ? (
            <img
              src={proof.imageUrl}
              alt={proof.name ?? ""}
              className="w-11 h-11 rounded-full object-cover border border-white/10 shrink-0"
            />
          ) : (
            <span className="w-11 h-11 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
              <Quote className="w-4 h-4 text-primary/80" />
            </span>
          )}
          <div>
            <p className="text-sm text-white/65 font-inter italic leading-relaxed">
              &ldquo;{proof.quote}&rdquo;
            </p>
            {(proof.name || proof.role) && (
              <footer className="mt-2 text-xs text-white/35 font-inter">
                {proof.name && <span className="text-white/55 font-semibold">{proof.name}</span>}
                {proof.role ? ` · ${proof.role}` : ""}
              </footer>
            )}
          </div>
        </div>
      </blockquote>
    );
  }

  return null;
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

function AvatarStack({ count = 5 }: { count?: number }) {
  const colors = ["#ffb800", "#ff9500", "#e6a800", "#ffc933", "#cc9200"];
  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2.5">
        {Array.from({ length: count }).map((_, i) => (
          <span
            key={i}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-black text-[10px] font-black text-[#0a0a0a]"
            style={{ backgroundColor: colors[i % colors.length] }}
          >
            {String.fromCharCode(65 + i)}
          </span>
        ))}
      </div>
      <p className="text-xs text-white/45 font-inter leading-snug">
        <span className="text-white/70 font-semibold">+500 alunos</span>
        <br />
        já fizeram o diagnóstico
      </p>
    </div>
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
  const [calcMsgIndex, setCalcMsgIndex] = useState(0);
  const [calcProgress, setCalcProgress] = useState(0);
  const [resultViewed, setResultViewed] = useState(false);
  const [activeInsight, setActiveInsight] = useState<QuizOptionInsight | null>(null);
  const [insightMeta, setInsightMeta] = useState<{ stepId: string; optionId: string } | null>(null);
  const [insightsSeen, setInsightsSeen] = useState<string[]>([]);
  const [multiDraft, setMultiDraft] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const calculatingStarted = useRef(false);

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
  const questionSteps = useMemo(() => steps.filter((s) => s.type !== "offer"), [steps]);
  const offerStep = useMemo(() => {
    const found = steps.find((s) => s.type === "offer");
    if (found?.type === "offer") return found;
    return DEFAULT_OFFER.type === "offer" ? DEFAULT_OFFER : null;
  }, [steps]);

  const currentStep: AdsQuizStep | undefined = questionSteps[stepIndex];
  const profileTags = useMemo(
    () => collectProfileTags(questionSteps, answers),
    [questionSteps, answers],
  );
  const calculatingMessages = useMemo(
    () => resolveCalculatingMessages(config?.calculating, profileTags, DEFAULT_CALCULATING.messages),
    [config?.calculating, profileTags],
  );
  const resultConfig = useMemo(
    () => resolveResultDisplay(config ?? DEFAULT_ADS_QUIZ_CONFIG, profileTags, DEFAULT_RESULT),
    [config, profileTags],
  );
  const testimonials = config?.testimonials ?? [];

  const progressTotal = questionSteps.length * 2 + 3;
  const progressDone = useMemo(() => {
    if (phase === "landing") return 0;
    if (phase === "steps") return stepIndex * 2 + 1;
    if (phase === "insight") return stepIndex * 2 + 2;
    if (phase === "calculating") return questionSteps.length * 2 + 1;
    if (phase === "result") return questionSteps.length * 2 + 2;
    const contactOffset = { name: 1, email: 2, phone: 3 }[contactStep];
    return questionSteps.length * 2 + 2 + contactOffset;
  }, [phase, stepIndex, contactStep, questionSteps.length]);

  const progressPct = progressTotal > 0 ? Math.round((progressDone / progressTotal) * 100) : 0;
  const animatedPrice = useCountUp(offerStep?.priceLabel ?? "R$60", phase === "result" && resultViewed);

  useEffect(() => {
    if (phase !== "contact") return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => window.clearTimeout(t);
  }, [phase, contactStep]);

  useEffect(() => {
    if (phase !== "steps" || !currentStep || currentStep.type !== "multichoice") return;
    const raw = answers[currentStep.id];
    setMultiDraft(raw ? raw.split(",").filter(Boolean) : []);
  }, [phase, stepIndex, currentStep, answers]);

  useEffect(() => {
    if (phase !== "calculating") {
      calculatingStarted.current = false;
      return;
    }
    if (calculatingStarted.current) return;
    calculatingStarted.current = true;

    trackEvent("quiz_calculating", { cta: "quiz_form" });
    trackEvent("profile_snapshot", {
      cta: "quiz_form",
      profile_tags: profileTags.join(","),
    });
    setCalcMsgIndex(0);
    setCalcProgress(0);

    const msgInterval = window.setInterval(() => {
      setCalcMsgIndex((i) => Math.min(i + 1, calculatingMessages.length - 1));
    }, 650);

    const progressInterval = window.setInterval(() => {
      setCalcProgress((p) => Math.min(p + 4, 100));
    }, 110);

    const doneTimer = window.setTimeout(() => {
      setCalcProgress(100);
      setPhase("result");
    }, 3600);

    return () => {
      window.clearInterval(msgInterval);
      window.clearInterval(progressInterval);
      window.clearTimeout(doneTimer);
    };
  }, [phase, calculatingMessages.length, profileTags]);

  useEffect(() => {
    if (phase !== "result") {
      setResultViewed(false);
      return;
    }
    setResultViewed(true);
    trackEvent("view_offer", { cta: "quiz_form" });
  }, [phase]);

  const persistProgress = useCallback(
    (
      stepId: string,
      nextAnswers: Record<string, string>,
      extra?: { profile_tags?: string[]; insights_seen?: string[] },
    ) => {
      void ensureLandingSession().then(() =>
        fetch("/api/sales/lead", {
          method: "POST",
          headers: sessionHeaders(),
          credentials: "same-origin",
          keepalive: true,
          body: JSON.stringify({
            type: "quiz_progress",
            step_id: stepId,
            answers: {
              ...nextAnswers,
              ...(extra?.profile_tags ? { profile_tags: extra.profile_tags } : {}),
              ...(extra?.insights_seen ? { insights_seen: extra.insights_seen } : {}),
            },
            utm: readUtm(),
          }),
        }),
      );
    },
    [],
  );

  const goToCalculating = () => setPhase("calculating");

  const advanceAfterQuestion = () => {
    if (stepIndex < questionSteps.length - 1) setStepIndex((i) => i + 1);
    else goToCalculating();
  };

  const pickOption = (stepId: string, optionId: string, insight?: QuizOptionInsight) => {
    const next = { ...answers, [stepId]: optionId };
    setAnswers(next);
    const tags = collectProfileTags(questionSteps, next);
    persistProgress(stepId, next, { profile_tags: tags, insights_seen: insightsSeen });
    trackEvent("quiz_step", { step_id: stepId, option_id: optionId });

    if (insight) {
      setActiveInsight(insight);
      setInsightMeta({ stepId, optionId });
      setPhase("insight");
      return;
    }

    window.setTimeout(() => advanceAfterQuestion(), 180);
  };

  const finishInsight = () => {
    if (!activeInsight || !insightMeta) return;
    const key = `${insightMeta.stepId}:${insightMeta.optionId}`;
    const nextSeen = insightsSeen.includes(key) ? insightsSeen : [...insightsSeen, key];
    setInsightsSeen(nextSeen);
    trackEvent("quiz_insight", {
      step_id: insightMeta.stepId,
      option_id: insightMeta.optionId,
      variant: activeInsight.variant ?? "default",
    });
    persistProgress(insightMeta.stepId, answers, {
      profile_tags: collectProfileTags(questionSteps, answers),
      insights_seen: nextSeen,
    });
    setActiveInsight(null);
    setInsightMeta(null);
    setPhase("steps");
    advanceAfterQuestion();
  };

  const advanceLinearStep = () => {
    if (!currentStep) return;
    trackEvent("quiz_step", { step_id: currentStep.id, action: "continue" });
    if (stepIndex < questionSteps.length - 1) setStepIndex((i) => i + 1);
    else goToCalculating();
  };

  const toggleMultiOption = (optionId: string) => {
    if (!currentStep || currentStep.type !== "multichoice") return;
    const max = currentStep.maxSelect ?? currentStep.options.length;
    setMultiDraft((prev) => {
      if (prev.includes(optionId)) return prev.filter((id) => id !== optionId);
      if (prev.length >= max) return prev;
      return [...prev, optionId];
    });
  };

  const submitMultichoice = () => {
    if (!currentStep || currentStep.type !== "multichoice") return;
    const min = currentStep.minSelect ?? 1;
    if (multiDraft.length < min) return;
    const value = multiDraft.join(",");
    const next = { ...answers, [currentStep.id]: value };
    setAnswers(next);
    const tags = collectProfileTags(questionSteps, next);
    persistProgress(currentStep.id, next, { profile_tags: tags, insights_seen: insightsSeen });
    trackEvent("quiz_step", { step_id: currentStep.id, option_id: value });
    setPhase("steps");
    advanceAfterQuestion();
  };

  const startQuiz = () => {
    trackEvent("quiz_start", { cta: "quiz_form" });
    setPhase("steps");
    setStepIndex(0);
  };

  const answerChips = useMemo(() => {
    return questionSteps
      .filter(
        (s): s is Extract<AdsQuizStep, { type: "choice" | "multichoice" }> =>
          s.type === "choice" || s.type === "multichoice",
      )
      .map((step) => {
        const raw = answers[step.id];
        if (!raw) return null;
        const label =
          step.type === "multichoice"
            ? raw
                .split(",")
                .filter(Boolean)
                .map((id) => optionLabelForStep(step, id))
                .filter(Boolean)
                .join(", ")
            : optionLabelForStep(step, raw);
        if (!label) return null;
        return { key: step.id, text: `${chipLabelForStep(step)}: ${label}` };
      })
      .filter(Boolean) as { key: string; text: string }[];
  }, [questionSteps, answers]);

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
      : phase === "insight"
        ? "Para você"
        : phase === "calculating"
          ? "Analisando"
          : phase === "result"
          ? "Seu diagnóstico"
          : phase === "contact"
            ? `Contato · ${contactStep === "name" ? "nome" : contactStep === "email" ? "e-mail" : "WhatsApp"}`
            : `Pergunta ${stepIndex + 1}`;

  return (
    <div className="relative min-h-screen flex flex-col bg-black">
      <div className={cn(funnel.glow, phase === "result" && "funnel-pulse-glow")} aria-hidden />
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
                style={{ width: `${phase === "calculating" ? calcProgress : progressPct}%` }}
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

            <AvatarStack />

            <p className="text-xs tracking-[0.28em] uppercase text-primary font-bold">{landing.eyebrow}</p>
            <h1 className="text-3xl sm:text-[2.35rem] font-black uppercase leading-[1.02] tracking-tight funnel-headline-gold">
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
                Entendemos seu problema e adaptamos o plano ao seu momento
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary/80 shrink-0" />
                Loja pronta + ensino de vendas + mentoria ao vivo
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary/80 shrink-0" />
                Sem cartão agora — diagnóstico gratuito
              </li>
            </ul>

            <button type="button" onClick={startQuiz} className={cn(funnel.ctaShimmer, "mt-2")}>
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
                        onClick={() => pickOption(currentStep.id, opt.id, opt.insight)}
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
                {currentStep.imageUrl && currentStep.variant === "authority" && (
                  <img
                    src={currentStep.imageUrl}
                    alt="Mentores Ascend Club"
                    className="w-full max-h-56 object-cover object-top rounded-2xl border border-white/[0.08]"
                  />
                )}
                <div
                  className={cn(
                    "rounded-2xl border px-5 py-5",
                    currentStep.variant === "story"
                      ? "border-primary/15 bg-primary/[0.03]"
                      : "border-white/[0.05] bg-[#060606]",
                  )}
                >
                  <p className="text-sm text-white/60 font-inter leading-relaxed whitespace-pre-line">
                    {currentStep.body}
                  </p>
                </div>
                <button type="button" onClick={advanceLinearStep} className={funnel.cta}>
                  {currentStep.ctaLabel}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </>
            )}

            {currentStep.type === "dynamic" && (
              <>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                  {currentStep.title}
                </h2>
                {currentStep.imageUrl && (
                  <figure className="rounded-2xl border border-white/[0.08] bg-[#060606] overflow-hidden">
                    <img
                      src={currentStep.imageUrl}
                      alt="Print real de resultado"
                      className="w-full max-h-48 object-cover object-top"
                      loading="lazy"
                    />
                  </figure>
                )}
                <div className="rounded-2xl border border-primary/15 bg-primary/[0.03] px-5 py-5">
                  <p className="text-sm text-white/65 font-inter leading-relaxed whitespace-pre-line">
                    {resolveDynamicBody(currentStep.body, answers, questionSteps)}
                  </p>
                </div>
                <button type="button" onClick={advanceLinearStep} className={funnel.cta}>
                  {currentStep.ctaLabel}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </>
            )}

            {currentStep.type === "mechanism" && (
              <>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight leading-tight">
                  {currentStep.title}
                </h2>
                {currentStep.intro && (
                  <p className="text-sm text-white/45 font-inter leading-relaxed">{currentStep.intro}</p>
                )}
                <div className="space-y-3">
                  {currentStep.mechanismSteps.map((item, i) => (
                    <div
                      key={`${item.title}-${i}`}
                      className="rounded-2xl border border-white/[0.06] bg-[#060606] px-5 py-4"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 border border-primary/30 text-sm font-black text-primary">
                          {i + 1}
                        </span>
                        <div>
                          <p className="font-bold text-white text-[15px]">{item.title}</p>
                          {item.subtitle && (
                            <p className="text-xs text-white/40 mt-1 font-inter">{item.subtitle}</p>
                          )}
                          {item.highlight && (
                            <p className="text-xs font-bold text-primary mt-2 font-inter uppercase tracking-wide">
                              {item.highlight}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {currentStep.bullets && currentStep.bullets.length > 0 && (
                  <ul className="space-y-2 text-sm text-white/45 font-inter">
                    {currentStep.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary/80 shrink-0 mt-0.5" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
                <button type="button" onClick={advanceLinearStep} className={funnel.cta}>
                  {currentStep.ctaLabel}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </>
            )}

            {currentStep.type === "multichoice" && (
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
                    const selected = multiDraft.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleMultiOption(opt.id)}
                        className={cn(funnel.choice, selected && funnel.choiceSelected)}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              "flex h-5 w-5 shrink-0 items-center justify-center rounded border",
                              selected
                                ? "border-primary bg-primary text-[#0a0a0a]"
                                : "border-white/20",
                            )}
                          >
                            {selected ? <Check className="w-3 h-3" /> : null}
                          </span>
                          <p className="font-bold text-white text-[15px] text-left">{opt.label}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  disabled={multiDraft.length < (currentStep.minSelect ?? 1)}
                  onClick={submitMultichoice}
                  className={funnel.cta}
                >
                  {currentStep.ctaLabel}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </>
            )}
          </StepShell>
        )}

        {phase === "insight" && activeInsight && (
          <StepShell stepKey={`insight-${insightMeta?.stepId ?? "x"}`}>
            {activeInsight.eyebrow && (
              <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold">
                {activeInsight.eyebrow}
              </p>
            )}
            <h2 className="text-2xl sm:text-[1.65rem] font-black text-white uppercase tracking-tight leading-tight">
              {activeInsight.title}
            </h2>
            <div
              className={cn(
                "rounded-2xl border px-5 py-5",
                activeInsight.variant === "objection"
                  ? "border-primary/15 bg-primary/[0.03]"
                  : "border-white/[0.06] bg-[#060606]",
              )}
            >
              <p className="text-sm text-white/60 font-inter leading-relaxed whitespace-pre-line">
                {activeInsight.body}
              </p>
            </div>
            <InsightProof insight={activeInsight} />
            <button type="button" onClick={finishInsight} className={funnel.cta}>
              {activeInsight.ctaLabel ?? "Continuar"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </StepShell>
        )}

        {phase === "calculating" && (
          <StepShell stepKey="calculating">
            <div className="text-center space-y-8 py-6">
              <div className="mx-auto w-16 h-16 rounded-full border-2 border-primary/30 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-primary/80 font-bold mb-3">
                  Processando
                </p>
                <p className="text-lg font-bold text-white font-inter min-h-[3rem] transition-opacity duration-300">
                  {calculatingMessages[calcMsgIndex]}
                </p>
              </div>
              <div className="space-y-2">
                {calculatingMessages.map((msg, i) => (
                  <div
                    key={msg}
                    className={cn(
                      "flex items-center gap-2 text-sm font-inter transition-all duration-300",
                      i <= calcMsgIndex ? "text-white/70" : "text-white/15",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-full border text-[10px]",
                        i < calcMsgIndex
                          ? "border-primary bg-primary text-[#0a0a0a]"
                          : i === calcMsgIndex
                            ? "border-primary/60 text-primary"
                            : "border-white/10",
                      )}
                    >
                      {i < calcMsgIndex ? <Check className="w-3 h-3" /> : i + 1}
                    </span>
                    {msg}
                  </div>
                ))}
              </div>
            </div>
          </StepShell>
        )}

        {phase === "result" && offerStep && (
          <StepShell stepKey="result">
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold">
              {resultConfig.eyebrow}
            </p>
            <h2 className="text-2xl sm:text-[1.75rem] font-black uppercase leading-tight tracking-tight funnel-headline-gold">
              {resultConfig.headline}
            </h2>
            {resultConfig.badge && (
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/[0.08] px-4 py-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                  {resultConfig.badge}
                </span>
              </div>
            )}
            {resultConfig.highlights && resultConfig.highlights.length > 0 && (
              <ul className="space-y-2 rounded-2xl border border-white/[0.06] bg-[#060606] px-4 py-4">
                {resultConfig.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-white/60 font-inter">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
            {resultConfig.reassurance && (
              <p className="text-sm text-white/50 font-inter leading-relaxed">{resultConfig.reassurance}</p>
            )}

            {answerChips.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {answerChips.map((chip) => (
                  <span
                    key={chip.key}
                    className="inline-flex rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/60 font-inter"
                  >
                    {chip.text}
                  </span>
                ))}
              </div>
            )}

            <div className={funnel.offerCard}>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">{offerStep.title}</h3>
              <p className="text-sm text-white/50 font-inter mt-2">{offerStep.body}</p>

              {offerStep.urgencyNote && (
                <div className="mt-4 rounded-xl border border-red-500/25 bg-red-500/[0.06] px-4 py-2.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-red-400 font-inter">
                    {offerStep.urgencyNote}
                  </p>
                </div>
              )}

              <div className="mt-5 flex items-end gap-3 min-h-[4.5rem]">
                {offerStep.originalPriceLabel && (
                  <p className="text-lg text-white/30 font-inter line-through pb-1">
                    {offerStep.originalPriceLabel}
                  </p>
                )}
                <p className="text-5xl sm:text-6xl font-black text-primary leading-none drop-shadow-[0_0_28px_rgba(255,184,0,0.45)] funnel-price-pop tabular-nums">
                  {animatedPrice}
                </p>
              </div>

              {offerStep.priceNote && (
                <p className="text-xs text-white/35 font-inter mt-2 uppercase tracking-wide">
                  {offerStep.priceNote}
                </p>
              )}

              <ul className="space-y-2.5 mt-6 pt-5 border-t border-white/[0.06]">
                {offerStep.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-white/65 font-inter">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {testimonials.length > 0 && (
              <div className="space-y-3">
                {testimonials.map((t) => (
                  <blockquote
                    key={`${t.name}-${t.quote.slice(0, 24)}`}
                    className="rounded-2xl border border-white/[0.05] bg-[#060606] px-4 py-4"
                  >
                    <p className="text-sm text-white/60 font-inter italic leading-relaxed">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <footer className="mt-2 text-xs text-white/35 font-inter">
                      <span className="text-white/55 font-semibold">{t.name}</span>
                      {t.role ? ` · ${t.role}` : ""}
                    </footer>
                  </blockquote>
                ))}
              </div>
            )}

            <button type="button" onClick={() => setPhase("contact")} className={funnel.ctaShimmer}>
              {offerStep.ctaLabel}
              <ArrowRight className="w-5 h-5" />
            </button>
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
