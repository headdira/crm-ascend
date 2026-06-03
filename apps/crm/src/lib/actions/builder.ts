"use server";

import {
  builderAssetUpsertSchema,
  builderSettingsSchema,
  BUILDER_NICHES,
  BUILDER_RASTER_PREFIX,
} from "@crm-ascend/validation";
import { createServiceSupabase } from "@crm-ascend/db";
import { revalidatePath } from "next/cache";
import { ActionError } from "@/lib/errors";
import { requireStaff } from "@/lib/auth";
import { isBuilderNiche, nicheStorageSlug, sanitizeUploadBasename } from "@/lib/builder-niche";
import { getSupabaseServer } from "@/lib/supabase/server";

const BUILDER_ASSET_BUCKET = process.env.BUILDER_THEME_BUCKET?.trim() || "builder-theme";
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME = new Set(["image/png", "image/jpeg", "image/webp"]);

export type BuilderAsset = {
  id: string;
  asset_type: "logo" | "banner";
  name: string;
  niche: (typeof BUILDER_NICHES)[number];
  svg_content: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type BuilderSettings = {
  id: number;
  youtube_url: string | null;
  affiliate_url: string | null;
  updated_at: string;
};

export type BuilderSubmission = {
  id: string;
  payload: Record<string, unknown>;
  store_name: string | null;
  niche: string | null;
  course_email: string | null;
  store_email: string | null;
  created_at: string;
  provision_status?: string | null;
  store_preview_url?: string | null;
  nuvemshop_store_id?: string | null;
  theme_assets?: Record<string, unknown> | null;
  case_id?: string | null;
};

export async function listBuilderAssets(type?: "logo" | "banner") {
  const supabase = await getSupabaseServer();
  let query = supabase.from("builder_assets").select("*").order("sort_order").order("name");
  if (type) query = query.eq("asset_type", type);
  const { data, error } = await query;
  if (error) throw new ActionError(error.message, "DB_ERROR");
  return (data ?? []) as BuilderAsset[];
}

export async function upsertBuilderAsset(input: unknown) {
  await requireStaff();
  const parsed = builderAssetUpsertSchema.parse(input);
  const supabase = await getSupabaseServer();
  const { id, ...payload } = parsed;
  const row = {
    ...payload,
    updated_at: new Date().toISOString(),
  };

  if (id) {
    const { data, error } = await supabase
      .from("builder_assets")
      .update(row)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new ActionError(error.message, "DB_ERROR");
    revalidatePath("/crm/builder");
    return data;
  }

  const { data, error } = await supabase.from("builder_assets").insert(row).select().single();
  if (error) throw new ActionError(error.message, "DB_ERROR");
  revalidatePath("/crm/builder");
  return data;
}

/** Upload rápido: nicho + arquivo → Storage + registro no catálogo. */
export async function uploadBuilderAsset(formData: FormData) {
  await requireStaff();

  const assetType = formData.get("asset_type");
  const niche = formData.get("niche");
  const file = formData.get("file");

  if (assetType !== "logo" && assetType !== "banner") {
    throw new ActionError("Tipo inválido (logo ou banner)", "VALIDATION");
  }
  if (typeof niche !== "string" || !isBuilderNiche(niche)) {
    throw new ActionError("Selecione um nicho válido", "VALIDATION");
  }
  if (!(file instanceof File) || file.size === 0) {
    throw new ActionError("Selecione uma imagem (PNG, JPG ou WebP)", "VALIDATION");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new ActionError("Arquivo muito grande (máx. 5 MB)", "VALIDATION");
  }
  if (!ALLOWED_MIME.has(file.type)) {
    throw new ActionError("Formato inválido. Use PNG, JPG ou WebP.", "VALIDATION");
  }

  const ext =
    file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const baseName = sanitizeUploadBasename(file.name.replace(/\.[^.]+$/i, ""));
  const slug = nicheStorageSlug(niche);
  const objectPath = `builder-catalog/${slug}/${assetType}/${Date.now()}-${baseName}.${ext}`;

  const storage = createServiceSupabase();
  const bytes = Buffer.from(await file.arrayBuffer());
  const { error: uploadErr } = await storage.storage.from(BUILDER_ASSET_BUCKET).upload(
    objectPath,
    bytes,
    {
      contentType: file.type,
      upsert: false,
      cacheControl: "31536000",
    },
  );
  if (uploadErr) {
    throw new ActionError(`Falha no upload: ${uploadErr.message}`, "STORAGE");
  }

  const { data: publicMeta } = storage.storage.from(BUILDER_ASSET_BUCKET).getPublicUrl(objectPath);
  if (!publicMeta.publicUrl) {
    throw new ActionError("URL pública indisponível após upload", "STORAGE");
  }

  const supabase = await getSupabaseServer();
  const { data: last } = await supabase
    .from("builder_assets")
    .select("sort_order")
    .eq("asset_type", assetType)
    .eq("niche", niche)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const sort_order = (last?.sort_order ?? 0) + 1;
  const label = assetType === "banner" ? "Banner" : "Logo";
  const name = `${niche} — ${label} ${baseName}`.slice(0, 120);
  const svg_content = `${BUILDER_RASTER_PREFIX}${publicMeta.publicUrl}`;

  const { data, error } = await supabase
    .from("builder_assets")
    .insert({
      asset_type: assetType,
      name,
      niche,
      svg_content,
      sort_order,
      is_active: true,
    })
    .select()
    .single();

  if (error) throw new ActionError(error.message, "DB_ERROR");
  revalidatePath("/crm/builder");
  return data as BuilderAsset;
}

export async function deleteBuilderAsset(id: string) {
  await requireStaff();
  const supabase = await getSupabaseServer();
  const { error } = await supabase.from("builder_assets").delete().eq("id", id);
  if (error) throw new ActionError(error.message, "DB_ERROR");
  revalidatePath("/crm/builder");
}

export async function getBuilderSettings() {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase.from("builder_settings").select("*").eq("id", 1).single();
  if (error) throw new ActionError(error.message, "DB_ERROR");
  return data as BuilderSettings;
}

export async function updateBuilderSettings(input: unknown) {
  await requireStaff();
  const parsed = builderSettingsSchema.parse(input);
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("builder_settings")
    .update({
      youtube_url: parsed.youtube_url || null,
      affiliate_url: parsed.affiliate_url || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1)
    .select()
    .single();
  if (error) throw new ActionError(error.message, "DB_ERROR");
  revalidatePath("/crm/builder");
  return data;
}

export async function listBuilderSubmissions() {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("builder_submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw new ActionError(error.message, "DB_ERROR");
  return (data ?? []) as BuilderSubmission[];
}

export async function getBuilderSubmission(id: string) {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("builder_submissions")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new ActionError(error.message, "DB_ERROR");
  return data as BuilderSubmission;
}
