import Link from "next/link";
import { CrmHeader } from "@/components/crm/crm-header";
import { getCurrentStaff } from "@/lib/auth";
import { getBuilderSubmission } from "@/lib/actions/builder";
import { Button } from "@/components/ui/button";
import { BuilderSubmissionDetail } from "./builder-submission-detail";

export default async function BuilderSubmissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const staff = await getCurrentStaff();
  const submission = await getBuilderSubmission(id);

  return (
    <>
      <CrmHeader
        crumbs={[
          { label: "CRM", href: "/crm" },
          { label: "Builder", href: "/crm/builder" },
          { label: "Resposta" },
        ]}
        staffName={staff?.full_name ?? ""}
        staffEmail={staff?.email ?? ""}
      />
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{submission.store_name ?? "Resposta do builder"}</h1>
            <p className="text-muted-foreground text-sm">
              {new Date(submission.created_at).toLocaleString("pt-BR")}
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/crm/builder">Voltar</Link>
          </Button>
        </div>
        <BuilderSubmissionDetail submission={submission} />
      </div>
    </>
  );
}
