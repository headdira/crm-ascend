import { BUILDER_NICHES } from "@crm-ascend/validation";

/** Slug estável para paths no Storage (pet, casa-e-praticidade, …). */
export function nicheStorageSlug(niche: string): string {
  return niche
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isBuilderNiche(value: string): value is (typeof BUILDER_NICHES)[number] {
  return (BUILDER_NICHES as readonly string[]).includes(value);
}

export function sanitizeUploadBasename(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || "arquivo";
}
