import { fetchCatalogFromCrm } from "@/lib/crm-client";

export async function GET() {
  try {
    const catalog = await fetchCatalogFromCrm();
    return Response.json(catalog);
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Catalog error" },
      { status: 500 },
    );
  }
}
