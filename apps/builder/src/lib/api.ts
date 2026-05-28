import type { BuilderCatalog } from "./types";
import { getProvisionerUrl } from "./types";

export async function fetchCatalog(): Promise<BuilderCatalog> {
  const res = await fetch("/api/catalog");
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Não foi possível carregar o catálogo.");
  }
  return res.json();
}

export async function submitBuilder(payload: unknown): Promise<{
  submission_id: string;
  provision_job_id?: string | null;
  provision_error?: string | null;
}> {
  const res = await fetch("/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Falha ao enviar respostas.");
  }
  return res.json();
}

export async function fetchOAuthSession(sessionId: string) {
  const res = await fetch(`${getProvisionerUrl()}/oauth/session/${sessionId}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Sessão OAuth inválida");
  }
  return res.json() as Promise<{
    store_id: string;
    theme_authorized?: boolean;
    mock?: boolean;
  }>;
}

export async function fetchThemeAuthStatus(oauthSessionId: string) {
  const res = await fetch(
    `/api/theme-auth-status?oauth_session_id=${encodeURIComponent(oauthSessionId)}`,
    { cache: "no-store" },
  );
  if (!res.ok) return { theme_authorized: false };
  return res.json() as Promise<{ theme_authorized: boolean; store_id: string }>;
}

export async function registerThemeToken(oauthSessionId: string, themeToken: string) {
  const res = await fetch("/api/theme-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ oauth_session_id: oauthSessionId, theme_token: themeToken }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof body.error === "string" ? body.error : "Token de tema inválido",
    );
  }
  return body as { ok: boolean; theme_authorized: boolean };
}

export function themeAuthorizeStartUrl(oauthSessionId: string, returnUrl: string) {
  const u = new URL(`${getProvisionerUrl()}/theme-auth/start`);
  u.searchParams.set("oauth_session_id", oauthSessionId);
  u.searchParams.set("return_url", returnUrl);
  return u.toString();
}

export async function fetchProvisionStatus(submissionId: string) {
  const res = await fetch(
    `/api/provision-status?submission_id=${encodeURIComponent(submissionId)}`,
    { cache: "no-store" },
  );
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Não foi possível consultar o status.");
  }
  return res.json() as Promise<{
    status: string;
    error?: string | null;
    preview_url?: string | null;
  }>;
}
