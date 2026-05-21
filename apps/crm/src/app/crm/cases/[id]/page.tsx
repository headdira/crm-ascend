import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CrmHeader } from "@/components/crm/crm-header";
import { StatusBadge } from "@/components/crm/status-badge";
import { getCurrentStaff } from "@/lib/auth";
import { getCase } from "@/lib/actions/cases";
import { formatDate } from "@/lib/utils";
import { CaseDetailForm } from "./case-detail-form";

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const staff = await getCurrentStaff();
  const { case: caseRow, comments, staffList } = await getCase(id);
  const student = caseRow.students as { full_name: string } | null;

  return (
    <>
      <CrmHeader
        crumbs={[
          { label: "CRM", href: "/crm" },
          { label: "Casos", href: "/crm/cases" },
          { label: caseRow.subject },
        ]}
        staffName={staff?.full_name ?? ""}
        staffEmail={staff?.email ?? ""}
      />
      <div className="flex flex-col gap-4 p-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">{caseRow.subject}</h1>
          <p className="text-muted-foreground text-sm">{student?.full_name}</p>
          <div className="flex gap-2">
            <StatusBadge value={caseRow.status} />
            <StatusBadge value={caseRow.priority} />
          </div>
        </div>

        <CaseDetailForm
          caseId={id}
          initial={{
            status: caseRow.status,
            priority: caseRow.priority,
            owner_id: caseRow.owner_id,
          }}
          staffList={staffList}
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Comentários</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64 pr-4">
              <div className="flex flex-col gap-4">
                {comments.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Sem comentários.</p>
                ) : (
                  comments.map((c) => {
                    const author = c.staff_users as { full_name: string } | null;
                    return (
                      <div key={c.id} className="flex flex-col gap-1 border-b pb-3 text-sm">
                        <p className="font-medium">{author?.full_name}</p>
                        <p className="text-muted-foreground text-xs">
                          {formatDate(c.created_at)}
                        </p>
                        <p>{c.body}</p>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
