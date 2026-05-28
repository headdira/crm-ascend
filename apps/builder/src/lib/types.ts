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

export function getProvisionerUrl() {
  return process.env.NEXT_PUBLIC_PROVISIONER_URL ?? process.env.PROVISIONER_URL ?? "http://localhost:4010";
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

export function getCrmUrl() {
  return process.env.CRM_URL ?? process.env.NEXT_PUBLIC_CRM_URL ?? "http://localhost:3001";
}
