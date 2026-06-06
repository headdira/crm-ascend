import Link from "next/link";
import { ExternalLink } from "lucide-react";
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
import { CrmTableLink } from "@/components/crm/crm-table-link";
import { StatusBadge } from "@/components/crm/status-badge";
import { getCurrentStaff } from "@/lib/auth";
import { listQuizFormLeads } from "@/lib/actions/leads";
import {
  formatAdsQuizLeadRows,
  getQuizIncomeLabel,
  getQuizStepAnswer,
} from "@/lib/ads-quiz-lead-display";
import { kiwifyLeadBadge } from "@/lib/kiwify-lead-status";
import { formatDate } from "@/lib/utils";
import { FormsNav } from "../forms-nav";
import { QuizFormResponseCard } from "./quiz-form-response-card";

const META_ROW_LABELS = new Set([
  "Idade",
  "Renda mensal",
  "Última etapa salva",
  "Quiz atualizado em",
  "Tags de perfil",
]);

export default async function QuizFormResponsesPage() {
  const staff = await getCurrentStaff();
  const leads = await listQuizFormLeads();

  return (
    <>
      <CrmHeader
        crumbs={[
          { label: "CRM", href: "/crm" },
          { label: "Formulário", href: "/crm/forms" },
          { label: "Respostas" },
        ]}
        staffName={staff?.full_name ?? ""}
        staffEmail={staff?.email ?? ""}
      />
      <div className="flex min-w-0 flex-col gap-4 p-4 sm:p-6 lg:p-8">
        <FormsNav />

        <div className="min-w-0">
          <h1 className="text-xl font-black tracking-tight sm:text-2xl">Respostas do formulário</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Leads do quiz em <code className="text-xs">/form</code> — {leads.length} registro
            {leads.length === 1 ? "" : "s"}.
          </p>
        </div>

        {leads.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Nenhuma resposta ainda. Quando alguém preencher o quiz na landing, aparece aqui.
          </p>
        ) : (
          <>
            {/* Mobile / tablet: cards */}
            <div className="flex flex-col gap-3 lg:hidden">
              {leads.map((lead) => (
                <QuizFormResponseCard key={lead.id} lead={lead} />
              ))}
            </div>

            {/* Desktop: tabela */}
            <div className="hidden lg:block">
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[11rem]">Contato</TableHead>
                      <TableHead className="min-w-[8rem]">Objetivo</TableHead>
                      <TableHead className="min-w-[8rem]">Momento</TableHead>
                      <TableHead className="min-w-[8rem]">Trava</TableHead>
                      <TableHead className="min-w-[7rem]">Nichos</TableHead>
                      <TableHead className="min-w-[6rem]">Renda</TableHead>
                      <TableHead className="min-w-[6rem]">Status</TableHead>
                      <TableHead className="min-w-[5.5rem]">Atualizado</TableHead>
                      <TableHead className="w-[5.5rem] text-right">Detalhe</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => {
                      const quiz = (lead.quiz_answers ?? {}) as Record<string, unknown>;
                      const kiwifyBadge = kiwifyLeadBadge(quiz, lead.reached_kiwify_at);
                      const rows = formatAdsQuizLeadRows(quiz);
                      const hasAnswers = rows.some((r) => !META_ROW_LABELS.has(r.label));

                      return (
                        <TableRow key={lead.id}>
                          <TableCell>
                            <CrmTableLink
                              href={`/crm/leads/${lead.id}`}
                              className="font-medium hover:underline"
                            >
                              {lead.full_name}
                            </CrmTableLink>
                            <p className="text-muted-foreground mt-0.5 text-xs">
                              {lead.phone_enc ?? lead.email_enc ?? "—"}
                            </p>
                          </TableCell>
                          <TableCell className="text-sm">
                            <span className="line-clamp-2">
                              {getQuizStepAnswer(quiz, "objetivo") || "—"}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm">
                            <span className="line-clamp-2">
                              {getQuizStepAnswer(quiz, "momento") || "—"}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm">
                            <span className="line-clamp-2">
                              {getQuizStepAnswer(quiz, "barreira") || "—"}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm">
                            <span className="line-clamp-2">
                              {getQuizStepAnswer(quiz, "nicho") || "—"}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm whitespace-nowrap">
                            {getQuizIncomeLabel(quiz) ?? "—"}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <StatusBadge value={lead.status} />
                              {kiwifyBadge ? (
                                <Badge variant={kiwifyBadge.variant} className="w-fit text-[10px]">
                                  {kiwifyBadge.label}
                                </Badge>
                              ) : null}
                              {!hasAnswers && (
                                <Badge variant="outline" className="w-fit text-[10px]">
                                  Só cadastro
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                            {formatDate(lead.last_event_at ?? lead.created_at)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/crm/leads/${lead.id}`}>
                                <ExternalLink data-icon="inline-start" />
                                Abrir
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
