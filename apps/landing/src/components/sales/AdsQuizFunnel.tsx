"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Loader2,
  Lock,
  TrendingUp,
  Users,
  ChevronLeft,
  ChevronRight,
  Store,
  ExternalLink,
} from "lucide-react";
import type { AdsQuizConfig, AdsQuizStep } from "@crm-ascend/validation/ads-quiz";
import {
  DEFAULT_ADS_QUIZ_CONFIG,
  collectProfileTags,
  normalizeAdsQuizConfig,
  resolveCalculatingMessages,
  resolveDynamicBody,
  resolveResultDisplay,
} from "@crm-ascend/validation/ads-quiz";
import { ATTRIBUTION_COOKIE } from "@/lib/sales/consent";
import { parseAttributionCookie, readAttributionFromDocument, getClientCookie } from "@/lib/sales/utm";
import { getMetaBrowserIds } from "@/lib/sales/meta-attribution";
import { initMetaPixel, trackMetaLead } from "@/lib/sales/meta-pixel-client";
import { getMetaPixelId } from "@/lib/sales/meta-config";
import { CONSENT_COOKIE, parseConsent } from "@/lib/sales/consent";
import { ensureLandingSession, trackEvent } from "@/lib/sales/track-client";
import { buildPersonalizedCheckoutUrl } from "@/lib/sales/checkout-url";
import { openCheckoutInNewTab } from "@/lib/sales/open-checkout";
import { cn } from "@/lib/utils";
import {
  formatBrazilMobilePhone,
  isValidBrazilMobilePhone,
  stripPhoneDigits,
} from "@/lib/sales/br-phone";
import { QUIZ_LANDING_BANNER } from "@/lib/sales/media";
import { buildStoreProxyPath } from "@/lib/sales/store-proxy";
import {
  type QuizTestimonialVideo,
} from "@/lib/sales/quiz-evidence";

type Phase = "landing" | "lead" | "steps" | "calculating" | "result";
type LeadStep = "name" | "age" | "income" | "email" | "phone";

const LEAD_STEP_ORDER: LeadStep[] = ["name", "age", "income", "email", "phone"];

const INCOME_OPTIONS = [
  { id: "ate_2000", label: "Até R$ 2.000" },
  { id: "2000_5000", label: "R$ 2.000 a R$ 5.000" },
  { id: "5000_10000", label: "R$ 5.000 a R$ 10.000" },
  { id: "acima_10000", label: "Acima de R$ 10.000" },
] as const;

const DEFAULT_OFFER = DEFAULT_ADS_QUIZ_CONFIG.steps.find((s) => s.type === "offer")!;
const DEFAULT_CALCULATING = DEFAULT_ADS_QUIZ_CONFIG.calculating!;
const DEFAULT_RESULT = DEFAULT_ADS_QUIZ_CONFIG.result!;

const funnel = {
  choice:
    "group w-full min-w-0 text-left rounded-xl border border-gray-200 bg-white px-4 py-3.5 sm:px-5 sm:py-5 transition-all duration-200 hover:border-[#f2a218] hover:bg-orange-50/60 shadow-sm active:scale-[0.99]",
  choiceSelected: "border-[#f2a218] bg-orange-50 ring-1 ring-[#f2a218]/25",
  input:
    "w-full min-w-0 rounded-xl bg-white border border-gray-300 px-4 py-3.5 text-[#111] text-base sm:px-5 sm:py-4 sm:text-lg font-inter placeholder:text-gray-400 focus:border-[#f2a218] focus:outline-none focus:ring-2 focus:ring-[#f2a218]/20 transition-all",
  cta: "funnel-landing-inlead-cta w-full max-w-full",
  offerCard: "rounded-2xl border border-gray-200 bg-white p-4 sm:p-8 shadow-sm",
  card: "rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 sm:px-5 sm:py-5",
  chip: "inline-flex rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-[11px] text-[#555] font-inter",
} as const;

