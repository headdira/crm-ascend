"use server";

import {
  ADS_QUIZ_SLUG,
  adsQuizConfigSchema,
  DEFAULT_ADS_QUIZ_CONFIG,
  mergeAdsQuizConfigDefaults,
  parseAdsQuizConfig,
  type AdsQuizConfig,
} from "@crm-ascend/validation";
import type { Json } from "@crm-ascend/db";
import { revalidatePath } from "next/cache";
import { ActionError } from "@/lib/errors";
import { requireStaff } from "@/lib/auth";
import { getSupabaseServer } from "@/lib/supabase/server";

export type AdsQuizFormRecord = {
  id: string;
  slug: string;
  name: string;
  is_active: boolean;
  schema: AdsQuizConfig;
};

export async function getAdsQuizForm(): Promise<AdsQuizFormRecord> {
  await requireStaff();
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase
    .from("form_definitions")
    .select("id, slug, name, schema, is_active")
    .eq("slug", ADS_QUIZ_SLUG)
    .maybeSingle();

  if (error) throw new ActionError(error.message, "DB_ERROR");

  if (!data) {
    return {
      id: "",
      slug: ADS_QUIZ_SLUG,
      name: "Quiz anúncios (Ascend Club)",
      is_active: true,
      schema: DEFAULT_ADS_QUIZ_CONFIG,
    };
  }

  const parsed = parseAdsQuizConfig(data.schema);
  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    is_active: data.is_active,
    schema: parsed.success ? parsed.data : DEFAULT_ADS_QUIZ_CONFIG,
  };
}

export async function saveAdsQuizForm(input: {
  name: string;
  is_active: boolean;
  schema: unknown;
}) {
  await requireStaff();
  const schema = adsQuizConfigSchema.parse(mergeAdsQuizConfigDefaults(input.schema));
  const supabase = await getSupabaseServer();

  const { data: existing } = await supabase
    .from("form_definitions")
    .select("id")
    .eq("slug", ADS_QUIZ_SLUG)
    .maybeSingle();

  const row = {
    slug: ADS_QUIZ_SLUG,
    name: input.name.trim() || "Quiz anúncios (Ascend Club)",
    is_active: input.is_active,
    schema: schema as unknown as Json,
  };

  if (existing?.id) {
    const { error } = await supabase.from("form_definitions").update(row).eq("id", existing.id);
    if (error) throw new ActionError(error.message, "DB_ERROR");
  } else {
    const { error } = await supabase.from("form_definitions").insert(row);
    if (error) throw new ActionError(error.message, "DB_ERROR");
  }

  revalidatePath("/crm/forms");
}
