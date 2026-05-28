#!/usr/bin/env node
/**
 * test-theme-auth.mjs — diagnóstico isolado da auth do CLI de temas.
 *
 * Lê SUPABASE_SERVICE_ROLE_KEY de .env.local (apps/builder ou apps/crm),
 * consulta `provisioner_oauth_sessions` e testa 3 cenários:
 *
 *   A) `theme list` com o `theme_cli_token` (Base64 da página "theme authorize")
 *   B) `theme list` com Base64({store_id, access_token}) construído na hora a
 *      partir do access_token OAuth do app — pra confirmar se ele funciona ou não
 *   C) GET REST direto em /v1/{store_id}/store usando access_token OAuth
 *      (sanity check: o access_token ao menos consegue ler a loja?)
 *
 * Uso:
 *   node scripts/test-theme-auth.mjs                   # lista sessões recentes
 *   node scripts/test-theme-auth.mjs --session <UUID>  # roda os 3 testes
 *   node scripts/test-theme-auth.mjs --store-id 12345  # acha pela store
 */

import { spawn } from "node:child_process";
import { readFile, mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { parseArgs } from "node:util";

function loadEnv(filePath) {
  return readFile(filePath, "utf8")
    .then((raw) => {
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
    })
    .catch(() => {});
}

function mask(s, keep = 6) {
  if (!s) return "—";
  if (s.length <= keep * 2) return `${s.slice(0, 4)}…`;
  return `${s.slice(0, keep)}…${s.slice(-3)} (len ${s.length})`;
}

function log(msg) { console.log(msg); }
function fail(msg) { console.error(`✗ ${msg}`); process.exit(1); }

async function supabaseSelect(url, key, tableQuery) {
  const res = await fetch(`${url}/rest/v1/${tableQuery}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Supabase ${res.status}: ${text.slice(0, 300)}`);
  }
  return res.json();
}

function encodeThemeCliToken(storeId, accessToken) {
  const payload = { store_id: Number(storeId), access_token: accessToken };
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64");
}

