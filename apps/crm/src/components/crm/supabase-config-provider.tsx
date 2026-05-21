"use client";

import { createContext, useContext, type ReactNode } from "react";

type Config = { url: string; anonKey: string };

const SupabaseConfigContext = createContext<Config | null>(null);

export function SupabaseConfigProvider({
  url,
  anonKey,
  children,
}: Config & { children: ReactNode }) {
  return (
    <SupabaseConfigContext.Provider value={{ url, anonKey }}>
      {children}
    </SupabaseConfigContext.Provider>
  );
}

export function useSupabaseConfig(): Config {
  const ctx = useContext(SupabaseConfigContext);
  if (!ctx?.url || !ctx.anonKey) {
    throw new Error("Supabase config missing — check Vercel env");
  }
  return ctx;
}
