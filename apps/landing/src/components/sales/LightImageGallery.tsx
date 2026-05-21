"use client";

import { useCallback, useEffect, useState } from "react";

export type GallerySlide = {
  src: string;
  label: string;
};

type Props = {
  slides: GallerySlide[];
  startIndex: number | null;
  onClose: () => void;
  /** Prints de WhatsApp: mostrar inteiro */
  fit?: "contain" | "cover";
};

export default function LightImageGallery({
  slides,
  startIndex,
  onClose,
  fit = "contain",
}: Props) {
  const [index, setIndex] = useState(0);
  const open = startIndex !== null;

  useEffect(() => {
    if (startIndex !== null) setIndex(startIndex);
  }, [startIndex]);

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => (i + delta + slides.length) % slides.length);
    },
    [slides.length],
  );

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, go]);

  if (!open || slides.length === 0) return null;

  const slide = slides[index];
  const imgFit = fit === "contain" ? "object-contain" : "object-cover";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label="Galeria de prints"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 text-white text-xl leading-none hover:bg-white/20"
        aria-label="Fechar"
      >
        ×
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          go(-1);
        }}
        className="absolute left-2 sm:left-6 z-10 w-11 h-11 rounded-full bg-white/10 text-white text-2xl hover:bg-primary/30"
        aria-label="Anterior"
      >
        ‹
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          go(1);
        }}
        className="absolute right-2 sm:right-6 z-10 w-11 h-11 rounded-full bg-white/10 text-white text-2xl hover:bg-primary/30"
        aria-label="Próximo"
      >
        ›
      </button>

      <figure
        className="relative max-w-4xl w-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={slide.src}
          alt={slide.label}
          className={`max-h-[min(85vh,900px)] w-auto max-w-full rounded-lg border border-white/10 ${imgFit} shadow-2xl bg-[#111]`}
          decoding="async"
        />
        <figcaption className="mt-3 font-inter text-xs text-white/50">{slide.label}</figcaption>
        <p className="mt-1 font-inter text-xs text-white/35">
          {index + 1} / {slides.length}
        </p>
      </figure>
    </div>
  );
}
