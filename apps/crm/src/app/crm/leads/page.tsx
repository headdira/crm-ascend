import Link from "next/link";
import { UserCheck, UserPlus } from "lucide-react";
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
import { listLeads } from "@/lib/actions/leads";
import { formatDate } from "@/lib/utils";
import { LeadDiscardButton } from "./lead-discard-button";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const staff = await getCurrentStaff();
  const params = await searchParams;
  const leads = await listLeads({ status: params.status, q: params.q });

  return (
    <>
      <CrmHeader
        crumbs={[{ label: "CRM", href: "/crm" }, { label: "Leads" }]}
        staffName={staff?.full_name ?? ""}
        staffEmail={staff?.email ?? ""}
      />
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Leads</h1>
          <Button asChild>
            <Link href="/crm/leads/new">
              <UserPlus data-icon="inline-start" />
              Novo lead
            </Link>
          </Button>
        </div>
        {leads.length === 0 ? (
          <p className="text-muted-foreground text-sm">Nenhum lead encontrado.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Criado</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <Link href={`/crm/leads/${lead.id}`} className="font-medium hover:underline">
                      {lead.full_name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <StatusBadge value={lead.status} />
                  </TableCell>
                  <TableCell>{lead.source}</TableCell>
                  <TableCell>{formatDate(lead.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {lead.status !== "converted" && lead.status !== "disqualified" && (
                        <>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/crm/leads/${lead.id}`}>
                              <UserCheck data-icon="inline-start" />
                              Converter
                            </Link>
                          </Button>
                          <LeadDiscardButton leadId={lead.id} />
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
}
