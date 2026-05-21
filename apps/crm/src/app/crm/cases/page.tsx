import Link from "next/link";
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
import { listCases } from "@/lib/actions/cases";
import { formatDate } from "@/lib/utils";

export default async function CasesPage() {
  const staff = await getCurrentStaff();
  const cases = await listCases();

  return (
    <>
      <CrmHeader
        crumbs={[{ label: "CRM", href: "/crm" }, { label: "Casos" }]}
        staffName={staff?.full_name ?? ""}
        staffEmail={staff?.email ?? ""}
      />
      <div className="flex flex-col gap-4 p-6">
        <h1 className="text-2xl font-semibold">Casos</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Assunto</TableHead>
              <TableHead>Aluno ID</TableHead>
              <TableHead>Serviço ID</TableHead>
              <TableHead>Prioridade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <Link href={`/crm/cases/${c.id}`} className="hover:underline">
                      {c.subject}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">{c.student_id.slice(0, 8)}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{c.service_id.slice(0, 8)}</TableCell>
                  <TableCell>
                    <StatusBadge value={c.priority} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge value={c.status} />
                  </TableCell>
                  <TableCell>{formatDate(c.created_at)}</TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