function runCli(args, { cwd, token }) {
  const full = ["-y", "@tiendanube/cli", "theme", ...args, "--token", token];
  return new Promise((resolve) => {
    const child = spawn("npx", full, {
      cwd,
      env: { ...process.env, FORCE_COLOR: "0" },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (c) => (stdout += c.toString()));
    child.stderr.on("data", (c) => (stderr += c.toString()));
    child.on("close", (exitCode) => {
      resolve({
        ok: exitCode === 0 && !/error:/i.test(stderr),
        exitCode,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
      });
    });
    child.on("error", (e) =>
      resolve({ ok: false, exitCode: null, stdout, stderr: `${stderr}\n${e.message}` }),
    );
  });
}

async function listSessions(supaUrl, supaKey, limit = 10) {
  const q = `provisioner_oauth_sessions?select=id,store_id,access_token,theme_cli_token,created_at,mock&order=created_at.desc&limit=${limit}`;
  return supabaseSelect(supaUrl, supaKey, q);
}

function summary(s) {
  const hasAccess = s.access_token && s.access_token.length > 0;
  const hasTheme = s.theme_cli_token && s.theme_cli_token.length > 0;
  return {
    id: s.id,
    store_id: s.store_id,
    created: s.created_at,
    mock: s.mock,
    access_token: hasAccess ? `present (${mask(s.access_token)})` : "MISSING",
    theme_cli_token: hasTheme ? `present (${mask(s.theme_cli_token)})` : "MISSING ←",
  };
}

async function main() {
  const { values } = parseArgs({
    options: {
      session: { type: "string" },
      "store-id": { type: "string" },
      env: { type: "string" },
      "skip-cli": { type: "boolean", default: false },
    },
    strict: false,
    allowPositionals: false,
  });

  // Carrega .env.local (builder primeiro, depois crm)
  const repoRoot = path.resolve(new URL(".", import.meta.url).pathname, "..", "..", "..");
  const envFiles = [
    values.env,
    path.join(repoRoot, "apps/builder/.env.local"),
    path.join(repoRoot, "apps/crm/.env.local"),
  ].filter(Boolean);
  for (const f of envFiles) await loadEnv(f);

  const supaUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supaKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supaUrl) fail("SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL não encontrado em .env.local");
  if (!supaKey) fail("SUPABASE_SERVICE_ROLE_KEY não encontrado em .env.local");

  log(`Supabase: ${supaUrl}`);
  log(`Service key: ${mask(supaKey, 8)}`);

  // Sem --session: lista as 10 mais recentes e sai
  if (!values.session && !values["store-id"]) {
    log("\n— Sessões OAuth recentes —");
    const sessions = await listSessions(supaUrl, supaKey, 10);
    if (!sessions.length) {
      log("Nenhuma sessão encontrada em provisioner_oauth_sessions");
      return;
    }
    for (const s of sessions) {
      console.log(JSON.stringify(summary(s), null, 2));
    }
    log("\nRode novamente com --session <UUID> ou --store-id <N> pra testar uma");
    return;
  }

  // Resolve a sessão
  let session;
  if (values.session) {
    const rows = await supabaseSelect(
      supaUrl,
      supaKey,
      `provisioner_oauth_sessions?select=*&id=eq.${encodeURIComponent(values.session)}`,
    );
    session = rows[0];
  } else {
    const rows = await supabaseSelect(
      supaUrl,
      supaKey,
      `provisioner_oauth_sessions?select=*&store_id=eq.${encodeURIComponent(values["store-id"])}&order=created_at.desc&limit=1`,
    );
    session = rows[0];
  }
  if (!session) fail("Sessão não encontrada");

  log("\n— Sessão alvo —");
  console.log(JSON.stringify(summary(session), null, 2));

  const storeId = session.store_id;
  const accessToken = session.access_token;
  const themeCliToken = session.theme_cli_token;

  // C) Sanity REST: GET /v1/{store_id}/store usando access_token OAuth direto
  log("\n— C) REST GET /v1/{store_id}/store com OAuth access_token —");
  if (!accessToken) {
    log("⊘ pulado: access_token vazio");
  } else {
    try {
      const res = await fetch(`https://api.nuvemshop.com.br/v1/${storeId}/store`, {
        headers: {
          Authentication: `bearer ${accessToken}`,
          "User-Agent": "ascend-theme-auth-test (gerson@loovi)",
          Accept: "application/json",
        },
      });
      const txt = await res.text();
      if (res.ok) {
        const j = JSON.parse(txt);
        log(`✓ HTTP ${res.status} — loja: ${JSON.stringify(j.name ?? j)}`);
        log("  → access_token OAuth tem permissão básica de leitura da loja");
      } else {
        log(`✗ HTTP ${res.status} — ${txt.slice(0, 300)}`);
      }
    } catch (e) {
      log(`✗ erro de rede: ${e.message}`);
    }
  }

  // C2) REST GET /v1/{store_id}/themes (se existir) com access_token OAuth
  log("\n— C2) REST GET /v1/{store_id}/themes com OAuth access_token —");
  if (!accessToken) {
    log("⊘ pulado: access_token vazio");
  } else {
    try {
      const res = await fetch(`https://api.nuvemshop.com.br/v1/${storeId}/themes`, {
        headers: {
          Authentication: `bearer ${accessToken}`,
          "User-Agent": "ascend-theme-auth-test (gerson@loovi)",
          Accept: "application/json",
        },
      });
      const txt = await res.text();
      log(`HTTP ${res.status}`);
      log(`body: ${txt.slice(0, 500)}`);
      if (res.ok) log("  → access_token OAuth ALCANÇA endpoint de themes (raro)");
      else log("  → endpoint /themes não responde com OAuth token (esperado)");
    } catch (e) {
      log(`✗ erro de rede: ${e.message}`);
    }
  }

  if (values["skip-cli"]) {
    log("\n— Pulei testes A e B (—skip-cli) —");
    return;
  }

  const workspaceDir = await mkdtemp(path.join(os.tmpdir(), "ascend-theme-test-"));
  try {
    // A) theme list com theme_cli_token oficial
    log("\n— A) `theme list --json` com theme_cli_token (Base64 oficial) —");
    if (!themeCliToken) {
      log("⊘ pulado: theme_cli_token está vazio no DB");
      log("  → A loja NUNCA passou pela página 'theme authorize'.");
      log("  → Sem isso, o CLI não tem como listar/criar temas.");
    } else {
      const r = await runCli(["list", "--json"], { cwd: workspaceDir, token: themeCliToken });
      log(`exit=${r.exitCode} ok=${r.ok}`);
      if (r.stdout) log(`stdout: ${r.stdout.slice(0, 800)}`);
      if (r.stderr) log(`stderr: ${r.stderr.slice(0, 800)}`);
    }

    // B) theme list com Base64 construído do OAuth access_token
    log("\n— B) `theme list --json` com Base64 do OAuth access_token (hipótese atual do código) —");
    if (!accessToken) {
      log("⊘ pulado: access_token vazio");
    } else {
      const constructedToken = encodeThemeCliToken(storeId, accessToken);
      log(`token construído: ${mask(constructedToken, 8)}`);
      const r = await runCli(["list", "--json"], { cwd: workspaceDir, token: constructedToken });
      log(`exit=${r.exitCode} ok=${r.ok}`);
      if (r.stdout) log(`stdout: ${r.stdout.slice(0, 800)}`);
      if (r.stderr) log(`stderr: ${r.stderr.slice(0, 800)}`);
      if (!r.ok) {
        log("  → Confirma: OAuth access_token NÃO funciona pra CLI de temas.");
        log("  → Precisa do theme_cli_token (página 'theme authorize').");
      }
    }
  } finally {
    await rm(workspaceDir, { recursive: true, force: true }).catch(() => {});
  }
}

main().catch((e) => {
  console.error(`\n✗ Erro: ${e?.stack ?? e}`);
  process.exit(99);
});
