import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatAdsQuizLeadRows,
  isAdsQuizLead,
} from "@/lib/ads-quiz-lead-display";
import { formatDate } from "@/lib/utils";

export function LeadQuizAnswersCard({
  quiz,
}: {
  quiz: Record<string, unknown>;
}) {
  if (!isAdsQuizLead(quiz)) return null;

  const rows = formatAdsQuizLeadRows(quiz);
  const capturedAt =
    typeof quiz.lead_captured_at === "string" ? quiz.lead_captured_at : null;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-base">Respostas do quiz (/form)</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm">
        {capturedAt && (
          <p className="text-muted-foreground text-xs">
            Lead capturado em {formatDate(capturedAt)}
          </p>
        )}
        {rows.length === 0 ? (
          <p className="text-muted-foreground">
            Lead do quiz, mas ainda sem respostas salvas — aguardando preenchimento.
          </p>
        ) : (
          <dl className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {rows.map((row) => (
              <div
                key={`${row.label}-${row.value}`}
                className="grid gap-0.5 rounded-md border border-border/60 bg-muted/15 px-3 py-2.5"
              >
                <dt className="text-muted-foreground text-[10px] font-bold uppercase tracking-wide">
                  {row.label}
                </dt>
                <dd className="text-foreground text-sm leading-snug break-words">{row.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </CardContent>
    </Card>
  );
}
