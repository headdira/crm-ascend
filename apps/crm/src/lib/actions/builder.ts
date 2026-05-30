"use server";

import {
  builderAssetUpsertSchema,
  builderSettingsSchema,
  BUILDER_NICHES,
} from "@crm-ascend/validation";
import { revalidatePath } from "next/cache";
import { ActionError } from "@/lib/errors";
import { requireStaff } from "@/lib/auth";
import { getSupabaseServer } from "@/lib/supabase/server";

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
