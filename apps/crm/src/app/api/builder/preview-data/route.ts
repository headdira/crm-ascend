import { createServiceSupabase } from "@crm-ascend/db";
import { recolorSvg } from "@crm-ascend/validation";
import { NextResponse } from "next/server";

/**
 * Dados para prévia local (logo + banners + cores) sem depender da API de tema Nuvemshop.
 */
export async function GET(request: Request) {
  const submissionId = new URL(request.url).searchParams.get("submission_id");
  if (!submissionId) {
    return NextResponse.json({ error: "submission_id required" }, { status: 400 });
  }

  const supabase = createServiceSupabase();
  const { data, error } = await supabase
    .from("builder_submissions")
    .select("id, store_name, payload, theme_assets, provision_status, provision_error")
    .eq("id", submissionId)
    .single();

  if (error || !data?.payload || typeof data.payload !== "object") {
    return NextResponse.json({ error: "Submission não encontrada" }, { status: 404 });
  }

  const payload = data.payload as Record<string, unknown>;
  const primaryColor = String(payload.primaryColor ?? "#d4af37");
  const secondaryColor = String(payload.secondaryColor ?? "#0a0a0a");
  const fontId = String(payload.fontId ?? "montserrat");
  const storeName = String(payload.storeName ?? data.store_name ?? "Sua loja");
  const logoSvg = String(payload.logoSvg ?? "");
  const bannerSvgs = Array.isArray(payload.bannerSvgs)
    ? payload.bannerSvgs.map(String)
    : [];

  const themeAssets = data.theme_assets as
    | { logo?: string; bannersDesktop?: string[]; bannersMobile?: string[] }
    | null;

  const svgToDataUrl = (svg: string) => {
    const colored = recolorSvg(svg, primaryColor, secondaryColor);
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(colored)}`;
  };

  return NextResponse.json({
    submission_id: data.id,
    store_name: storeName,
    primary_color: primaryColor,
    secondary_color: secondaryColor,
    font_id: fontId,
    provision_status: data.provision_status,
    provision_error: data.provision_error,
    logo_url: themeAssets?.logo ?? (logoSvg ? svgToDataUrl(logoSvg) : null),
    banner_urls:
      themeAssets?.bannersDesktop?.length
        ? themeAssets.bannersDesktop
        : bannerSvgs.map(svgToDataUrl),
    note: "Prévia local — não é a vitrine Nuvemshop nem o tema Ipanema publicado.",
  });
}