function renderHighlightedHeadline(text: string) {
  return text
    .split(/(\*\*[^*]+\*\*|\[\[[^\]]+\]\])/g)
    .filter(Boolean)
    .map((segment, index) => {
      if (segment.startsWith("**") && segment.endsWith("**")) {
        return (
          <span key={index} className="text-[#E8941C]">
            {segment.slice(2, -2)}
          </span>
        );
      }
      if (segment.startsWith("[[") && segment.endsWith("]]")) {
        return (
          <span
            key={index}
            className="mx-0.5 inline-block rounded-md bg-[#00a650]/15 px-1.5 py-0.5 font-black tabular-nums text-[#007a3d] ring-1 ring-[#00a650]/25"
          >
            {segment.slice(2, -2)}
          </span>
        );
      }
      return <span key={index}>{segment}</span>;
    });
}

function LandingUrgencyBadge({ label }: { label: string }) {
  return (
    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-200/80 bg-gradient-to-r from-red-50 via-orange-50 to-amber-50 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-red-700 shadow-sm sm:text-[11px]">
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
      </span>
      {label}
    </div>
  );
}

const FUNNEL_MAX_W = "w-full max-w-md sm:max-w-xl lg:max-w-2xl";
const LANDING_MAX_W = "w-full max-w-md sm:max-w-xl lg:max-w-2xl";

function dedupeProofs(urls: readonly string[]): string[] {
  return [...new Set(urls.filter(Boolean))];
}

function PhoneProofCard({
  src,
  className,
  eager,
}: {
  src: string;
  className?: string;
  eager?: boolean;
}) {
  return (
    <figure
      className={cn(
        "phone-proof-frame overflow-hidden rounded-[1.35rem] border-[3px] border-neutral-800 bg-neutral-950 shadow-[0_12px_32px_rgba(0,0,0,0.28)] ring-1 ring-white/15",
        className,
      )}
    >
      <div className="relative aspect-[9/19.5] w-full">
        <img
          src={src}
          alt="Print real no celular"
          className="absolute inset-0 h-full w-full object-contain object-center bg-neutral-950"
          loading={eager ? "eager" : "lazy"}
          decoding="async"
        />
      </div>
    </figure>
  );
}

