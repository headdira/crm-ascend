import type { BuilderCatalog } from "./types";
import { getCrmUrl } from "./types";

export async function fetchCatalogFromCrm(): Promise<BuilderCatalog> {
  const res = await fetch(`${getCrmUrl()}/api/builder/catalog`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Não foi possível carregar o catálogo do builder.");
  }
  return res.json();
}

export async function submitToCrm(payload: unknown): Promise<{ submission_id: string }> {
  const res = await fetch(`${getCrmUrl()}/api/builder/catalog`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = body.error;
    if (typeof err === "string") throw new Error(err);
    if (err?.fieldErrors) throw new Error("Dados inválidos. Revise o formulário.");
    throw new Error("Falha ao enviar respostas.");
  }
  return res.json();
}
