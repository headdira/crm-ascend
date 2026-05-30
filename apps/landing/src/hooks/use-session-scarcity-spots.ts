"use client";

import { useEffect, useState } from "react";

const STORAGE_INITIAL = "ascend_spots_initial";
const STORAGE_CURRENT = "ascend_spots_current";
const MIN_SPOTS = 3;

function readInitialSpots(): number {
  const stored = sessionStorage.getItem(STORAGE_INITIAL);
  if (stored) {
    const parsed = Number.parseInt(stored, 10);
    if (Number.isFinite(parsed) && parsed >= MIN_SPOTS) return parsed;
  }

  const initial = 8 + Math.floor(Math.random() * 8);
  sessionStorage.setItem(STORAGE_INITIAL, String(initial));
  return initial;
}

function readCurrentSpots(initial: number): number {
  const stored = sessionStorage.getItem(STORAGE_CURRENT);
  if (stored) {
    const parsed = Number.parseInt(stored, 10);
    if (Number.isFinite(parsed) && parsed >= MIN_SPOTS) {
      return Math.min(parsed, initial);
    }
  }
  return initial;
}

function spotsForScroll(initial: number): number {
  const scrollTop = window.scrollY;
  const maxScroll = Math.max(
    document.documentElement.scrollHeight - window.innerHeight,
    1,
  );
  const progress = Math.min(1, scrollTop / maxScroll);
  const maxLoss = initial - MIN_SPOTS;
  const lost = Math.floor(maxLoss * progress ** 0.85);
  return Math.max(MIN_SPOTS, initial - lost);
}

export function useSessionScarcitySpots(): number | null {
  const [spots, setSpots] = useState<number | null>(null);

  useEffect(() => {
    const initial = readInitialSpots();
    let lowest = readCurrentSpots(initial);

    const update = () => {
      const calculated = spotsForScroll(initial);
      lowest = Math.min(lowest, calculated);
      sessionStorage.setItem(STORAGE_CURRENT, String(lowest));
      setSpots(lowest);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return spots;
}
