import { createServiceSupabase } from "@crm-ascend/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const secret = request.headers.get("x-webhook-secret");
  if (secret !== (process.env.CRM_WEBHOOK_SECRET ?? "dev-secret")) {
    console.warn("[provision-callback] x-webhook-secret mismatch — recusando callback");
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

  console.log(
    `[provision-callback] submission=${body.submission_id} status=${body.status} store=${body.stats?.nuvemshop_store_id ?? "—"}`,
  );

  const supabase = createServiceSupabase();
  const { error: rpcErr } = await supabase.rpc("update_builder_submission_provision", {
    p_id: body.submission_id,
    p_provision_status: body.status,
    p_provision_error: body.error ?? null,
    p_store_preview_url: body.preview_url ?? null,
    p_nuvemshop_store_id: body.stats?.nuvemshop_store_id ?? null,
    p_theme_assets: body.stats?.theme_assets ?? null,
  });

  if (!rpcErr) return NextResponse.json({ ok: true, via: "rpc" });

  // Fallback PATCH direto pra não deixar status pendurado
  console.error(
    `[provision-callback] RPC falhou (id=${body.submission_id}): ${rpcErr.message} — tentando PATCH direto`,
  );
  const { error: patchErr } = await supabase
    .from("builder_submissions")
    .update({
      provision_status: body.status,
      provision_error: body.error ?? null,
      store_preview_url: body.preview_url ?? null,
      nuvemshop_store_id: body.stats?.nuvemshop_store_id ?? null,
      theme_assets: body.stats?.theme_assets ?? null,
    })
    .eq("id", body.submission_id);

  if (patchErr) {
    console.error(
      `[provision-callback] PATCH fallback também falhou (id=${body.submission_id}): ${patchErr.message}`,
    );
    return NextResponse.json(
      { error: rpcErr.message, fallback_error: patchErr.message },
      { status: 500 },
    );
  }
  console.warn(
    `[provision-callback] OK via PATCH direto — RPC quebrada (id=${body.submission_id})`,
  );
  return NextResponse.json({ ok: true, via: "patch" });
}
