import { createServiceSupabase } from "@crm-ascend/db";
import {
  ADS_QUIZ_SLUG,
  DEFAULT_ADS_QUIZ_CONFIG,
  normalizeAdsQuizConfig,
  parseAdsQuizConfig,
  type AdsQuizConfig,
} from "@crm-ascend/validation";

export async function loadAdsQuizConfig(): Promise<AdsQuizConfig | null> {
  try {
    const supabase = createServiceSupabase();
    const { data, error } = await supabase
      .from("form_definitions")
      .select("schema, is_active")
      .eq("slug", ADS_QUIZ_SLUG)
      .maybeSingle();

    if (error) {
      console.error("[ads-quiz] load error", error.message);
      return normalizeAdsQuizConfig(DEFAULT_ADS_QUIZ_CONFIG);
    }

    if (!data?.is_active) return null;

    const parsed = parseAdsQuizConfig(data.schema);
    if (!parsed.success) {
      return normalizeAdsQuizConfig(DEFAULT_ADS_QUIZ_CONFIG);
    }

    return normalizeAdsQuizConfig(parsed.data);
  } catch (e) {
    console.error("[ads-quiz] load failed", e);
    return normalizeAdsQuizConfig(DEFAULT_ADS_QUIZ_CONFIG);
  }
}
