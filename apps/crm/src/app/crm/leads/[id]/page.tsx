import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CrmHeader } from "@/components/crm/crm-header";
import { StatusBadge } from "@/components/crm/status-badge";
import { getCurrentStaff } from "@/lib/auth";
import { getLeadTrackingContext } from "@/lib/actions/leads";
import { formatDate } from "@/lib/utils";
import { LeadJourneyEvent } from "@/components/crm/lead-journey-event";
import {
  kiwifyCheckoutAbandoned,
  kiwifyCheckoutPending,
  kiwifyLeadBadge,
} from "@/lib/kiwify-lead-status";
import { ConvertLeadDialog } from "./convert-lead-dialog";
import { LeadQuizAnswersCard } from "@/components/crm/lead-quiz-answers";
import { isAdsQuizLead } from "@/lib/ads-quiz-lead-display";

function utmLabel(utm: Record<string, unknown>): string | null {
  const source = utm.utm_source;
  if (typeof source === "string" && source) return source;
  const medium = utm.utm_medium;
  if (typeof medium === "string" && medium) return medium;
  return null;
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const staff = await getCurrentStaff();
  const { lead, session, events } = await getLeadTrackingContext(id);
  const utm = (lead.utm ?? {}) as Record<string, unknown>;
  const quiz = (lead.quiz_answers ?? {}) as Record<string, unknown>;
  const campaign = utmLabel(utm);
  const abandoned = quiz.checkout_abandoned === true;
  const kiwifyAbandoned = kiwifyCheckoutAbandoned(quiz);
  const kiwifyPending = kiwifyCheckoutPending(quiz, lead.reached_kiwify_at);
  const kiwifyBadge = kiwifyLeadBadge(quiz, lead.reached_kiwify_at);
  const isFrio = lead.status === "frio";
  const isQuente = lead.status === "quente" || !!lead.reached_kiwify_at;
  const initialCta =
    typeof quiz.initial_cta_label === "string"
      ? quiz.initial_cta_label
      : typeof quiz.initial_cta === "string"
        ? quiz.initial_cta
        : null;

  return (
    <>
      <CrmHeader
        crumbs={[
          { label: "CRM", href: "/crm" },
          { label: "Leads", href: "/crm/leads" },
          { label: lead.full_name },
        ]}
        staffName={staff?.full_name ?? ""}
        staffEmail={staff?.email ?? ""}
      />
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold">{lead.full_name}</h1>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge value={lead.status} />
              {isFrio && <Badge variant="outline">Lead frio</Badge>}
              {isQuente && <Badge>Lead quente</Badge>}
              {kiwifyBadge && (
                <Badge variant={kiwifyBadge.variant}>{kiwifyBadge.label}</Badge>
              )}
              {abandoned && !lead.reached_kiwify_at && (
                <Badge variant="destructive">Abandonou formulário</Badge>
              )}
              {!lead.session_id && (
                <Badge variant="outline">Sem jornada vinculada</Badge>
              )}
              {initialCta && <Badge variant="outline">CTA: {initialCta}</Badge>}
              {isAdsQuizLead(quiz) && <Badge variant="outline">Quiz /form</Badge>}
              {campaign && <Badge variant="outline">Campanha: {campaign}</Badge>}
            </div>
          </div>
          {lead.status !== "converted" && lead.status !== "disqualified" && (
            <ConvertLeadDialog leadId={lead.id} leadName={lead.full_name} />
          )}
        </div>

        {lead.converted_student_id && (
          <p className="text-sm">
            Aluno:{" "}
            <Link
              href={`/crm/students/${lead.converted_student_id}`}
              className="text-primary underline"
            >
              Ver perfil
            </Link>
          </p>
        )}

        <Tabs defaultValue="resumo">
          <TabsList>
            <TabsTrigger value="resumo">Resumo</TabsTrigger>
            <TabsTrigger value="utm">UTM / Atribuição</TabsTrigger>
            <TabsTrigger value="historico">Jornada ({events.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="resumo">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Dados</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Origem:</span> {lead.source}
                </p>
                <p>
                  <span className="text-muted-foreground">Criado:</span>{" "}
                  {formatDate(lead.created_at)}
                </p>
                {lead.reached_kiwify_at && (
                  <p>
                    <span className="text-muted-foreground">Checkout Kiwify:</span>{" "}
                    {formatDate(lead.reached_kiwify_at)}
                  </p>
                )}
                {kiwifyPending && (
                  <p>
                    <span className="text-muted-foreground">Status checkout:</span>{" "}
                    Aguardando pagamento na Kiwify
                    {typeof quiz.kiwify_checkout_started_at === "string" && (
                      <> · desde {formatDate(quiz.kiwify_checkout_started_at)}</>
                    )}
                  </p>
                )}
                {kiwifyAbandoned && (
                  <p>
                    <span className="text-muted-foreground">Abandonou checkout Kiwify:</span>{" "}
                    {typeof quiz.kiwify_abandoned_at === "string"
                      ? formatDate(quiz.kiwify_abandoned_at)
                      : "—"}
                    {typeof quiz.kiwify_product_name === "string" && (
                      <> · {quiz.kiwify_product_name}</>
                    )}
                  </p>
                )}
                {lead.last_event_at && (
                  <p>
                    <span className="text-muted-foreground">Último evento:</span>{" "}
                    {formatDate(lead.last_event_at)}
                  </p>
                )}
                {lead.session_id && (
                  <p>
                    <span className="text-muted-foreground">Sessão:</span>{" "}
                    <code className="text-xs">{lead.session_id}</code>
                  </p>
                )}
                {lead.email_enc && (
                  <p>
                    <span className="text-muted-foreground">E-mail (interno):</span>{" "}
                    {lead.email_enc}
                  </p>
                )}
                {lead.phone_enc && (
                  <p>
                    <span className="text-muted-foreground">Telefone:</span> {lead.phone_enc}
                  </p>
                )}
                {initialCta && (
                  <p>
                    <span className="text-muted-foreground">Botão clicado:</span> {initialCta}
                  </p>
                )}
                {abandoned && (
                  <p>
                    <span className="text-muted-foreground">Abandonou em:</span>{" "}
                    {String(quiz.abandoned_step ?? "—")}
                    {Array.isArray(quiz.filled_fields) && quiz.filled_fields.length > 0 && (
                      <> · preencheu: {(quiz.filled_fields as string[]).join(", ")}</>
                    )}
                  </p>
                )}
                {session?.user_agent && (
                  <p className="sm:col-span-2">
                    <span className="text-muted-foreground">Navegador:</span>{" "}
                    <span className="break-all text-xs">{session.user_agent}</span>
                  </p>
                )}
              </CardContent>
            </Card>
            <LeadQuizAnswersCard quiz={quiz} />
            {session && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-base">Sessão no site</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
                  <p>
                    <span className="text-muted-foreground">Dispositivo:</span>{" "}
                    {[session.device, session.os].filter(Boolean).join(" / ") || "—"}
                  </p>
                  <p>
                    <span className="text-muted-foreground">País / cidade:</span>{" "}
                    {[session.country, session.city].filter(Boolean).join(", ") || "—"}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Primeira visita:</span>{" "}
                    {formatDate(session.first_seen)}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Última atividade:</span>{" "}
                    {formatDate(session.last_seen)}
                  </p>
                  {session.referrer && (
                    <p className="sm:col-span-2">
                      <span className="text-muted-foreground">Referrer:</span> {session.referrer}
                    </p>
                  )}
                  {session.landing_path && (
                    <p className="sm:col-span-2">
                      <span className="text-muted-foreground">Landing:</span> {session.landing_path}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="utm">
            <Card>
              <CardContent className="pt-6">
                <pre className="text-muted-foreground overflow-auto text-xs">
                  {JSON.stringify({ utm: lead.utm, session_utm: session?.utm ?? null }, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="historico">
            <Card>
              <CardContent className="pt-6">
                {!lead.session_id ? (
                  <p className="text-muted-foreground text-sm">
                    Este lead não tem sessão da landing — a jornada só aparece para visitantes
                    rastreados desde o primeiro acesso (lead frio).
                  </p>
                ) : events.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    Sessão vinculada, mas ainda sem eventos gravados.
                  </p>
                ) : (
                  <ul className="flex flex-col gap-3">
                    {events.map((ev) => (
                      <LeadJourneyEvent
                        key={ev.id}
                        eventName={ev.event_name}
                        ts={ev.ts}
                        page={ev.page}
                        payload={(ev.payload ?? {}) as Record<string, unknown>}
                      />
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
