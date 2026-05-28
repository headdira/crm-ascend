import { getProvisionerUrl } from "@/lib/types";
import { NextResponse } from "next/server";

/** Redireciona para o provisioner usando PROVISIONER_URL do servidor (não depende do bundle client). */
export async function GET(request: Request) {
  const returnUrl = new URL(request.url).searchParams.get("return_url");
  if (!returnUrl) {
    return NextResponse.json({ error: "return_url é obrigatório" }, { status: 400 });
  }

  const target = new URL(`${getProvisionerUrl()}/oauth/start`);
  target.searchParams.set("return_url", returnUrl);
  return NextResponse.redirect(target.toString());
}
