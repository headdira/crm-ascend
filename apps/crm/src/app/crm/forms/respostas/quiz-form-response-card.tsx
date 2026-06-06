import Link from "next/link";
import type { Tables } from "@crm-ascend/db";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CrmTableLink } from "@/components/crm/crm-table-link";
import { StatusBadge } from "@/components/crm/status-badge";
import {
  formatAdsQuizLeadRows,
  getQuizIncomeLabel,
  getQuizStepAnswer,
} from "@/lib/ads-quiz-lead-display";
import { kiwifyLeadBadge } from "@/lib/kiwify-lead-status";
import { formatDate } from "@/lib/utils";

type Lead = Tables<"leads">;

const HIGHLIGHT_FIELDS = [
  { stepId: "objetivo", label: "Objetivo" },
  { stepId: "momento", label: "Momento" },
  { stepId: "barreira", label: "Trava" },
  { stepId: "nicho", label: "Nichos" },
] as const;

const META_ROW_LABELS = new Set([
  "Idade",
  "Renda mensal",
  "Última etapa salva",
  "Quiz atualizado em",
  "Tags de perfil",
]);

export function QuizFormResponseCard({ lead }: { lead: Lead }) {
  const quiz = (lead.quiz_answers ?? {}) as Record<string, unknown>;
  const kiwifyBadge = kiwifyLeadBadge(quiz, lead.reached_kiwify_at);
  const allRows = formatAdsQuizLeadRows(quiz);
  const hasAnswers = allRows.some((r) => !META_ROW_LABELS.has(r.label));
  const extraRows = allRows.filter((r) => !META_ROW_LABELS.has(r.label));

  return (
    <Card className="overflow-hidden">
      <CardHeader className="gap-3 space-y-0 border-b bg-muted/30 px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <CrmTableLink
              href={`/crm/leads/${lead.id}`}
              className="block truncate text-base font-semibold hover:underline"
            >
              {lead.full_name}
            </CrmTableLink>
            <p className="text-muted-foreground mt-1 truncate text-xs">
              {lead.phone_enc ?? lead.email_enc ?? "—"}
            </p>
          </div>
          <p className="text-muted-foreground shrink-0 text-[10px] leading-tight tabular-nums">
            {formatDate(lead.last_event_at ?? lead.created_at)}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <StatusBadge value={lead.status} />
          {kiwifyBadge ? (
            <Badge variant={kiwifyBadge.variant} className="text-[10px]">
              {kiwifyBadge.label}
            </Badge>
          ) : null}
          {!hasAnswers ? (
            <Badge variant="outline" className="text-[10px]">
              Só cadastro
            </Badge>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 px-4 py-3">
        <dl className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {getQuizIncomeLabel(quiz) ? (
            <div className="rounded-md border border-border/70 bg-muted/20 px-3 py-2">
              <dt className="text-muted-foreground text-[10px] font-bold uppercase tracking-wide">
                Renda
              </dt>
              <dd className="mt-0.5 text-sm leading-snug">{getQuizIncomeLabel(quiz)}</dd>
            </div>
          ) : null}
          {HIGHLIGHT_FIELDS.map(({ stepId, label }) => {
            const value = getQuizStepAnswer(quiz, stepId);
            if (!value) return null;
            return (
              <div
                key={stepId}
                className="rounded-md border border-border/70 bg-muted/20 px-3 py-2 sm:col-span-1"
              >
                <dt className="text-muted-foreground text-[10px] font-bold uppercase tracking-wide">
                  {label}
                </dt>
                <dd className="mt-0.5 text-sm leading-snug break-words">{value}</dd>
              </div>
            );
          })}
        </dl>

        {extraRows.length > 0 ? (
          <details className="group rounded-md border border-border/70">
            <summary className="cursor-pointer list-none px-3 py-2.5 text-xs font-semibold text-muted-foreground marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="group-open:hidden">Ver todas as respostas ({extraRows.length})</span>
              <span className="hidden group-open:inline">Ocultar respostas</span>
            </summary>
            <dl className="border-t px-3 py-2">
              {extraRows.map((row) => (
                <div
                  key={`${row.label}-${row.value}`}
                  className="border-b border-border/50 py-2 last:border-0"
                >
                  <dt className="text-muted-foreground text-[10px] font-bold uppercase tracking-wide">
                    {row.label}
                  </dt>
                  <dd className="mt-0.5 text-sm leading-snug break-words">{row.value}</dd>
                </div>
              ))}
            </dl>
          </details>
        ) : null}

        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href={`/crm/leads/${lead.id}`}>
            <ExternalLink data-icon="inline-start" />
            Abrir lead completo
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
