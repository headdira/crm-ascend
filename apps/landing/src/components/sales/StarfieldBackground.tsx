"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLightExperience } from "@/hooks/use-light-experience";

type Star = {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
};

function buildStars(count: number): Star[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    left: ((id * 37 + 13) % 97) + 1.5,
    top: ((id * 53 + 7) % 94) + 3,
    size: id % 4 === 0 ? 2.5 : id % 3 === 0 ? 2 : 1.5,
    delay: (id % 12) * 0.35,
    duration: 2.8 + (id % 7) * 0.55,
    drift: id % 5,
  }));
}

const STARS = buildStars(48);
const HOVER_RADIUS = 110;

export default function StarfieldBackground() {
  const light = useLightExperience();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hotIds, setHotIds] = useState<Set<number>>(new Set());

  const stars = useMemo(() => (light ? STARS.slice(0, 18) : STARS), [light]);

  const updateHot = useCallback(
    (clientX: number, clientY: number) => {
      const el = wrapRef.current;
      if (!el || light) return;

      const rect = el.getBoundingClientRect();
      const mx = clientX - rect.left;
      const my = clientY - rect.top;
      const next = new Set<number>();

      for (const star of stars) {
        const sx = (star.left / 100) * rect.width;
        const sy = (star.top / 100) * rect.height;
        if (Math.hypot(mx - sx, my - sy) < HOVER_RADIUS) next.add(star.id);
      }

      setHotIds((prev) => {
        if (prev.size === next.size && [...prev].every((id) => next.has(id))) return prev;
        return next;
      });
    },
    [stars, light],
  );

  useEffect(() => {
    if (light) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => updateHot(e.clientX, e.clientY));
    };
    const onLeave = () => setHotIds(new Set());

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [light, updateHot]);

  return (
    <div ref={wrapRef} className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {stars.map((star) => (
        <span
          key={star.id}
          className={`sales-star ${light ? "sales-star--static" : `sales-star--drift-${star.drift}`} ${hotIds.has(star.id) ? "sales-star--hot" : ""}`}
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
            animationDelay: light ? undefined : `${star.delay}s`,
            animationDuration: light ? undefined : `${star.duration}s, ${star.duration * 1.4}s`,
          }}
        />
      ))}
    </div>
  );
}
