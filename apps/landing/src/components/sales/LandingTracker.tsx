"use client";

import { useEffect } from "react";
import { ensureLandingSession, trackEvent } from "@/lib/sales/track-client";

const SECTIONS: { id: string; label: string }[] = [
  { id: "beneficios", label: "Benefícios" },
  { id: "gamificacao", label: "Gamificação" },
  { id: "mentores", label: "Mentores" },
  { id: "depoimentos", label: "Depoimentos" },
  { id: "objecoes", label: "Objeções" },
  { id: "preco", label: "Preço" },
  { id: "rodape", label: "Rodapé / footer" },
];

export default function LandingTracker() {
  useEffect(() => {
    void ensureLandingSession().then(() => {
      trackEvent("PageView", { title: document.title });
    });

    const seen = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          if (!id || seen.has(id)) continue;
          const meta = SECTIONS.find((s) => s.id === id);
          if (!meta) continue;
          seen.add(id);
          trackEvent("section_view", { section: id, section_label: meta.label });
        }
      },
      { threshold: 0.35 },
    );

    for (const { id } of SECTIONS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return null;
}
