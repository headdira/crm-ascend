import { getProvisionerUrl } from "@/lib/types";
import { NextResponse } from "next/server";

/**
 * Nuvemshop redireciona para a "Redirect URL" do app (às vezes apontada para o builder).
 * O token só é trocado no provisioner; aqui só repassamos code + state.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const target = new URL(`${getProvisionerUrl()}/oauth/callback`);
  target.searchParams.set("code", code);
  if (state) target.searchParams.set("state", state);

  return NextResponse.redirect(target.toString());
}
