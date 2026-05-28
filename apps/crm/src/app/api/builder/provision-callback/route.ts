import { createServiceSupabase } from "@crm-ascend/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const secret = request.headers.get("x-webhook-secret");
  if (secret !== (process.env.CRM_WEBHOOK_SECRET ?? "dev-secret")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    submission_id: string;
    status: "completed" | "failed";
    preview_url?: string;
    error?: string;
    stats?: {
      nuvemshop_store_id?: string;
      theme_assets?: {
        logo: string;
        bannersDesktop: string[];
        bannersMobile: string[];
      };
    };
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const supabase = createServiceSupabase();
  const { error } = await supabase.rpc("update_builder_submission_provision", {
    p_id: body.submission_id,
    p_provision_status: body.status,
    p_provision_error: body.error ?? null,
    p_store_preview_url: body.preview_url ?? null,
    p_nuvemshop_store_id: body.stats?.nuvemshop_store_id ?? null,
    p_theme_assets: body.stats?.theme_assets ?? null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
