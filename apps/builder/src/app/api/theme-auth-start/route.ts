import { getProvisionerUrl } from "@/lib/types";

/**
 * Proxy → provisioner /theme-auth/start.
 * O provisioner valida a sessão OAuth e redireciona ao brand-editor.tiendanube.com
 * (página oficial que emite o Base64 do CLI de temas).
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const oauthSessionId = url.searchParams.get("oauth_session_id")?.trim();
  if (!oauthSessionId) {
    return new Response("oauth_session_id obrigatório", { status: 400 });
  }

  const target = new URL(`${getProvisionerUrl()}/theme-auth/start`);
  target.searchParams.set("oauth_session_id", oauthSessionId);
  const returnUrl = url.searchParams.get("return_url");
  if (returnUrl) target.searchParams.set("return_url", returnUrl);

  return Response.redirect(target.toString(), 302);
}
