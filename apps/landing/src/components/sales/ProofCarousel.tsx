"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import LightImageGallery from "./LightImageGallery";

const proofImages = [
  "https://media.base44.com/images/public/69f23854d0500399d6881fb0/3b767c484_WhatsAppImage2026-04-07at1736091.jpeg",
  "https://media.base44.com/images/public/69f23854d0500399d6881fb0/1b4072a11_WhatsAppImage2026-04-07at1736072.jpg",
  "https://media.base44.com/images/public/69f23854d0500399d6881fb0/6505d4f64_WhatsAppImage2026-04-07at173605.jpeg",
  "https://media.base44.com/images/public/69f23854d0500399d6881fb0/e01fb5171_WhatsAppImage2026-04-07at173322.jpeg",
  "https://media.base44.com/images/public/69f23854d0500399d6881fb0/e7406693d_WhatsAppImage2026-04-07at173248.jpeg",
  "https://media.base44.com/images/public/69f23854d0500399d6881fb0/217fb4eca_WhatsAppImage2026-04-07at1732481.jpeg",
  "https://media.base44.com/images/public/69f23854d0500399d6881fb0/f51025a66_WhatsAppImage2026-04-05at221549.jpeg",
  "https://media.base44.com/images/public/69f23854d0500399d6881fb0/c4cb3a1b5_WhatsAppImage2026-04-07at1734081.jpg",
  "https://media.base44.com/images/public/69f23854d0500399d6881fb0/152cafdb7_WhatsAppImage2026-04-07at173409.jpg",
  "https://media.base44.com/images/public/69f23854d0500399d6881fb0/dbced6810_WhatsAppImage2026-04-07at1734082.jpg",
];

const gallerySlides = proofImages.map((src, i) => ({
  src,
  label: `Print de resultado ${i + 1}`,
}));

function useVisibleCount() {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const update = () => setCount(mq.matches ? 3 : 1);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return count;
}

export default function ProofCarousel() {
  const [current, setCurrent] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const visibleCount = useVisibleCount();

  const prev = () => setCurrent((c) => (c - 1 + proofImages.length) % proofImages.length);
  const next = useCallback(
    () => setCurrent((c) => (c + 1) % proofImages.length),
    [],
  );

  useEffect(() => {
    if (lightboxIndex !== null) return;
    const t = setInterval(next, 3500);
    return () => clearInterval(t);
  }, [next, lightboxIndex]);

  const getVisible = () =>
    Array.from({ length: visibleCount }, (_, i) => ({
      src: proofImages[(current + i) % proofImages.length],
      globalIndex: (current + i) % proofImages.length,
    }));

  return (
    <div className="mt-16 max-w-7xl mx-auto px-4 sm:px-6">
      <p className="font-inter text-primary font-bold text-sm tracking-[0.3em] uppercase text-center mb-8">
        Prints reais dos nossos alunos
      </p>
      <div className="relative flex items-center gap-3 sm:gap-5">
        <button
          type="button"
          onClick={prev}
          aria-label="Anterior"
          className="shrink-0 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/40 transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-white/60" />
        </button>

        <div
          className={`flex-1 grid gap-4 sm:gap-5 min-w-0 ${
            visibleCount === 1 ? "grid-cols-1" : "grid-cols-3"
          }`}
        >
          {getVisible().map((item, i) => (
            <motion.button
              key={`${item.globalIndex}-${visibleCount}`}
              type="button"
              onClick={() => setLightboxIndex(item.globalIndex)}
              className="w-full rounded-xl overflow-hidden border border-white/[0.07] aspect-[4/3] min-h-[320px] sm:min-h-[300px] md:min-h-[320px] cursor-zoom-in hover:border-primary/40 transition-colors text-left"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              aria-label={`Ampliar print ${item.globalIndex + 1}`}
            >
              <img
                src={item.src}
                alt={`Prova social ${item.globalIndex + 1}`}
                className="w-full h-full object-cover object-top pointer-events-none"
                loading="lazy"
                decoding="async"
              />
            </motion.button>
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          aria-label="Próximo"
          className="shrink-0 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/40 transition-all"
        >
          <ChevronRight className="w-5 h-5 text-white/60" />
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-5">
        {proofImages.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            aria-label={`Ir para slide ${i + 1}`}
            className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? "bg-primary w-4" : "bg-white/20"}`}
          />
        ))}
      </div>

      <LightImageGallery
        slides={gallerySlides}
        startIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        fit="contain"
      />
    </div>
  );
}
