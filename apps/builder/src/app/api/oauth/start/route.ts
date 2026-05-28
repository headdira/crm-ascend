import { getProvisionerUrl } from "@/lib/types";
import { NextResponse } from "next/server";

/** Redireciona para o provisioner em produção (servidor; ignora localhost na Vercel). */
export async function GET(request: Request) {
  const returnUrl = new URL(request.url).searchParams.get("return_url");
  if (!returnUrl) {
    return NextResponse.json({ error: "return_url é obrigatório" }, { status: 400 });
  }

  const provisionerBase = getProvisionerUrl();
  const target = new URL(`${provisionerBase}/oauth/start`);
  target.searchParams.set("return_url", returnUrl);
  const reqUrl = new URL(request.url);
  if (reqUrl.searchParams.get("force") === "1") {
    target.searchParams.set("force", "1");
  }
  const storeHost = reqUrl.searchParams.get("store_host")?.trim();
  if (storeHost) {
    target.searchParams.set("store_host", storeHost);
  }
  return NextResponse.redirect(target.toString(), {
    headers: { "X-Ascend-Provisioner": provisionerBase },
  });
}
