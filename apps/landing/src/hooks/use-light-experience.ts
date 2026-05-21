"use client";

import { useEffect, useState } from "react";

/** Rede lenta, economia de dados ou menos animação — prioriza fluidez em 3G. */
export function useLightExperience() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    const saveData = conn?.saveData === true;
    const slow =
      conn?.effectiveType != null &&
      ["slow-2g", "2g", "3g"].includes(conn.effectiveType);
    const isLight = reduced || saveData || slow;
    setLight(isLight);
    document.documentElement.toggleAttribute("data-light", isLight);
    return () => document.documentElement.removeAttribute("data-light");
  }, []);

  return light;
}
