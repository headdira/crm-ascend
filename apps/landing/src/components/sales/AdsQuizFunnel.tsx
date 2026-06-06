"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
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
import {
  HERO_IMAGE,
  PROOF_IMAGES,
  QUIZ_HERO_ERICK_DUBAI,
  QUIZ_HERO_KELVIN_PARIS,
} from "@/lib/sales/media";

type Phase = "landing" | "steps" | "insight" | "calculating" | "result" | "contact";
type ContactStep = "name" | "email" | "phone";

const DEFAULT_OFFER = DEFAULT_ADS_QUIZ_CONFIG.steps.find((s) => s.type === "offer")!;
const DEFAULT_CALCULATING = DEFAULT_ADS_QUIZ_CONFIG.calculating!;
const DEFAULT_RESULT = DEFAULT_ADS_QUIZ_CONFIG.result!;

const funnel = {
  choice:
    "group w-full text-left rounded-xl border border-gray-200 bg-white px-5 py-4 sm:py-5 transition-all duration-200 hover:border-[#f2a218] hover:bg-orange-50/60 shadow-sm active:scale-[0.99]",
  choiceSelected: "border-[#f2a218] bg-orange-50 ring-1 ring-[#f2a218]/25",
  input:
    "w-full rounded-xl bg-white border border-gray-300 px-5 py-4 text-[#111] text-lg font-inter placeholder:text-gray-400 focus:border-[#f2a218] focus:outline-none focus:ring-2 focus:ring-[#f2a218]/20 transition-all",
  cta: "funnel-landing-inlead-cta w-full",
  offerCard: "rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm",
  card: "rounded-xl border border-gray-200 bg-gray-50 px-5 py-5",
  chip: "inline-flex rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-[11px] text-[#555] font-inter",
} as const;

function renderHighlightedHeadline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((segment, index) => {
    if (segment.startsWith("**") && segment.endsWith("**")) {
      return (
        <span key={index} className="text-[#E8941C]">
          {segment.slice(2, -2)}
        </span>
      );
    }
    return <span key={index}>{segment}</span>;
  });
}

function NuvemshopSaleCard({ value, className }: { value: string; className?: string }) {
  return (
    <div
      className={cn(
        "z-20 min-w-[100px] max-w-[118px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.4)]",
        className,
      )}
    >
      <div className="flex items-center border-b border-gray-100 bg-[#f5f8fb] px-2 py-1">
        <span className="text-[8px] font-bold lowercase tracking-tight text-[#0084ff] sm:text-[9px]">
          nuvemshop
        </span>
      </div>
      <div className="px-2 py-1.5">
        <div className="mb-0.5 flex items-center gap-1">
          <span className="inline-flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-[#00a650] text-[7px] font-bold text-white">
            ✓
          </span>
          <p className="text-[8px] font-semibold leading-tight text-[#222] sm:text-[9px]">Venda realizada</p>
        </div>
        <p className="text-[10px] font-bold text-[#00a650] sm:text-[11px]">{value}</p>
      </div>
    </div>
  );
}

function TravelTile({ src }: { src: string }) {
  return (
    <div className="h-12 w-12 overflow-hidden rounded-md border-2 border-white shadow-lg sm:h-14 sm:w-14">
      <img src={src} alt="" className="h-full w-full object-cover object-top" loading="lazy" decoding="async" />
    </div>
  );
}

/** Prints principais — exibidos inteiros, sem crop, na faixa inferior do banner */
const BANNER_SHOWCASE_PRINTS = [PROOF_IMAGES[0], PROOF_IMAGES[2], PROOF_IMAGES[4]] as const;

