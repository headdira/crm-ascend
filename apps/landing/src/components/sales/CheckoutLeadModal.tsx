"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowRight, Loader2, X } from "lucide-react";
import { ATTRIBUTION_COOKIE } from "@/lib/sales/consent";
import { parseAttributionCookie, readAttributionFromDocument } from "@/lib/sales/utm";
import { getClientCookie } from "@/lib/sales/utm";
import { brandCta, brandTypography } from "./brand-preview/tokens";
import { cn } from "@/lib/utils";

type Step = "name" | "email" | "phone";

const STEP_ORDER: Step[] = ["name", "email", "phone"];

type Props = {
  open: boolean;
  onClose: () => void;
  checkoutUrl: string;
  trackLabel?: string;
};

function normalizePhone(value: string): string {
  return value.replace(/\D/g, "");
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

export default function CheckoutLeadModal({ open, onClose, checkoutUrl, trackLabel }: Props) {
  const [step, setStep] = useState<Step>("name");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStep("name");
    setFirstName("");
    setEmail("");
    setPhone("");
    setStatus("idle");
    setErrorMsg(null);
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

  if (!open) return null;

  const stepIndex = STEP_ORDER.indexOf(step);
  const firstNameValue = firstName.trim().split(/\s+/)[0] ?? "";
  const nameOk = firstNameValue.length >= 2;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const phoneDigits = normalizePhone(phone);
  const phoneOk = phoneDigits.length >= 10;

  const goToKiwify = () => {
    window.open(checkoutUrl, "_blank", "noopener,noreferrer");
    if (trackLabel) {
      window.dispatchEvent(
        new CustomEvent("ascend:cta_click", { detail: { label: trackLabel } }),
      );
    }
    onClose();
  };

  const goBack = () => {
    setErrorMsg(null);
    if (step === "email") setStep("name");
    else if (step === "phone") setStep("email");
  };

  const goNext = () => {
    setErrorMsg(null);
    if (step === "name" && nameOk) setStep("email");
    else if (step === "email" && emailOk) setStep("phone");
  };

  const submitAndCheckout = async () => {
    if (!phoneOk) return;
    setStatus("loading");
    setErrorMsg(null);

    const rawAttribution = getClientCookie(ATTRIBUTION_COOKIE);
    const fromCookie = parseAttributionCookie(rawAttribution);
    const utm = { ...readAttributionFromDocument(), ...(fromCookie ?? {}) };

    try {
      const res = await fetch("/api/sales/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: firstNameValue,
          email: email.trim().toLowerCase(),
          phone: phoneDigits,
          marketing_consent: true,
          utm: Object.keys(utm).length ? utm : undefined,
        }),
      });
      if (!res.ok) throw new Error("lead_failed");
      goToKiwify();
    } catch {
      setStatus("error");
      setErrorMsg("Não foi possível salvar seus dados. Tente novamente.");
    } finally {
      setStatus((s) => (s === "loading" ? "idle" : s));
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
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#111] p-6 sm:p-8 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
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
              autoComplete="tel"
              placeholder="(11) 99999-9999"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
