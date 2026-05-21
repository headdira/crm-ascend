import Link from "next/link";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CrmHeader } from "@/components/crm/crm-header";
import { StatusBadge } from "@/components/crm/status-badge";
import { getCurrentStaff } from "@/lib/auth";
import { listProducts } from "@/lib/actions/products";

export default async function ProductsPage() {
  const staff = await getCurrentStaff();
  const products = await listProducts();

  return (
    <>
      <CrmHeader
        crumbs={[{ label: "CRM", href: "/crm" }, { label: "Produtos" }]}
        staffName={staff?.full_name ?? ""}
        staffEmail={staff?.email ?? ""}
      />
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Produtos</h1>
          <Button asChild>
            <Link href="/crm/products/new">
              <Package data-icon="inline-start" />
              Novo produto
            </Link>
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Ativo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <Link href={`/crm/products/${p.id}`} className="font-mono text-sm hover:underline">
                    {p.sku}
                  </Link>
                </TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>
                  <StatusBadge value={p.product_type} />
                </TableCell>
                <TableCell>{p.is_active ? "Sim" : "Não"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
