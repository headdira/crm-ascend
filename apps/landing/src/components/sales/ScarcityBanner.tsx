"use client";

import { useSessionScarcitySpots } from "@/hooks/use-session-scarcity-spots";

export default function ScarcityBanner() {
  const spots = useSessionScarcitySpots();
  const label =
    spots === 1 ? "RESTA APENAS 1 VAGA DISPONÍVEL PARA ESSA TURMA" : `RESTAM APENAS ${spots ?? "—"} VAGAS DISPONÍVEIS PARA ESSA TURMA`;

  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 z-[100] bg-red-600 border-b border-red-500 shadow-md"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="max-w-7xl mx-auto px-4 py-2 text-center">
          <p className="text-white font-black uppercase tracking-wide text-[11px] sm:text-sm">
            ⚠️ {label}
          </p>
        </div>
      </div>
      <div className="h-9 sm:h-10 shrink-0" aria-hidden />
    </>
  );
}
