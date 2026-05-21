import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CrmHeader } from "@/components/crm/crm-header";
import { StatusBadge } from "@/components/crm/status-badge";
import { getCurrentStaff } from "@/lib/auth";
import { getProduct, listProducts } from "@/lib/actions/products";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const staff = await getCurrentStaff();
  const product = await getProduct(id);
  const all = await listProducts();
  const required = product.requires_product_id
    ? all.find((p) => p.id === product.requires_product_id)
    : null;

  return (
    <>
      <CrmHeader
        crumbs={[
          { label: "CRM", href: "/crm" },
          { label: "Produtos", href: "/crm/products" },
          { label: product.sku },
        ]}
        staffName={staff?.full_name ?? ""}
        staffEmail={staff?.email ?? ""}
      />
      <div className="flex flex-col gap-4 p-6">
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-mono">{product.sku}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            <p>
              Tipo: <StatusBadge value={product.product_type} />
            </p>
            <p>Ativo: {product.is_active ? "Sim" : "Não"}</p>
            {required && (
              <p>
                Requer produto: {required.sku} ({required.name})
              </p>
            )}
            <p>{product.description}</p>
            <pre className="text-muted-foreground text-xs">
              {JSON.stringify(product.metadata, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
