import {
  getKiwifyAccessTokenFromEnv,
  getKiwifyAccountId,
  getKiwifyClientId,
  getKiwifyClientSecret,
} from "@/lib/env";
import { KIWIFY_API_BASE } from "@/lib/kiwify/types";

type TokenCache = {
  accessToken: string;
  expiresAtMs: number;
};

let tokenCache: TokenCache | null = null;

export async function getKiwifyAccessToken(): Promise<string> {
  const fromEnv = getKiwifyAccessTokenFromEnv();
  if (fromEnv) return fromEnv;

  if (tokenCache && tokenCache.expiresAtMs > Date.now() + 60_000) {
    return tokenCache.accessToken;
  }

  const body = new URLSearchParams({
    client_id: getKiwifyClientId(),
    client_secret: getKiwifyClientSecret(),
  });

  const res = await fetch(`${KIWIFY_API_BASE}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = (await res.json()) as {
    access_token?: string;
    expires_in?: string | number;
    error?: string;
    message?: string;
  };

  if (!res.ok || !data.access_token) {
    throw new Error(data.message ?? data.error ?? `Kiwify OAuth failed (${res.status})`);
  }

  const expiresInSec = Number(data.expires_in ?? 86_400);
  tokenCache = {
    accessToken: data.access_token,
    expiresAtMs: Date.now() + expiresInSec * 1000,
  };

  return data.access_token;
}

export async function kiwifyFetch<T>(
  path: string,
  init?: RequestInit & { query?: Record<string, string | undefined> },
): Promise<T> {
  const token = await getKiwifyAccessToken();
  const url = new URL(`${KIWIFY_API_BASE}${path}`);
  if (init?.query) {
    for (const [key, value] of Object.entries(init.query)) {
      if (value != null && value !== "") url.searchParams.set(key, value);
    }
  }

  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "x-kiwify-account-id": getKiwifyAccountId(),
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (res.status === 429) {
    throw new Error("Kiwify rate limit (429)");
  }

  const text = await res.text();
  const data = text ? (JSON.parse(text) as T) : ({} as T);

  if (!res.ok) {
    const err = data as { message?: string; error?: string };
    throw new Error(err.message ?? err.error ?? `Kiwify API ${res.status}`);
  }

  return data;
}
