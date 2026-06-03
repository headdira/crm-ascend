import { createServiceSupabase } from "@crm-ascend/db";
import { revalidatePath } from "next/cache";
import { isBuilderNiche } from "@/lib/builder-niche";
import {
  MAX_BUILDER_BULK_BATCH,
  uploadBuilderImageFile,
  validateBuilderImageFile,
  type UploadedBuilderAsset,
} from "@/lib/builder-upload";
import { getSupabaseServer } from "@/lib/supabase/server";

export type BuilderUploadResult = {
  created: UploadedBuilderAsset[];
  failed: Array<{ name: string; error: string }>;
};

async function nextSortOrder(
  assetType: "logo" | "banner",
  niche: UploadedBuilderAsset["niche"],
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

export async function processBuilderAssetUpload(
  formData: FormData,
): Promise<{ ok: true; data: BuilderUploadResult } | { ok: false; error: string; status: number }> {
  const assetType = formData.get("asset_type");
  const niche = formData.get("niche");

  if (assetType !== "logo" && assetType !== "banner") {
    return { ok: false, error: "Tipo inválido (logo ou banner)", status: 400 };
  }
  if (typeof niche !== "string" || !isBuilderNiche(niche)) {
    return { ok: false, error: "Selecione um nicho válido", status: 400 };
  }

  const single = formData.get("file");
  const many = formData.getAll("files").filter((f): f is File => f instanceof File);
  const files: File[] =
    many.length > 0
      ? many
      : single instanceof File
        ? [single]
        : [];

  if (files.length === 0) {
    return { ok: false, error: "Nenhuma imagem enviada", status: 400 };
  }
  if (files.length > MAX_BUILDER_BULK_BATCH) {
    return {
      ok: false,
      error: `Envie no máximo ${MAX_BUILDER_BULK_BATCH} arquivo por vez`,
      status: 400,
    };
  }

  const storage = createServiceSupabase();
  const db = await getSupabaseServer();
  const baseSort = await nextSortOrder(assetType, niche, 0);
  const runId = Date.now();

  const created: UploadedBuilderAsset[] = [];
  const failed: BuilderUploadResult["failed"] = [];

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
  return { ok: true, data: { created, failed } };
}
