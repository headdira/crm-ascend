/** URL/anon para middleware (Edge): vars sem NEXT_PUBLIC valem na hora na Vercel. */
export function getSupabasePublicEnv() {
  const url =
    process.env.SUPABASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    "";
  const anonKey =
    process.env.SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    "";
  return { url, anonKey, ok: Boolean(url && anonKey) };
}