function QuizLandingBanner() {
  return (
    <div className="funnel-landing-banner overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
      {/* Collage: hero duo + quadrados Dubai/Paris + cards Nuvemshop */}
      <div className="relative h-[10.5rem] overflow-hidden bg-[#222] sm:h-[12.5rem]">
        <img
          src={HERO_IMAGE}
          alt="Mentores Ascend Club"
          className="absolute inset-0 h-full w-full object-cover object-[center_15%] opacity-95"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-white" aria-hidden />

        <div className="absolute left-2 top-2 flex flex-col gap-1.5 sm:left-3 sm:top-3">
          <TravelTile src={QUIZ_HERO_ERICK_DUBAI} />
          <TravelTile src={QUIZ_HERO_KELVIN_PARIS} />
        </div>
        <div className="absolute right-2 top-2 flex flex-col gap-1.5 sm:right-3 sm:top-3">
          <TravelTile src={QUIZ_HERO_KELVIN_PARIS} />
          <TravelTile src={QUIZ_HERO_ERICK_DUBAI} />
        </div>

        <NuvemshopSaleCard value="R$ 89,90" className="absolute bottom-3 left-[28%] sm:bottom-4" />
        <NuvemshopSaleCard value="R$ 127,50" className="absolute bottom-3 right-[28%] sm:bottom-4" />
        <NuvemshopSaleCard value="R$ 164,00" className="absolute left-1/2 top-2 -translate-x-1/2 sm:top-3" />
      </div>

      {/* Prints reais — largura total, imagem inteira, legível */}
      <div className="grid grid-cols-3 gap-1.5 bg-white p-2 sm:gap-2 sm:p-3">
        {BANNER_SHOWCASE_PRINTS.map((src) => (
          <img
            key={src}
            src={src}
            alt="Print de resultado real"
            className="h-auto w-full rounded-md shadow-sm ring-1 ring-gray-200"
            loading="eager"
            decoding="async"
          />
        ))}
      </div>
    </div>
  );
}

function FunnelEyebrow({ children }: { children: string }) {
  return (
    <p className="funnel-eyebrow-strip text-xs sm:text-sm font-bold uppercase tracking-[0.15em]">
      {children}
    </p>
  );
}

function FunnelTitle({
  children,
  as: Tag = "h2",
  size = "lg",
  gold = false,
}: {
  children: ReactNode;
  as?: "h1" | "h2";
  size?: "xl" | "lg";
  gold?: boolean;
}) {
  return (
    <Tag
      className={cn(
        "font-bold leading-snug tracking-tight text-[#111]",
        size === "xl" ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl",
        gold && "text-[#E8941C]",
      )}
    >
      {children}
    </Tag>
  );
}

