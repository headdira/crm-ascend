import { createServiceSupabase } from "@crm-ascend/db";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

/**
 * Config JSON consumido pelo script NubeSDK na vitrine (query_params.configUrl).
 */
export async function GET(request: Request) {
  const submissionId = new URL(request.url).searchParams.get("submission_id");
  if (!submissionId) {
    return NextResponse.json({ error: "submission_id required" }, { status: 400, headers: corsHeaders });
  }

  const supabase = createServiceSupabase();
  const { data, error } = await supabase
    .from("builder_submissions")
    .select("store_name, payload, theme_assets")
    .eq("id", submissionId)
    .single();

  if (error || !data?.payload || typeof data.payload !== "object") {
    return NextResponse.json({ error: "Submission não encontrada" }, { status: 404, headers: corsHeaders });
  }

  const payload = data.payload as Record<string, unknown>;
  const themeAssets = data.theme_assets as
    | { logo?: string; bannersDesktop?: string[]; bannersMobile?: string[] }
    | null;

  if (!themeAssets?.logo || !themeAssets.bannersDesktop?.length) {
    return NextResponse.json(
      { error: "Assets de vitrine ainda não publicados para esta submission" },
      { status: 404, headers: corsHeaders },
    );
  }

  return NextResponse.json(
    {
      storeName: String(payload.storeName ?? data.store_name ?? "Sua loja"),
      primaryColor: String(payload.primaryColor ?? "#d4af37"),
      secondaryColor: String(payload.secondaryColor ?? "#0a0a0a"),
      logo: themeAssets.logo,
      bannersDesktop: themeAssets.bannersDesktop,
      bannersMobile: themeAssets.bannersMobile ?? themeAssets.bannersDesktop,
    },
    { headers: corsHeaders },
  );
}