function PhoneProofGallery({
  urls,
  label = "Resultado verificado",
  compact,
  eager,
}: {
  urls: readonly string[];
  label?: string;
  compact?: boolean;
  eager?: boolean;
}) {
  const resolved = dedupeProofs(urls);
  if (resolved.length === 0) return null;
  return (
    <div className="min-w-0 space-y-2.5">
      {label ? (
        <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-[#888] sm:text-[11px]">
          <TrendingUp className="h-3.5 w-3.5 shrink-0 text-[#00a650]" aria-hidden />
          {label}
        </p>
      ) : null}
      <div
        className={cn(
          "phone-proof-gallery min-w-0 grid gap-3",
          compact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-2",
        )}
      >
        {resolved.map((src) => (
          <PhoneProofCard key={src} src={src} eager={eager} className="mx-auto w-full max-w-[220px]" />
        ))}
      </div>
    </div>
  );
}

function TestimonialVideoPage({
  item,
  title,
  intro,
}: {
  item: QuizTestimonialVideo;
  title: string;
  intro?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playWithSound = () => {
      video.muted = false;
      video.defaultMuted = false;
      video.volume = 1;
      void video.play().catch(() => {
        /* alguns browsers bloqueiam até haver gesto no vídeo */
      });
    };

    playWithSound();
    video.addEventListener("canplay", playWithSound, { once: true });

    return () => video.removeEventListener("canplay", playWithSound);
  }, [item.videoUrl]);

  return (
    <div className="space-y-4">
      <FunnelTitle>{title}</FunnelTitle>
      {intro ? <FunnelHint>{intro}</FunnelHint> : null}
      <div className="mx-auto w-full max-w-[min(100%,20rem)]">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-[#111] shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
          <div className="relative aspect-[9/16] max-h-[min(72vh,640px)] w-full">
            <video
              ref={videoRef}
              src={item.videoUrl}
              autoPlay
              controls
              playsInline
              preload="auto"
              className="absolute inset-0 h-full w-full object-contain"
              onPointerDown={() => {
                const video = videoRef.current;
                if (!video) return;
                video.muted = false;
                video.volume = 1;
                void video.play();
              }}
            />
            <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-1 text-[10px] font-bold uppercase text-white">
              Depoimento
            </span>
          </div>
          {(item.quote || item.name) && (
            <div className="border-t border-gray-100 bg-white px-4 py-4 text-left">
              {item.quote && (
                <p className="text-sm leading-relaxed text-[#444]">&ldquo;{item.quote}&rdquo;</p>
              )}
              <p className="mt-2 text-xs font-semibold text-[#888]">
                {item.name}
                {item.role ? ` · ${item.role}` : ""}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RequiredVideoPage({
  title,
  intro,
  videoUrl,
  posterUrl,
  ctaLabel,
  onComplete,
}: {
  title: string;
  intro?: string;
  videoUrl: string;
  posterUrl?: string;
  ctaLabel: string;
  onComplete: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const maxWatchedRef = useRef(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    maxWatchedRef.current = 0;
    setFinished(false);
  }, [videoUrl]);

  const clampPlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video || finished) return;
    if (video.currentTime > maxWatchedRef.current + 0.35) {
      video.currentTime = maxWatchedRef.current;
      return;
    }
    maxWatchedRef.current = Math.max(maxWatchedRef.current, video.currentTime);
  }, [finished]);

  const handleRateChange = () => {
    const video = videoRef.current;
    if (!video || finished) return;
    if (video.playbackRate !== 1) {
      video.playbackRate = 1;
    }
  };

  const handleEnded = () => {
    const video = videoRef.current;
    if (video && Number.isFinite(video.duration)) {
      maxWatchedRef.current = video.duration;
    }
    setFinished(true);
  };

  return (
    <div className="space-y-4">
      <FunnelTitle>{title}</FunnelTitle>
      {intro ? <FunnelHint>{intro}</FunnelHint> : null}
      <div className="mx-auto w-full max-w-[min(100%,28rem)]">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-[#111] shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
          <div className="relative aspect-video max-h-[min(72vh,640px)] w-full">
            <video
              ref={videoRef}
              src={videoUrl}
              poster={posterUrl}
              controls
              playsInline
              preload="metadata"
              controlsList="nodownload noremoteplayback"
              onTimeUpdate={clampPlayback}
              onSeeking={clampPlayback}
              onRateChange={handleRateChange}
              onEnded={handleEnded}
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
        </div>
      </div>
      {!finished ? (
        <p className="flex items-center justify-center gap-2 text-center text-xs font-medium text-[#888]">
          <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden />
          Assista até o fim para continuar
        </p>
      ) : (
        <button type="button" onClick={onComplete} className={funnel.cta}>
          {ctaLabel}
          <ArrowRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

function ProofGalleryPage({
  title,
  intro,
  imageUrls,
}: {
  title: string;
  intro?: string;
  imageUrls: readonly string[];
}) {
  return (
    <div className="space-y-4">
      <FunnelTitle>{title}</FunnelTitle>
      {intro ? <FunnelHint>{intro}</FunnelHint> : null}
      <PhoneProofGallery urls={dedupeProofs(imageUrls)} label="" compact eager />
    </div>
  );
}

type StoreExample = {
  name: string;
  niche?: string;
  imageUrl?: string;
  storeUrl: string;
};

function storeHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function StoreShowcaseCarousel({ stores }: { stores: StoreExample[] }) {
  const liveStores = stores.filter((s) => s.storeUrl?.trim());
  const [index, setIndex] = useState(0);
  const [frameLoading, setFrameLoading] = useState(true);
  const total = liveStores.length;

  useEffect(() => {
    setFrameLoading(true);
  }, [index]);

  if (total === 0) return null;

  const current = liveStores[index]!;
  const proxySrc = buildStoreProxyPath(current.storeUrl);
  const host = storeHostname(current.storeUrl);

  return (
    <div className="space-y-3">
      <p className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-[#888]">
        <Store className="h-3.5 w-3.5 text-[#f2a218]" aria-hidden />
        Loja real · navegue pelo site
      </p>

      <div className="relative mx-auto w-full max-w-md">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_10px_36px_rgba(0,0,0,0.12)]">
          <div className="flex items-center gap-2 border-b border-gray-200 bg-[#f4f4f5] px-3 py-2">
            <div className="flex shrink-0 gap-1" aria-hidden>
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            </div>
            <div className="min-w-0 flex-1 truncate rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[11px] text-[#555]">
              {host}
            </div>
            <a
              href={current.storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-[#888] transition-colors hover:text-[#f2a218]"
              aria-label={`Abrir ${current.name} em nova aba`}
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>
          </div>

          <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-3 py-2">
            <div className="min-w-0 text-left">
              <p className="truncate text-sm font-bold text-[#111]">{current.name}</p>
              {current.niche ? (
                <p className="truncate text-[11px] text-[#888]">{current.niche}</p>
              ) : null}
            </div>
            <span className="shrink-0 rounded-full bg-[#f2a218]/15 px-2 py-0.5 text-[10px] font-bold tabular-nums text-[#c27800]">
              {index + 1}/{total}
            </span>
          </div>

          <div className="relative h-[min(58vh,480px)] w-full bg-[#ececec]">
            {frameLoading ? (
              <div className="absolute inset-0 z-[1] flex items-center justify-center bg-white/80">
                <Loader2 className="h-7 w-7 animate-spin text-[#f2a218]" aria-hidden />
                <span className="sr-only">Carregando loja…</span>
              </div>
            ) : null}
            <iframe
              key={proxySrc}
              title={`Loja ${current.name}`}
              src={proxySrc}
              className="h-full w-full border-0 bg-white"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              onLoad={() => setFrameLoading(false)}
            />
          </div>
        </div>

        {total > 1 && (
          <>
            <button
              type="button"
              aria-label="Loja anterior"
              onClick={() => setIndex((i) => (i - 1 + total) % total)}
              className="absolute left-1 top-[calc(50%+20px)] z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-[#444] shadow-md active:scale-95"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Próxima loja"
              onClick={() => setIndex((i) => (i + 1) % total)}
              className="absolute right-1 top-[calc(50%+20px)] z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-[#444] shadow-md active:scale-95"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {liveStores.map((store, i) => (
            <button
              key={store.storeUrl}
              type="button"
              aria-label={`Ver loja ${store.name}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => setIndex(i)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
                i === index
                  ? "border-[#f2a218] bg-[#f2a218]/10 text-[#c27800]"
                  : "border-gray-200 bg-white text-[#666] hover:border-[#f2a218]/40",
              )}
            >
              {store.name}
            </button>
          ))}
        </div>
      )}

      <p className="text-center text-[11px] text-[#999]">
        Toque nos links dentro da loja para navegar — igual quando a sua estiver no ar.
      </p>
    </div>
  );
}

function StoreShowcasePage({
  title,
  intro,
  stores,
}: {
  title: string;
  intro?: string;
  stores: StoreExample[];
}) {
  return (
    <div className="space-y-4">
      <FunnelTitle>{title}</FunnelTitle>
      {intro ? <FunnelHint>{intro}</FunnelHint> : null}
      <StoreShowcaseCarousel stores={stores} />
    </div>
  );
}

function QuizLandingHero() {
  return (
    <div className="mx-auto w-full max-w-[min(100%,22rem)] sm:max-w-xl">
      <div className="quiz-landing-hero relative aspect-[3/2] w-full overflow-hidden rounded-2xl bg-neutral-950 shadow-[0_8px_28px_rgba(0,0,0,0.22)]">
        <img
          src={QUIZ_LANDING_BANNER}
          alt="Erick e Kelvin — loja online, resultados reais e liberdade geográfica"
          className="absolute inset-0 h-full w-full object-cover object-[center_35%]"
          loading="eager"
          decoding="async"
        />
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
        size === "xl" ? "text-xl sm:text-3xl" : "text-lg sm:text-2xl",
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

function StepShell({ children, stepKey }: { children: React.ReactNode; stepKey: string }) {
  return (
    <div key={stepKey} className="quiz-step-enter min-w-0 space-y-4 sm:space-y-6">
      {children}
    </div>
  );
}

function scrollFunnelToTop() {
  if (typeof window === "undefined") return;
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export default function AdsQuizFunnel() {
  const [config, setConfig] = useState<AdsQuizConfig | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [phase, setPhase] = useState<Phase>("landing");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [leadStep, setLeadStep] = useState<LeadStep>("name");
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [income, setIncome] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [leadSaving, setLeadSaving] = useState(false);
  const [calcMsgIndex, setCalcMsgIndex] = useState(0);
  const [calcProgress, setCalcProgress] = useState(0);
  const [resultViewed, setResultViewed] = useState(false);
  const [multiDraft, setMultiDraft] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const calculatingStarted = useRef(false);

  useEffect(() => {
    void ensureLandingSession().then(() => {
      trackEvent("PageView", { title: "Quiz anúncios", page: "/form" });
    });
  }, []);

  useEffect(() => {
    const tryInitMeta = () => {
      const consent = parseConsent(getClientCookie(CONSENT_COOKIE));
      if (consent?.marketing && getMetaPixelId()) {
        initMetaPixel();
      }
    };
    tryInitMeta();
    window.addEventListener("ascend:consent_change", tryInitMeta);
    return () => window.removeEventListener("ascend:consent_change", tryInitMeta);
  }, []);

  useEffect(() => {
    void fetch("/api/quiz/config")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j: { config: AdsQuizConfig }) => setConfig(normalizeAdsQuizConfig(j.config)))
      .catch(() => {
        setLoadError(true);
        setConfig(normalizeAdsQuizConfig(DEFAULT_ADS_QUIZ_CONFIG));
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
  const progressTotal = LEAD_STEP_ORDER.length + questionSteps.length + 2;
  const progressDone = useMemo(() => {
    if (phase === "landing") return 0;
    if (phase === "lead") {
      return LEAD_STEP_ORDER.indexOf(leadStep) + 1;
    }
    const base = LEAD_STEP_ORDER.length;
    if (phase === "steps") return base + stepIndex + 1;
    if (phase === "calculating") return base + questionSteps.length + 1;
    if (phase === "result") return base + questionSteps.length + 2;
    return progressTotal;
  }, [phase, stepIndex, leadStep, questionSteps.length, progressTotal]);

  const progressPct = progressTotal > 0 ? Math.round((progressDone / progressTotal) * 100) : 0;
  const animatedPrice = useCountUp(offerStep?.priceLabel ?? "R$197", phase === "result" && resultViewed);

  useEffect(() => {
    scrollFunnelToTop();
    const frame = requestAnimationFrame(() => scrollFunnelToTop());
    return () => cancelAnimationFrame(frame);
  }, [phase, stepIndex, leadStep]);

  useEffect(() => {
    if (phase !== "lead") return;
    if (leadStep === "income") return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => window.clearTimeout(t);
  }, [phase, leadStep]);

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

  const pickOption = (stepId: string, optionId: string) => {
    const next = { ...answers, [stepId]: optionId };
    setAnswers(next);
    const tags = collectProfileTags(questionSteps, next);
    persistProgress(stepId, next, { profile_tags: tags });
    trackEvent("quiz_step", { step_id: stepId, option_id: optionId });
    window.setTimeout(() => advanceAfterQuestion(), 180);
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
    persistProgress(currentStep.id, next, { profile_tags: tags });
    trackEvent("quiz_step", { step_id: currentStep.id, option_id: value });
    setPhase("steps");
    advanceAfterQuestion();
  };

  const startQuiz = () => {
    trackEvent("quiz_start", { cta: "quiz_form" });
    setLeadStep("name");
    setPhase("lead");
  };

  const firstNameValue = fullName.trim().split(/\s+/)[0] ?? "";
  const nameOk = fullName.trim().length >= 2;
  const ageNum = Number.parseInt(age.trim(), 10);
  const ageOk = Number.isFinite(ageNum) && ageNum >= 16 && ageNum <= 99;
  const incomeOk = income.length > 0;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const phoneDigits = stripPhoneDigits(phone);
  const phoneOk = isValidBrazilMobilePhone(phone);

  const finishLeadCapture = async () => {
    if (!nameOk || !ageOk || !incomeOk || !emailOk || !phoneOk || leadSaving) return;
    setLeadSaving(true);
    const leadEventId = crypto.randomUUID();
    const metaIds = getMetaBrowserIds();
    try {
      await ensureLandingSession();
      await fetch("/api/sales/lead", {
        method: "POST",
        headers: sessionHeaders(),
        credentials: "same-origin",
        keepalive: true,
        body: JSON.stringify({
          type: "quiz_lead_capture",
          full_name: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phoneDigits,
          age: ageNum,
          income,
          utm: readUtm(),
          meta: { event_id: leadEventId, ...metaIds },
        }),
      });
      trackMetaLead(leadEventId, "quiz_form");
      trackEvent("quiz_lead_capture", {
        cta: "quiz_form",
        income,
        meta_event_id: leadEventId,
      });
      setPhase("steps");
      setStepIndex(0);
    } finally {
      setLeadSaving(false);
    }
  };

  const finishCheckout = async () => {
    if (!phoneOk || !emailOk || !nameOk || !config) return;
    setLeadSaving(true);
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
          full_name: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phoneDigits,
          marketing_consent: true,
          cta: "quiz_form",
          utm: readUtm(),
          answers: {
            ...answers,
            lead_age: String(ageNum),
            lead_income: income,
          },
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
      setLeadSaving(false);
    }
  };

  const canAdvanceLead =
    (leadStep === "name" && nameOk) ||
    (leadStep === "age" && ageOk) ||
    (leadStep === "income" && incomeOk) ||
    (leadStep === "email" && emailOk) ||
    (leadStep === "phone" && phoneOk && !leadSaving);

  const advanceLead = () => {
    if (leadStep === "name" && nameOk) setLeadStep("age");
    else if (leadStep === "age" && ageOk) setLeadStep("income");
    else if (leadStep === "income" && incomeOk) setLeadStep("email");
    else if (leadStep === "email" && emailOk) setLeadStep("phone");
    else if (leadStep === "phone" && phoneOk) void finishLeadCapture();
  };

  const goBackLead = () => {
    const idx = LEAD_STEP_ORDER.indexOf(leadStep);
    if (idx > 0) setLeadStep(LEAD_STEP_ORDER[idx - 1]!);
  };

  useEffect(() => {
    if (phase !== "lead") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;
      if (leadStep === "income") return;
      if (!canAdvanceLead) return;
      e.preventDefault();
      advanceLead();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, leadStep, canAdvanceLead, nameOk, ageOk, incomeOk, emailOk, phoneOk, leadSaving]);

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
      : phase === "lead"
        ? `Cadastro · ${
            leadStep === "name"
              ? "nome"
              : leadStep === "age"
                ? "idade"
                : leadStep === "income"
                  ? "renda"
                  : leadStep === "email"
                    ? "e-mail"
                    : "WhatsApp"
          }`
      : phase === "calculating"
          ? "Analisando"
          : phase === "result"
            ? "Seu diagnóstico"
            : `Pergunta ${stepIndex + 1}`;

  return (
    <div className="form-funnel form-funnel-inlead relative flex min-h-screen flex-col overflow-x-hidden bg-white">
      {phase !== "landing" && (
        <header className="relative z-10 px-4 pt-4 pb-3 sm:px-6 sm:pt-5">
          <div className={cn("mx-auto flex items-center justify-between gap-3", FUNNEL_MAX_W)}>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f2a218]">Ascend</p>
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
            <div className={cn("mx-auto mt-4", FUNNEL_MAX_W)}>
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
          "relative z-10 flex-1 w-full min-w-0 px-4 sm:px-6",
          phase === "landing"
            ? "flex flex-col items-center justify-start py-5 sm:justify-center sm:py-10"
            : cn("mx-auto py-5 sm:py-8", FUNNEL_MAX_W),
        )}
      >
        {phase === "landing" && (
          <StepShell stepKey="landing">
            <div className={cn("funnel-landing-inlead mx-auto w-full min-w-0 text-center", LANDING_MAX_W)}>
              {landing.eyebrow?.trim() ? (
                <LandingUrgencyBadge label={landing.eyebrow} />
              ) : null}

              <h1 className="text-[1.15rem] font-extrabold leading-[1.28] tracking-tight text-[#111] sm:text-[1.55rem]">
                {renderHighlightedHeadline(landing.headline)}
              </h1>

              <p className="mb-4 mt-3 text-[0.9rem] font-semibold leading-relaxed text-[#333] sm:mb-5 sm:mt-4 sm:text-base">
                {renderHighlightedHeadline(landing.subheadline)}
              </p>

              {landing.heroImageUrl ? (
                <div className="relative aspect-[16/11] w-full overflow-hidden rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.18)]">
                  <img
                    src={landing.heroImageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              ) : (
                <div className="funnel-landing-banner flex w-full justify-center">
                  <QuizLandingHero />
                </div>
              )}

              <button
                type="button"
                onClick={startQuiz}
                className="funnel-landing-inlead-cta funnel-landing-inlead-cta-pulse mt-4 w-full sm:mt-5"
              >
                {landing.ctaLabel}
                <ArrowRight className="h-5 w-5 shrink-0" aria-hidden />
              </button>

              {landing.socialProof && (
                <p className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#666] sm:text-sm">
                  <Users className="h-3.5 w-3.5 text-[#f2a218]" aria-hidden />
                  {landing.socialProof}
                </p>
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
                        onClick={() => pickOption(currentStep.id, opt.id)}
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
                    alt="Kelvin e Erick — mentores Ascend"
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

            {currentStep.type === "required_video" && (
              <RequiredVideoPage
                title={currentStep.title}
                intro={currentStep.intro}
                videoUrl={currentStep.videoUrl}
                posterUrl={currentStep.posterUrl}
                ctaLabel={currentStep.ctaLabel}
                onComplete={advanceLinearStep}
              />
            )}

            {currentStep.type === "testimonial" && (
              <>
                <TestimonialVideoPage
                  title={currentStep.title}
                  intro={currentStep.intro}
                  item={{
                    name: currentStep.name,
                    role: currentStep.role,
                    quote: currentStep.quote,
                    videoUrl: currentStep.videoUrl,
                  }}
                />
                <button type="button" onClick={advanceLinearStep} className={funnel.cta}>
                  {currentStep.ctaLabel}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </>
            )}

            {currentStep.type === "store_showcase" && (
              <>
                <StoreShowcasePage
                  title={currentStep.title}
                  intro={currentStep.intro}
                  stores={currentStep.stores}
                />
                <button type="button" onClick={advanceLinearStep} className={funnel.cta}>
                  {currentStep.ctaLabel}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </>
            )}

            {currentStep.type === "proof_gallery" && (
              <>
                <ProofGalleryPage
                  title={currentStep.title}
                  intro={currentStep.intro}
                  imageUrls={currentStep.imageUrls}
                />
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
            <FunnelTitle size="lg" gold>
              {resultConfig.headline}
            </FunnelTitle>

            <div className={cn(funnel.offerCard, "text-center")}>
              <div className="flex min-h-[4.5rem] items-end justify-center gap-3">
                {offerStep.originalPriceLabel && (
                  <p className="pb-1 text-lg text-[#bbb] font-inter line-through">
                    {offerStep.originalPriceLabel}
                  </p>
                )}
                <p className="funnel-price-pop text-4xl font-bold leading-none text-[#f2a218] sm:text-6xl tabular-nums">
                  {animatedPrice}
                </p>
              </div>
              {offerStep.priceNote && (
                <p className="mt-2 text-xs uppercase tracking-wide text-[#999] font-inter">
                  {offerStep.priceNote}
                </p>
              )}
            </div>

            <button type="button" onClick={() => void finishCheckout()} className={funnel.cta}>
              {offerStep.ctaLabel}
              <ArrowRight className="w-5 h-5" />
            </button>
          </StepShell>
        )}

        {phase === "lead" && (
          <StepShell stepKey={`lead-${leadStep}`}>
            <div>
              <FunnelEyebrow>Antes do diagnóstico</FunnelEyebrow>
              <FunnelTitle>
                {leadStep === "name"
                  ? contact.nameTitle
                  : leadStep === "age"
                    ? contact.ageTitle
                    : leadStep === "income"
                      ? contact.incomeTitle
                      : leadStep === "email"
                        ? contact.emailTitle
                        : contact.phoneTitle}
              </FunnelTitle>
              <p className="mt-2 text-[#666] font-inter">
                {leadStep === "name"
                  ? contact.nameHint
                  : leadStep === "age"
                    ? contact.ageHint
                    : leadStep === "income"
                      ? contact.incomeHint
                      : leadStep === "email"
                        ? contact.emailHint
                        : contact.phoneHint}
              </p>
            </div>

            <div className="flex gap-1.5">
              {LEAD_STEP_ORDER.map((s, i) => (
                <span
                  key={s}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-colors",
                    LEAD_STEP_ORDER.indexOf(leadStep) >= i ? "bg-[#f2a218]" : "bg-gray-200",
                  )}
                />
              ))}
            </div>

            {leadStep === "name" && (
              <input
                ref={inputRef}
                type="text"
                autoComplete="name"
                placeholder="Seu nome completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={funnel.input}
              />
            )}
            {leadStep === "age" && (
              <input
                ref={inputRef}
                type="number"
                inputMode="numeric"
                min={16}
                max={99}
                placeholder="Ex: 32"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className={funnel.input}
              />
            )}
            {leadStep === "income" && (
              <div className="space-y-2">
                {INCOME_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setIncome(opt.id)}
                    className={cn(
                      funnel.choice,
                      income === opt.id && funnel.choiceSelected,
                    )}
                  >
                    <span className="block text-sm font-semibold text-[#222] sm:text-base">{opt.label}</span>
                  </button>
                ))}
              </div>
            )}
            {leadStep === "email" && (
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
            {leadStep === "phone" && (
              <input
                ref={inputRef}
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={(e) => setPhone(formatBrazilMobilePhone(e.target.value))}
                maxLength={16}
                className={funnel.input}
              />
            )}

            <button
              type="button"
              disabled={!canAdvanceLead}
              onClick={advanceLead}
              className={funnel.cta}
            >
              {leadStep === "phone" && leadSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Salvando…
                </>
              ) : (
                <>
                  {leadStep === "phone" ? contact.submitLabel : "Continuar"}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {leadStep !== "name" && (
              <button
                type="button"
                onClick={goBackLead}
                className="w-full py-2 text-xs uppercase tracking-wider text-[#999] transition-colors hover:text-[#666] font-inter"
              >
                Voltar
              </button>
            )}

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
