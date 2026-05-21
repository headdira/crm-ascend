import { NextResponse } from "next/server";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

/** Diagnóstico de env (sem expor secrets). Acesse /api/health no deploy. */
export async function GET() {
  const pub = getSupabasePublicEnv();
  return NextResponse.json({
    ok: pub.ok && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    supabase: {
      url: Boolean(pub.url),
      anon: Boolean(pub.anonKey),
      fromRuntimeVars: Boolean(
        process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY,
      ),
      fromPublicVars: Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      ),
    },
    serviceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    hashSalt: Boolean(process.env.HASH_SALT),
    hint: pub.ok
      ? "Env OK — se login falhar, confira usuário no Supabase Auth e staff_users."
      : "Faltam URL/anon. No Vercel (ascend-crm) adicione SUPABASE_URL + SUPABASE_ANON_KEY (mesmos valores do dashboard) ou redeploy após NEXT_PUBLIC_*.",
  });
}
