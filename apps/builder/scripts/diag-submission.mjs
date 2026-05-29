#!/usr/bin/env node
/**
 * diag-submission.mjs — diagnostica por que uma submission ficou em "pending".
 *
 * Lê SUPABASE_URL/SERVICE_ROLE_KEY de apps/builder/.env.local (fallback crm).
 *
 * Uso:
 *   node scripts/diag-submission.mjs                # lista as 5 mais recentes
 *   node scripts/diag-submission.mjs --id <UUID>    # detalha 1 + sessão OAuth
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";

async function loadEnv(file) {
  try {
    const raw = await readFile(file, "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
      if (!m) continue;
      const [, k, vRaw] = m;
      if (process.env[k]) continue;
      let v = vRaw.trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      process.env[k] = v;
    }
  } catch {
    /* ignore */
  }
}

function mask(s, keep = 6) {
  if (!s) return "—";
  if (s.length <= keep * 2) return `${s.slice(0, 4)}…`;
  return `${s.slice(0, keep)}…${s.slice(-3)} (len ${s.length})`;
}

async function sb(url, key, q) {
  const res = await fetch(`${url}/rest/v1/${q}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

async function main() {
  const { values } = parseArgs({
    options: { id: { type: "string" } },
    strict: false,
    allowPositionals: false,
  });

  const repoRoot = path.resolve(new URL(".", import.meta.url).pathname, "..", "..", "..");
  await loadEnv(path.join(repoRoot, "apps/builder/.env.local"));
  await loadEnv(path.join(repoRoot, "apps/crm/.env.local"));

  const supaUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supaKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supaUrl || !supaKey) {
    console.error("✗ SUPABASE_URL/SERVICE_ROLE_KEY ausentes nos .env.local");
    process.exit(1);
  }
  console.log(`Supabase: ${supaUrl}`);
  console.log(`Service key: ${mask(supaKey, 8)}\n`);

  if (!values.id) {
    console.log("— builder_submissions: 5 mais recentes —");
    const rows = await sb(
      supaUrl,
      supaKey,
      "builder_submissions?select=id,store_name,oauth_session_id,provision_status,provision_error,provision_job_id,nuvemshop_store_id,store_preview_url,created_at&order=created_at.desc&limit=5",
    );
    for (const r of rows) {
      console.log(JSON.stringify({
        id: r.id,
        store: r.store_name,
        oauth_session: r.oauth_session_id,
        status: r.provision_status,
        job_id: r.provision_job_id ?? "—",
        store_id: r.nuvemshop_store_id ?? "—",
        preview: r.store_preview_url ?? "—",
        error: r.provision_error ?? "—",
        created: r.created_at,
      }, null, 2));
    }
    console.log("\nRode com --id <UUID> para ver detalhes + sessão OAuth associada");
    return;
  }

  const subRows = await sb(
    supaUrl,
    supaKey,
    `builder_submissions?select=*&id=eq.${encodeURIComponent(values.id)}`,
  );
  const sub = subRows[0];
  if (!sub) {
    console.error(`✗ submission ${values.id} não encontrada`);
    process.exit(2);
  }

  console.log("— Submission —");
  console.log(JSON.stringify({
    id: sub.id,
    store_name: sub.store_name,
    niche: sub.niche,
    oauth_session_id: sub.oauth_session_id,
    provision_status: sub.provision_status,
    provision_error: sub.provision_error,
    provision_job_id: sub.provision_job_id ?? "—",
    nuvemshop_store_id: sub.nuvemshop_store_id ?? "—",
    store_preview_url: sub.store_preview_url ?? "—",
    has_theme_assets: Boolean(sub.theme_assets),
    created_at: sub.created_at,
  }, null, 2));

  if (!sub.oauth_session_id) {
    console.log("\n⚠ submission sem oauth_session_id (impossível enfileirar job)");
    return;
  }

  const oauthRows = await sb(
    supaUrl,
    supaKey,
    `provisioner_oauth_sessions?select=id,store_id,access_token,theme_cli_token,created_at,mock&id=eq.${encodeURIComponent(sub.oauth_session_id)}`,
  );
  const oauth = oauthRows[0];
  if (!oauth) {
    console.log(`\n✗ oauth_session ${sub.oauth_session_id} NÃO existe no Supabase!`);
    console.log("  → O CRM enfileirou pra um session_id que o provisioner não acha.");
    console.log("  → Provisioner retorna 400 'Sessão OAuth inválida' → catch no catalog/route.ts");
    console.log("  → DEVERIA marcar como 'failed', mas seguiu 'pending' — bug no fluxo.");
    return;
  }

  console.log("\n— OAuth session associada —");
  console.log(JSON.stringify({
    id: oauth.id,
    store_id: oauth.store_id,
    has_access_token: Boolean(oauth.access_token),
    has_theme_cli_token: Boolean(oauth.theme_cli_token),
    created: oauth.created_at,
    mock: oauth.mock,
  }, null, 2));

  console.log("\n— Diagnóstico —");
  if (sub.provision_status === "pending") {
    console.log("✗ Status 'pending' = default do DB → atualização para 'queued' nunca aconteceu");
    console.log("  Hipóteses:");
    console.log("  1. enqueueProvisionerJob() lançou exceção MAS o catch no catalog/route.ts");
    console.log("     falhou ao gravar 'failed' (RPC deu erro) → ficou 'pending'");
    console.log("  2. Resposta do POST /jobs travou (timeout 60s no AbortSignal)");
    console.log("  3. CRM Vercel sem PROVISIONER_API_URL ou PROVISIONER_API_KEY corretos");
    console.log("");
    console.log("  Checa logs Vercel: crm-ascend → Functions → /api/builder/catalog (POST)");
    console.log("  Confirma env CRM: PROVISIONER_API_URL, PROVISIONER_API_KEY");
    console.log("  Confirma env Provisioner: JOBS_API_KEY (mesmo valor)");
  } else if (sub.provision_status === "queued") {
    console.log("⚠ Status 'queued' → job enfileirado mas callback /provision-callback");
    console.log("  nunca atualizou para 'completed'/'failed'.");
    console.log("  Hipóteses:");
    console.log("  1. Job hangou em background (CLI travou) — Vercel deu timeout em maxDuration=300");
    console.log("  2. notifyCrm() falhou (CRM_URL errado ou CRM_WEBHOOK_SECRET diferente)");
    console.log("  3. CRM callback retornou 401 (secret mismatch)");
    console.log("");
    console.log(`  Job ID: ${sub.provision_job_id} — checa logs Vercel provisioner /jobs.mjs`);
  }

  if (!oauth.theme_cli_token) {
    console.log("\n⚠ theme_cli_token VAZIO — CLI Fork não será executado (só Scripts API)");
  }
}

main().catch((e) => {
  console.error(`\n✗ Erro: ${e?.stack ?? e}`);
  process.exit(99);
});
