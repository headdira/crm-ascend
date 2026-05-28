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
  oauthSessionId: string;
  nuvemshopStoreId: string;
  themeAuthorized: boolean;
  planWatchedInfo: boolean;
  planWillSubscribe: boolean;
  storeName: string;
  niche: string;
  bannerIds: string[];
  logoId: string;
  primaryColor: string;
  secondaryColor: string;
  fontId: string;
};

export const STORAGE_KEY = "ascend-builder-v2";

export function formForLocalStorage(form: BuilderFormState): BuilderFormState {
  return {
    ...form,
    oauthSessionId: "",
    nuvemshopStoreId: "",
    themeAuthorized: false,
  };
}

export function mergeSavedForm(saved: Partial<BuilderFormState> | undefined): BuilderFormState {
  const base = emptyForm();
  if (!saved) return base;
  const { oauthSessionId: _o, nuvemshopStoreId: _n, themeAuthorized: _t, ...rest } = saved;
  return { ...base, ...rest };
}
export const STEP_LABELS = [
  "Verificação",
  "Conectar Nuvemshop",
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
    oauthSessionId: "",
    nuvemshopStoreId: "",
    themeAuthorized: false,
    planWatchedInfo: false,
    planWillSubscribe: false,
    storeName: "",
    niche: "",
    bannerIds: [],
    logoId: "",
    primaryColor: "#d4af37",
    secondaryColor: "#0a0a0a",
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
