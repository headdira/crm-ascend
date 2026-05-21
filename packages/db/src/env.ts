/** URL/anon: SUPABASE_* (runtime na Vercel) ou NEXT_PUBLIC_* (build). */
export function getSupabaseUrl(): string {
  return (
    process.env.SUPABASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    ""
  );
}

export function getSupabaseAnonKey(): string {
  return (
    process.env.SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    ""
  );
}

export function getSupabasePublicEnv() {
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();
  return { url, anonKey, ok: Boolean(url && anonKey) };
}

export function requireSupabasePublicEnv() {
  const env = getSupabasePublicEnv();
  if (!env.ok) {
    throw new Error(
      "Missing Supabase URL or anon key. Set SUPABASE_URL and SUPABASE_ANON_KEY (or NEXT_PUBLIC_*) on Vercel.",
    );
  }
  return env;
}
