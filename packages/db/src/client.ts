import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { getSupabaseUrl, requireSupabasePublicEnv } from "./env";

export function createBrowserSupabase() {
  const { url, anonKey } = requireSupabasePublicEnv();
  return createBrowserClient<Database>(url, anonKey);
}

export async function createServerSupabase(cookieStore: {
  getAll: () => { name: string; value: string }[];
  set: (name: string, value: string, options?: Record<string, unknown>) => void;
  remove: (name: string, options?: Record<string, unknown>) => void;
}) {
  const { url, anonKey } = requireSupabasePublicEnv();
  return createServerClient<Database, "public">(
    url,
    anonKey,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (
          cookiesToSet: {
            name: string;
            value: string;
            options?: Record<string, unknown>;
          }[],
        ) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    },
  );
}

function getServiceRoleKey(): string {
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.SUPABASE_SECRET_KEY?.trim();
  if (!key) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY (ou SUPABASE_SECRET_KEY / sb_secret_...).",
    );
  }
  return key;
}

function assertServiceRoleKey(key: string): void {
  if (key.startsWith("sb_secret_")) return;
  try {
    const payloadPart = key.split(".")[1];
    if (!payloadPart) return;
    const json = Buffer.from(payloadPart, "base64url").toString("utf8");
    const payload = JSON.parse(json) as { role?: string };
    if (payload.role !== "service_role") {
      throw new Error(
        "SUPABASE_SERVICE_ROLE_KEY está com a chave anon/public. No Supabase: Settings → API → secret key ou service_role (legacy).",
      );
    }
  } catch (e) {
    if (e instanceof Error && e.message.includes("service_role")) throw e;
  }
}

/** Service role — server-only (Route Handlers, privileged actions). */
export function createServiceSupabase() {
  const url = getSupabaseUrl();
  const key = getServiceRoleKey();
  if (!url) {
    throw new Error("Missing Supabase URL (SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_URL)");
  }
  assertServiceRoleKey(key);
  return createClient<Database, "public">(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
