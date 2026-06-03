import { createHash } from "node:crypto";

export function getHashSalt(): string {
  const salt = process.env.HASH_SALT;
  if (!salt) throw new Error("HASH_SALT is not configured");
  return salt;
}

export function getBuilderApiKey(): string {
  const key = process.env.BUILDER_API_KEY;
  if (!key) throw new Error("BUILDER_API_KEY is not configured");
  return key;
}

export function assertBuilderKey(header: string | null): boolean {
  if (!header) return false;
  return header === getBuilderApiKey();
}

export function getKiwifyClientId(): string {
  const id = process.env.KIWIFY_CLIENT_ID;
  if (!id) throw new Error("KIWIFY_CLIENT_ID is not configured");
  return id;
}

export function getKiwifyClientSecret(): string {
  const secret = process.env.KIWIFY_CLIENT_SECRET;
  if (!secret) throw new Error("KIWIFY_CLIENT_SECRET is not configured");
  return secret;
}

export function getKiwifyAccountId(): string {
  const id = process.env.KIWIFY_ACCOUNT_ID;
  if (!id) throw new Error("KIWIFY_ACCOUNT_ID is not configured");
  return id;
}

export function getKiwifyAccessTokenFromEnv(): string | null {
  return process.env.KIWIFY_ACCESS_TOKEN?.trim() || null;
}

export function getKiwifyWebhookToken(): string {
  const explicit = process.env.KIWIFY_WEBHOOK_TOKEN?.trim();
  if (explicit) return explicit;
  return createHash("sha256")
    .update(`kiwify-webhook:${getKiwifyClientSecret()}`)
    .digest("hex")
    .slice(0, 32);
}
