import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { getContract } from "@/lib/actions/contracts";
import { formatCents } from "@/lib/utils";
import { ActivateContractButton } from "./activate-contract-button";

export default async function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const staff = await getCurrentStaff();
  const contract = await getContract(id);
  const student = contract.students as { full_name: string } | null;
  const lines = contract.contract_lines as Array<{
    id: string;
    quantity: number;
    unit_price_cents: number;
    products: { name: string; sku: string } | null;
  }>;

  return (
    <>
      <CrmHeader
        crumbs={[
          { label: "CRM", href: "/crm" },
          { label: "Contratos", href: "/crm/contracts" },
          { label: contract.id.slice(0, 8) },
        ]}
        staffName={staff?.full_name ?? ""}
        staffEmail={staff?.email ?? ""}
      />
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold">{student?.full_name}</h1>
            <StatusBadge value={contract.status} />
          </div>
          {contract.status === "draft" && (
            <ActivateContractButton contractId={contract.id} />
          )}
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resumo</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            <p>
              Período: {contract.starts_at} — {contract.ends_at}
            </p>
            <p>Total: {formatCents(contract.total_amount_cents)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Linhas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Qtd</TableHead>
                  <TableHead>Unitário</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lines?.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell>{l.products?.name}</TableCell>
                    <TableCell className="font-mono text-xs">{l.products?.sku}</TableCell>
                    <TableCell>{l.quantity}</TableCell>
                    <TableCell>{formatCents(l.unit_price_cents)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
