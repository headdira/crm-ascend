"use server";

import {
  builderAssetUpsertSchema,
  builderSettingsSchema,
  BUILDER_NICHES,
} from "@crm-ascend/validation";
import { createServiceSupabase } from "@crm-ascend/db";
import { revalidatePath } from "next/cache";
import { ActionError } from "@/lib/errors";
import { requireStaff } from "@/lib/auth";
import { isBuilderNiche } from "@/lib/builder-niche";
import { uploadBuilderImageFile, validateBuilderImageFile } from "@/lib/builder-upload";
import { getSupabaseServer } from "@/lib/supabase/server";

export type BulkUploadResult = {
  created: BuilderAsset[];
  failed: Array<{ name: string; error: string }>;
};

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

async function nextSortOrder(
  assetType: "logo" | "banner",
  niche: BuilderAsset["niche"],
  offset: number,
) {
  const supabase = await getSupabaseServer();
  const { data: last } = await supabase
    .from("builder_assets")
    .select("sort_order")
    .eq("asset_type", assetType)
    .eq("niche", niche)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (last?.sort_order ?? 0) + 1 + offset;
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
  if (!(file instanceof File)) {
    throw new ActionError("Selecione uma imagem (PNG, JPG ou WebP)", "VALIDATION");
  }
  const fileErr = validateBuilderImageFile(file);
  if (fileErr) throw new ActionError(fileErr, "VALIDATION");

  const storage = createServiceSupabase();
  const db = await getSupabaseServer();
  const sortOrder = await nextSortOrder(assetType, niche, 0);

  try {
    const data = await uploadBuilderImageFile({
      storage,
      db,
      assetType,
      niche,
      file,
      sortOrder,
      uniqueSuffix: String(Date.now()),
    });
    revalidatePath("/crm/builder");
    return data;
  } catch (e) {
    throw new ActionError(e instanceof Error ? e.message : "Falha no upload", "STORAGE");
  }
}

/** Upload em massa: vários arquivos no mesmo nicho (lote de até 8 por request). */
export async function uploadBuilderAssetsBulk(formData: FormData): Promise<BulkUploadResult> {
  await requireStaff();

  const assetType = formData.get("asset_type");
  const niche = formData.get("niche");
  const files = formData.getAll("files").filter((f): f is File => f instanceof File);

  if (assetType !== "logo" && assetType !== "banner") {
    throw new ActionError("Tipo inválido", "VALIDATION");
  }
  if (typeof niche !== "string" || !isBuilderNiche(niche)) {
    throw new ActionError("Selecione um nicho válido", "VALIDATION");
  }
  if (files.length === 0) {
    throw new ActionError("Nenhum arquivo recebido", "VALIDATION");
  }
  if (files.length > 8) {
    throw new ActionError("Máximo 8 arquivos por envio (repita para lotes maiores)", "VALIDATION");
  }

  const storage = createServiceSupabase();
  const db = await getSupabaseServer();
  const baseSort = await nextSortOrder(assetType, niche, 0);
  const runId = Date.now();

  const created: BuilderAsset[] = [];
  const failed: BulkUploadResult["failed"] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i]!;
    const validation = validateBuilderImageFile(file);
    if (validation) {
      failed.push({ name: file.name, error: validation });
      continue;
    }
    try {
      const row = await uploadBuilderImageFile({
        storage,
        db,
        assetType,
        niche,
        file,
        sortOrder: baseSort + i,
        uniqueSuffix: `${runId}-${i}`,
      });
      created.push(row);
    } catch (e) {
      failed.push({
        name: file.name,
        error: e instanceof Error ? e.message : "Erro no upload",
      });
    }
  }

  if (created.length > 0) revalidatePath("/crm/builder");
  return { created, failed };
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
    .limit(80);
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
