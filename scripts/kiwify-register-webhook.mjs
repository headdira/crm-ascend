/**
 * Registra webhook na Kiwify via API.
 *
 * Uso:
 *   KIWIFY_WEBHOOK_URL=https://seu-crm.com/api/webhooks/kiwify \
 *   node scripts/kiwify-register-webhook.mjs
 *
 * Lê credenciais de apps/crm/.env.local
 */

import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../apps/crm/.env.local");
const env = { ...process.env };

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!env[key]) env[key] = value;
  }
}

loadEnvFile(envPath);

function requireEnv(name) {
  const value = env[name];
  if (!value) throw new Error(`${name} não configurado (apps/crm/.env.local)`);
  return value;
}

function webhookToken() {
  if (env.KIWIFY_WEBHOOK_TOKEN) return env.KIWIFY_WEBHOOK_TOKEN;
  const secret = requireEnv("KIWIFY_CLIENT_SECRET");
  return createHash("sha256").update(`kiwify-webhook:${secret}`).digest("hex").slice(0, 32);
}

async function getAccessToken() {
  if (env.KIWIFY_ACCESS_TOKEN) return env.KIWIFY_ACCESS_TOKEN;
  const body = new URLSearchParams({
    client_id: requireEnv("KIWIFY_CLIENT_ID"),
    client_secret: requireEnv("KIWIFY_CLIENT_SECRET"),
  });
  const res = await fetch("https://public-api.kiwify.com/v1/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(JSON.stringify(data));
  return data.access_token;
}

async function main() {
  const token = webhookToken();
  const baseUrl =
    env.KIWIFY_WEBHOOK_URL ??
    (env.NEXT_PUBLIC_APP_URL
      ? `${env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")}/api/webhooks/kiwify`
      : null);

  if (!baseUrl) {
    throw new Error("Defina KIWIFY_WEBHOOK_URL ou NEXT_PUBLIC_APP_URL");
  }

  const url = baseUrl.includes("token=")
    ? baseUrl
    : `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}token=${token}`;

  const accessToken = await getAccessToken();
  const accountId = requireEnv("KIWIFY_ACCOUNT_ID");

  const body = {
    name: "CRM Ascend",
    url,
    products: "all",
    triggers: [
      "compra_aprovada",
      "carrinho_abandonado",
      "pix_gerado",
      "boleto_gerado",
      "compra_recusada",
      "compra_reembolsada",
      "chargeback",
    ],
    token,
  };

  const res = await fetch("https://public-api.kiwify.com/v1/webhooks", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "x-kiwify-account-id": accountId,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  console.log(JSON.stringify({ status: res.status, data, registered_url: url, token }, null, 2));
  if (!res.ok) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
