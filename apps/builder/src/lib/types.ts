export type BuilderAsset = {
  id: string;
  asset_type: "logo" | "banner";
  name: string;
  niche: string;
  svg_content: string;
  sort_order: number;
};

export type BuilderCatalog = {
  logos: BuilderAsset[];
  banners: BuilderAsset[];
  youtube_embed_url: string | null;
  affiliate_url: string;
};

export type BuilderFormState = {
  verifyTab: "email" | "cpf";
  courseEmail: string;
  cpf: string;
  storeEmail: string;
  /** Ex.: aestheticwrld.lojavirtualnuvem.com.br — OAuth abre o admin da loja */
  storeAdminHost: string;
  oauthSessionId: string;
  nuvemshopStoreId: string;
  /** E-mail e senha para login no admin Nuvemshop (customização manual pelo time). */
  nuvemshopLoginEmail: string;
  nuvemshopLoginPassword: string;
  planWatchedInfo: boolean;
  planWillSubscribe: boolean;
  storeName: string;
  niche: string;
  bannerIds: string[];
  logoSource: "catalog" | "generated";
  logoId: string;
  generatedLogoVariant: string;
  primaryColor: string;
  secondaryColor: string;
  fontId: string;
};

export const STORAGE_KEY = "ascend-builder-v5";

/** Host da loja para /admin/apps/{id}/authorize (tela de permissões no admin). */
export function normalizeStoreAdminHost(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  try {
    const url = /^https?:\/\//i.test(raw) ? new URL(raw) : new URL(`https://${raw}`);
    const host = url.hostname.toLowerCase();
    if (
      !/\.(lojavirtualnuvem\.com\.br|nuvemshop\.com\.br|tiendanube\.com)$/i.test(host) &&
      !host.endsWith(".nuvemshop.com.br")
    ) {
      return null;
    }
    return host;
  } catch {
    return null;
  }
}

export function formForLocalStorage(form: BuilderFormState): BuilderFormState {
  return {
    ...form,
    oauthSessionId: "",
    nuvemshopStoreId: "",
    nuvemshopLoginPassword: "",
  };
}

export function mergeSavedForm(saved: Partial<BuilderFormState> | undefined): BuilderFormState {
  const base = emptyForm();
  if (!saved) return base;
  const {
    oauthSessionId: _o,
    nuvemshopStoreId: _n,
    nuvemshopLoginPassword: _p,
    themeAuthorized: _t,
    ...rest
  } = saved as Partial<BuilderFormState> & { themeAuthorized?: boolean };
  return { ...base, ...rest };
}
export const STEP_LABELS = [
  "Verificação",
  "Conectar Nuvemshop",
  "Acesso ao admin",
  "Plano",
  "Nome da loja",
  "Nicho",
  "Banners e cores",
  "Fontes",
  "Logo",
  "Revisão",
  "Concluído",
] as const;

const PROVISIONER_PRODUCTION = "https://ascend-nuvemshop-provisioner-api.vercel.app";

function isLocalhostUrl(url: string) {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(url);
}

/** Provisioner: na Vercel nunca usa localhost (env de dev costuma vazar no dashboard). */
export function getProvisionerUrl() {
  const fromEnv = (
    process.env.PROVISIONER_URL?.trim() ||
    process.env.NEXT_PUBLIC_PROVISIONER_URL?.trim() ||
    ""
  ).replace(/\/$/, "");

  if (process.env.VERCEL) {
    if (fromEnv && fromEnv.startsWith("https://") && !isLocalhostUrl(fromEnv)) {
      return fromEnv;
    }
    return PROVISIONER_PRODUCTION;
  }

  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_ENV === "production") return PROVISIONER_PRODUCTION;
  return "http://localhost:4010";
}

export function emptyForm(): BuilderFormState {
  return {
    verifyTab: "email",
    courseEmail: "",
    cpf: "",
    storeEmail: "",
    storeAdminHost: "",
    oauthSessionId: "",
    nuvemshopStoreId: "",
    nuvemshopLoginEmail: "",
    nuvemshopLoginPassword: "",
    planWatchedInfo: false,
    planWillSubscribe: false,
    storeName: "",
    niche: "",
    bannerIds: [],
    logoSource: "catalog",
    logoId: "",
    generatedLogoVariant: "",
    primaryColor: "#0a0a0a",
    secondaryColor: "#d4af37",
    fontId: "",
  };
}

const CRM_PRODUCTION = "https://crm-ascend-2c1l.vercel.app";

export function getCrmUrl() {
  const fromEnv =
    process.env.CRM_URL?.trim() ||
    process.env.NEXT_PUBLIC_CRM_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (process.env.VERCEL_ENV === "production") return CRM_PRODUCTION;
  return "http://localhost:3001";
}
