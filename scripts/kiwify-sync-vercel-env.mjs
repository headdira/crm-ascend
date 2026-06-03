#!/usr/bin/env node
/**
 * Envia variáveis Kiwify para a Vercel via CLI (requer `vercel login`).
 *
 *   node scripts/kiwify-sync-vercel-env.mjs
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../apps/crm/vercel-env.import.env");

if (!existsSync(envPath)) {
  console.error("Arquivo não encontrado:", envPath);
  process.exit(1);
}

const vars = {};
for (const line of readFileSync(envPath, "utf8").split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eq = trimmed.indexOf("=");
  if (eq === -1) continue;
  vars[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
}

const kiwifyKeys = [
  "KIWIFY_CLIENT_ID",
  "KIWIFY_CLIENT_SECRET",
  "KIWIFY_ACCOUNT_ID",
  "KIWIFY_WEBHOOK_URL",
];

const missing = kiwifyKeys.filter((k) => !vars[k]);
if (missing.length) {
  console.error("Faltam no vercel-env.import.env:", missing.join(", "));
  process.exit(1);
}

const cwd = resolve(__dirname, "../apps/crm");
const targets = ["production", "preview", "development"];

for (const key of kiwifyKeys) {
  for (const target of targets) {
    console.log(`Setting ${key} (${target})...`);
    const result = spawnSync(
      "npx",
      ["vercel", "env", "add", key, target, "--force"],
      {
        cwd,
        input: vars[key],
        encoding: "utf8",
        stdio: ["pipe", "inherit", "inherit"],
      },
    );
    if (result.status !== 0) {
      console.error(`Falhou: ${key} ${target}. Rode vercel login e vercel link --cwd apps/crm`);
      process.exit(result.status ?? 1);
    }
  }
}

console.log("OK. Redeploy: npx vercel --prod --cwd apps/crm");
