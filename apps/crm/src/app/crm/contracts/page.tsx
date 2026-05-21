import Link from "next/link";
import { FileSignature } from "lucide-react";
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
import { listContracts } from "@/lib/actions/contracts";
import { formatCents } from "@/lib/utils";

export default async function ContractsPage() {
  const staff = await getCurrentStaff();
  const contracts = await listContracts();

  return (
    <>
      <CrmHeader
        crumbs={[{ label: "CRM", href: "/crm" }, { label: "Contratos" }]}
        staffName={staff?.full_name ?? ""}
        staffEmail={staff?.email ?? ""}
      />
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Contratos</h1>
          <Button asChild>
            <Link href="/crm/contracts/new">
              <FileSignature data-icon="inline-start" />
              Novo contrato
            </Link>
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aluno</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Aluno ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <Link href={`/crm/contracts/${c.id}`} className="hover:underline">
                      {c.id.slice(0, 8)}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <StatusBadge value={c.status} />
                  </TableCell>
                  <TableCell>{formatCents(c.total_amount_cents)}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{c.student_id.slice(0, 8)}</TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
