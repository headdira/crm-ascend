import { BUILDER_NICHES, BUILDER_RASTER_PREFIX } from "@crm-ascend/validation";
import type { createServiceSupabase } from "@crm-ascend/db";
import type { getSupabaseServer } from "@/lib/supabase/server";
import { sanitizeUploadBasename, nicheStorageSlug } from "@/lib/builder-niche";

export const BUILDER_ASSET_BUCKET = process.env.BUILDER_THEME_BUCKET?.trim() || "builder-theme";
export const MAX_BUILDER_UPLOAD_BYTES = 5 * 1024 * 1024;
export const MAX_BUILDER_BULK_FILES = 40;
/** Arquivos por request de Server Action (evita 413 na Vercel). */
export const MAX_BUILDER_BULK_BATCH = 1;
export const ALLOWED_BUILDER_MIME = new Set(["image/png", "image/jpeg", "image/webp"]);

type Niche = (typeof BUILDER_NICHES)[number];

export type UploadedBuilderAsset = {
  id: string;
  asset_type: "logo" | "banner";
  name: string;
  niche: Niche;
  svg_content: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
type StorageClient = ReturnType<typeof createServiceSupabase>;
type DbClient = Awaited<ReturnType<typeof getSupabaseServer>>;

export function validateBuilderImageFile(file: File): string | null {
  if (file.size === 0) return "Arquivo vazio";
  if (file.size > MAX_BUILDER_UPLOAD_BYTES) return "Máx. 5 MB por arquivo";
  if (!ALLOWED_BUILDER_MIME.has(file.type)) return "Use PNG, JPG ou WebP";
  return null;
}

export async function uploadBuilderImageFile(params: {
  storage: StorageClient;
  db: DbClient;
  assetType: "logo" | "banner";
  niche: Niche;
  file: File;
  sortOrder: number;
  uniqueSuffix: string;
}): Promise<UploadedBuilderAsset> {
  const { storage, db, assetType, niche, file, sortOrder, uniqueSuffix } = params;
  const ext =
    file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const baseName = sanitizeUploadBasename(file.name.replace(/\.[^.]+$/i, ""));
  const slug = nicheStorageSlug(niche);
  const objectPath = `builder-catalog/${slug}/${assetType}/${uniqueSuffix}-${baseName}.${ext}`;

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
  if (uploadErr) throw new Error(uploadErr.message);

  const { data: publicMeta } = storage.storage.from(BUILDER_ASSET_BUCKET).getPublicUrl(objectPath);
  if (!publicMeta.publicUrl) throw new Error("URL pública indisponível");

  const label = assetType === "banner" ? "Banner" : "Logo";
  const name = `${niche} — ${label} ${baseName}`.slice(0, 120);
  const svg_content = `${BUILDER_RASTER_PREFIX}${publicMeta.publicUrl}`;

  const { data, error } = await db
    .from("builder_assets")
    .insert({
      asset_type: assetType,
      name,
      niche,
      svg_content,
      sort_order: sortOrder,
      is_active: true,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as UploadedBuilderAsset;
}
