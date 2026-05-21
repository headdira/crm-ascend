"use client";

import { useEffect, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  idleMs?: number;
};

/** Adia hydration de efeitos não críticos (estrelas, cookies). */
export default function DeferredClient({ children, idleMs = 1200 }: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const run = () => setReady(true);
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(run, { timeout: idleMs });
      return () => cancelIdleCallback(id);
    }
    const t = setTimeout(run, idleMs);
    return () => clearTimeout(t);
  }, [idleMs]);

  return ready ? children : null;
}