function FunnelHint({ children }: { children: ReactNode }) {
  return <p className="mt-2 text-sm italic leading-relaxed text-[#666] sm:text-base">{children}</p>;
}

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
      <figure className="overflow-hidden rounded-xl border border-gray-200 bg-white min-h-[12rem] shadow-sm">
        <img
          src={proof.imageUrl}
          alt={proof.imageCaption ?? "Print real de resultado"}
          className="w-full max-h-[22rem] object-contain object-top bg-[#f5f5f5]"
          loading="lazy"
        />
        {proof.imageCaption && (
          <figcaption className="border-t border-gray-100 px-4 py-3 text-[11px] uppercase tracking-wider text-[#888] font-inter">
            {proof.imageCaption}
          </figcaption>
        )}
      </figure>
    );
  }

  if (insight.variant === "stat" && proof.statLabel) {
    return (
      <div className="flex min-h-[4.5rem] items-center gap-3 rounded-xl border border-orange-200 bg-orange-50 px-4 py-4">
        <Users className="h-5 w-5 shrink-0 text-[#f2a218]" />
        <p className="text-sm font-bold text-[#c27800] font-inter">{proof.statLabel}</p>
      </div>
    );
  }

  if (proof.quote) {
    return (
      <blockquote className="min-h-[5.5rem] rounded-xl border border-gray-200 bg-gray-50 px-4 py-4">
        <div className="flex gap-3">
          {proof.imageUrl ? (
            <img
              src={proof.imageUrl}
              alt={proof.name ?? ""}
              className="h-11 w-11 shrink-0 rounded-full border border-gray-200 object-cover"
            />
          ) : (
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-orange-200 bg-orange-50">
              <Quote className="h-4 w-4 text-[#f2a218]" />
            </span>
          )}
          <div>
            <p className="text-sm italic leading-relaxed text-[#555] font-inter">
              &ldquo;{proof.quote}&rdquo;
            </p>
            {(proof.name || proof.role) && (
              <footer className="mt-2 text-xs text-[#888] font-inter">
                {proof.name && <span className="font-semibold text-[#444]">{proof.name}</span>}
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
    <footer className="mt-10 space-y-3 border-t border-gray-200 pt-6">
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] uppercase tracking-wider text-[#999] font-inter">
        <span className="inline-flex items-center gap-1.5">
          <Lock className="h-3 w-3 text-[#f2a218]" />
          Sem cartão agora
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="h-3 w-3 text-[#f2a218]" />
          Dados protegidos
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-[#f2a218]" />
          Pagamento Kiwify
        </span>
      </div>
      <p className="mx-auto max-w-sm text-center text-[10px] leading-relaxed text-[#aaa] font-inter">
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
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-[#f2a218]" />
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
    <div className="form-funnel form-funnel-inlead relative flex min-h-screen flex-col bg-white">
      {phase !== "landing" && (
        <header className="relative z-10 px-4 sm:px-6 pt-5 pb-3">
          <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f2a218]">Ascend Club</p>
              {progressDone > 0 && (
                <p className="mt-0.5 text-[10px] text-[#999] font-inter">{stepLabel}</p>
              )}
            </div>
            {progressDone > 0 && (
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-[#999] font-inter">Progresso</p>
                <p className="text-lg font-bold tabular-nums text-[#f2a218]">{progressPct}%</p>
              </div>
            )}
          </div>

          {progressDone > 0 && (
            <div className="mx-auto mt-4 max-w-lg">
              <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-[#f2a218] transition-all duration-500 ease-out"
                  style={{ width: `${phase === "calculating" ? calcProgress : progressPct}%` }}
                />
              </div>
            </div>
          )}
        </header>
      )}

      <main
        className={cn(
          "relative z-10 flex-1 w-full px-4 sm:px-6",
          phase === "landing"
            ? "flex flex-col items-center justify-center py-8 sm:py-12"
            : "mx-auto max-w-lg py-8 sm:py-10",
        )}
      >
        {phase === "landing" && (
          <StepShell stepKey="landing">
            <div className="funnel-landing-inlead mx-auto w-full max-w-[580px] text-center">
              <h1 className="text-[1.3rem] font-extrabold leading-[1.28] tracking-tight text-[#111] sm:text-[1.55rem]">
                {renderHighlightedHeadline(landing.headline)}
              </h1>

              <p className="mt-3 mb-5 text-sm italic leading-relaxed text-[#555] sm:text-[0.95rem]">
                {landing.subheadline}
              </p>

              {landing.heroImageUrl ? (
                <div className="funnel-landing-banner relative w-full aspect-[5/3] overflow-hidden rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.18)]">
                  <img
                    src={landing.heroImageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              ) : (
                <QuizLandingBanner />
              )}

              <button
                type="button"
                onClick={startQuiz}
                className="funnel-landing-inlead-cta mt-5 w-full"
              >
                {landing.ctaLabel}
                <ArrowRight className="h-5 w-5 shrink-0" aria-hidden />
              </button>

              {landing.socialProof && (
                <p className="mt-3 text-xs italic text-[#777] sm:text-sm">{landing.socialProof}</p>
              )}

              {loadError && (
                <p className="mt-3 text-center text-xs text-amber-600 font-inter">
                  Usando configuração padrão (não foi possível carregar do servidor).
                </p>
              )}
            </div>
          </StepShell>
        )}

        {phase === "steps" && currentStep && (
          <StepShell stepKey={`step-${stepIndex}`}>
            {currentStep.type === "choice" && (
              <>
                <div>
                  <FunnelTitle>{currentStep.title}</FunnelTitle>
                  {currentStep.hint && <FunnelHint>{currentStep.hint}</FunnelHint>}
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
                        <p className="text-base font-semibold text-[#111] sm:text-lg">{opt.label}</p>
                        {opt.subtitle && (
                          <p className="mt-1.5 text-sm text-[#777] font-inter transition-colors group-hover:text-[#555]">
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
                <FunnelTitle>{currentStep.title}</FunnelTitle>
                {currentStep.imageUrl && currentStep.variant === "authority" && (
                  <img
                    src={currentStep.imageUrl}
                    alt="Mentores Ascend Club"
                    className="w-full max-h-56 rounded-xl border border-gray-200 object-cover object-top"
                  />
                )}
                <div
                  className={cn(
                    funnel.card,
                    currentStep.variant === "story" && "border-orange-200 bg-orange-50/50",
                  )}
                >
                  <p className="whitespace-pre-line text-base leading-relaxed text-[#444] font-inter">
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
                <FunnelTitle>{currentStep.title}</FunnelTitle>
                {currentStep.imageUrl && (
                  <figure className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <img
                      src={currentStep.imageUrl}
                      alt="Print real de resultado"
                      className="max-h-48 w-full object-contain object-top bg-[#f5f5f5]"
                      loading="lazy"
                    />
                  </figure>
                )}
                <div className={cn(funnel.card, "funnel-marker-solid")}>
                  <p className="whitespace-pre-line text-base leading-relaxed text-[#444] font-inter">
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
                <FunnelTitle>{currentStep.title}</FunnelTitle>
                {currentStep.intro && <FunnelHint>{currentStep.intro}</FunnelHint>}
                <div className="space-y-3">
                  {currentStep.mechanismSteps.map((item, i) => (
                    <div key={`${item.title}-${i}`} className={cn(funnel.card, "bg-white")}>
                      <div className="flex items-start gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-orange-200 bg-orange-50 text-sm font-black text-[#f2a218]">
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-lg font-bold text-[#111]">{item.title}</p>
                          {item.subtitle && (
                            <p className="mt-1 text-sm text-[#666] font-inter">{item.subtitle}</p>
                          )}
                          {item.highlight && (
                            <p className="mt-2 text-sm font-bold text-[#E8941C]">{item.highlight}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {currentStep.bullets && currentStep.bullets.length > 0 && (
                  <ul className="space-y-2.5 text-[#666] font-inter">
                    {currentStep.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#f2a218]" />
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
                  <FunnelTitle>{currentStep.title}</FunnelTitle>
                  {currentStep.hint && <FunnelHint>{currentStep.hint}</FunnelHint>}
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
                                ? "border-[#f2a218] bg-[#f2a218] text-white"
                                : "border-gray-300",
                            )}
                          >
                            {selected ? <Check className="h-3 w-3" /> : null}
                          </span>
                          <p className="text-left text-base font-semibold text-[#111] sm:text-lg">
                            {opt.label}
                          </p>
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
            {activeInsight.eyebrow && <FunnelEyebrow>{activeInsight.eyebrow}</FunnelEyebrow>}
            <FunnelTitle>{activeInsight.title}</FunnelTitle>
            <div
              className={cn(
                funnel.card,
                activeInsight.variant === "objection" && "funnel-marker-solid border-orange-200 bg-orange-50/60",
              )}
            >
              <p className="whitespace-pre-line text-base leading-relaxed text-[#444] font-inter">
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
            <div className="space-y-8 py-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-orange-200">
                <Loader2 className="h-8 w-8 animate-spin text-[#f2a218]" />
              </div>
              <div>
                <p className="funnel-eyebrow-strip mb-4 inline-block text-sm font-bold uppercase tracking-[0.2em]">
                  Processando
                </p>
                <p className="min-h-[3.5rem] text-xl font-bold text-[#111] transition-opacity duration-300 sm:text-2xl">
                  {calculatingMessages[calcMsgIndex]}
                </p>
              </div>
              <div className="space-y-2 text-left">
                {calculatingMessages.map((msg, i) => (
                  <div
                    key={msg}
                    className={cn(
                      "flex items-center gap-2 text-base font-inter transition-all duration-300",
                      i <= calcMsgIndex ? "text-[#444]" : "text-[#ccc]",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-full border text-[10px]",
                        i < calcMsgIndex
                          ? "border-[#f2a218] bg-[#f2a218] text-white"
                          : i === calcMsgIndex
                            ? "border-[#f2a218]/60 text-[#f2a218]"
                            : "border-gray-200",
                      )}
                    >
                      {i < calcMsgIndex ? <Check className="h-3 w-3" /> : i + 1}
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
            <FunnelEyebrow>{resultConfig.eyebrow}</FunnelEyebrow>
            <FunnelTitle size="lg" gold>
              {resultConfig.headline}
            </FunnelTitle>
            {resultConfig.badge && (
              <div className="inline-flex items-center gap-2 funnel-eyebrow-strip px-5 py-2.5">
                <Sparkles className="h-5 w-5 text-[#f2a218]" />
                <span className="text-sm font-bold uppercase tracking-[0.15em] text-[#c27800]">
                  {resultConfig.badge}
                </span>
              </div>
            )}
            {resultConfig.highlights && resultConfig.highlights.length > 0 && (
              <ul className="funnel-marker-solid space-y-3 rounded-xl">
                {resultConfig.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[#444] font-inter">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#f2a218]" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
            {resultConfig.reassurance && (
              <p className="text-sm leading-relaxed text-[#666] font-inter">{resultConfig.reassurance}</p>
            )}

            {answerChips.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {answerChips.map((chip) => (
                  <span key={chip.key} className={funnel.chip}>
                    {chip.text}
                  </span>
                ))}
              </div>
            )}

            <div className={funnel.offerCard}>
              <h3 className="text-xl font-bold text-[#111] sm:text-2xl">{offerStep.title}</h3>
              <p className="mt-3 text-[#666] font-inter">{offerStep.body}</p>

              {offerStep.urgencyNote && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-red-600 font-inter">
                    {offerStep.urgencyNote}
                  </p>
                </div>
              )}

              <div className="mt-5 flex min-h-[4.5rem] items-end gap-3">
                {offerStep.originalPriceLabel && (
                  <p className="pb-1 text-lg text-[#bbb] font-inter line-through">
                    {offerStep.originalPriceLabel}
                  </p>
                )}
                <p className="funnel-price-pop text-6xl font-bold leading-none text-[#f2a218] sm:text-7xl tabular-nums">
                  {animatedPrice}
                </p>
              </div>

              {offerStep.priceNote && (
                <p className="mt-2 text-xs uppercase tracking-wide text-[#999] font-inter">
                  {offerStep.priceNote}
                </p>
              )}

              <ul className="mt-6 space-y-2.5 border-t border-gray-100 pt-5">
                {offerStep.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-[#555] font-inter">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#f2a218]" />
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
                    className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4"
                  >
                    <p className="text-sm italic leading-relaxed text-[#555] font-inter">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <footer className="mt-2 text-xs text-[#888] font-inter">
                      <span className="font-semibold text-[#444]">{t.name}</span>
                      {t.role ? ` · ${t.role}` : ""}
                    </footer>
                  </blockquote>
                ))}
              </div>
            )}

            <button type="button" onClick={() => setPhase("contact")} className={funnel.cta}>
              {offerStep.ctaLabel}
              <ArrowRight className="w-5 h-5" />
            </button>
          </StepShell>
        )}

        {phase === "contact" && (
          <StepShell stepKey={`contact-${contactStep}`}>
            <div>
              <FunnelEyebrow>Quase lá</FunnelEyebrow>
              <FunnelTitle>
                {contactStep === "name"
                  ? contact.nameTitle
                  : contactStep === "email"
                    ? contact.emailTitle
                    : contact.phoneTitle}
              </FunnelTitle>
              <p className="mt-2 text-[#666] font-inter">
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
                      ? "bg-[#f2a218]"
                      : "bg-gray-200",
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
                className="w-full py-2 text-xs uppercase tracking-wider text-[#999] transition-colors hover:text-[#666] font-inter"
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
