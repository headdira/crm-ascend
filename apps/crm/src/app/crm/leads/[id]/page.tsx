import Link from "next/link";
import { UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CrmHeader } from "@/components/crm/crm-header";
import { StatusBadge } from "@/components/crm/status-badge";
import { getCurrentStaff } from "@/lib/auth";
import { getLead } from "@/lib/actions/leads";
import { formatDate } from "@/lib/utils";
import { ConvertLeadDialog } from "./convert-lead-dialog";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const staff = await getCurrentStaff();
  const lead = await getLead(id);

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
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold">{lead.full_name}</h1>
            <StatusBadge value={lead.status} />
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
            <TabsTrigger value="utm">UTM / Quiz</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
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
                {lead.email_enc && (
                  <p>
                    <span className="text-muted-foreground">E-mail (interno):</span>{" "}
                    {lead.email_enc}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="utm">
            <Card>
              <CardContent className="pt-6">
                <pre className="text-muted-foreground overflow-auto text-xs">
                  {JSON.stringify({ utm: lead.utm, quiz: lead.quiz_answers }, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="historico">
            <Card>
              <CardContent className="text-muted-foreground pt-6 text-sm">
                Histórico de atividades — em breve (Fase 2).
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
