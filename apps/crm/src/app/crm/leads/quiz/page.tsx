import Link from "next/link";
import { CrmTableLink } from "@/components/crm/crm-table-link";
import { UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { formatAdsQuizLeadRows } from "@/lib/ads-quiz-lead-display";
import { formatDate } from "@/lib/utils";
import { kiwifyLeadBadge } from "@/lib/kiwify-lead-status";

function quizSummary(quiz: Record<string, unknown>): string {
  const rows = formatAdsQuizLeadRows(quiz).filter(
    (r) => !["Última etapa salva", "Quiz atualizado em", "Tags de perfil"].includes(r.label),
  );
  if (rows.length === 0) return "Cadastro feito — aguardando respostas";
  return rows
    .slice(0, 3)
    .map((r) => `${r.label}: ${r.value}`)
    .join(" · ");
}

export default async function QuizLeadsPage() {
  const staff = await getCurrentStaff();
  const leads = await listLeads({ adsQuiz: true });

  return (
    <>
      <CrmHeader
        crumbs={[
          { label: "CRM", href: "/crm" },
          { label: "Leads", href: "/crm/leads" },
          { label: "Quiz /form" },
        ]}
        staffName={staff?.full_name ?? ""}
        staffEmail={staff?.email ?? ""}
      />
      <div className="flex flex-col gap-4 p-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black tracking-tight">Leads do quiz</h1>
          <p className="text-muted-foreground text-sm">
            Entradas pelo funil{" "}
            <Link href="/crm/forms" className="text-primary underline">
              /form
            </Link>{" "}
            — com respostas do diagnóstico.
          </p>
        </div>

        {leads.length === 0 ? (
          <p className="text-muted-foreground text-sm">Nenhum lead do quiz ainda.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Respostas (resumo)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Kiwify</TableHead>
                <TableHead>Atualizado</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => {
                const quiz = (lead.quiz_answers ?? {}) as Record<string, unknown>;
                const kiwifyBadge = kiwifyLeadBadge(quiz, lead.reached_kiwify_at);

                return (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <CrmTableLink
                        href={`/crm/leads/${lead.id}`}
                        className="font-medium hover:underline"
                      >
                        {lead.full_name}
                      </CrmTableLink>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      <div>{lead.email_enc ?? "—"}</div>
                      <div>{lead.phone_enc ?? "—"}</div>
                    </TableCell>
                    <TableCell className="max-w-md text-sm leading-snug">
                      {quizSummary(quiz)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <StatusBadge value={lead.status} />
                        {lead.status === "quente" || lead.reached_kiwify_at ? (
                          <Badge>Quente</Badge>
                        ) : lead.status === "frio" ? (
                          <Badge variant="outline">Frio</Badge>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      {kiwifyBadge ? (
                        <Badge variant={kiwifyBadge.variant}>{kiwifyBadge.label}</Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(lead.last_event_at ?? lead.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/crm/leads/${lead.id}`}>
                          <UserCheck data-icon="inline-start" />
                          Ver respostas
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
}
