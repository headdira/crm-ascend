import Link from "next/link";
import { CrmHeader } from "@/components/crm/crm-header";
import { getCurrentStaff } from "@/lib/auth";
import { getBuilderSubmission } from "@/lib/actions/builder";
import { Button } from "@/components/ui/button";

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
        <div className="grid gap-3 rounded-lg border p-4 text-sm sm:grid-cols-2">
          <div>
            <span className="text-muted-foreground">Provisionamento</span>
            <p className="font-medium capitalize">
              {"provision_status" in submission
                ? String((submission as { provision_status?: string }).provision_status)
                : "—"}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Preview</span>
            <p className="font-medium">
              {"store_preview_url" in submission &&
              (submission as { store_preview_url?: string | null }).store_preview_url ? (
                <a
                  href={(submission as { store_preview_url: string }).store_preview_url}
                  className="text-primary underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abrir loja
                </a>
              ) : (
                "—"
              )}
            </p>
          </div>
        </div>
        {"theme_assets" in submission &&
        submission.theme_assets &&
        typeof submission.theme_assets === "object" ? (
          <div className="rounded-lg border p-4 text-sm">
            <p className="text-muted-foreground mb-2 font-medium">Assets do tema (Supabase)</p>
            <ul className="list-inside list-disc space-y-1">
              {"logo" in (submission.theme_assets as Record<string, unknown>) &&
              typeof (submission.theme_assets as { logo?: string }).logo === "string" ? (
                <li>
                  <a
                    href={(submission.theme_assets as { logo: string }).logo}
                    className="text-primary underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Logo
                  </a>
                </li>
              ) : null}
              {Array.isArray(
                (submission.theme_assets as { bannersDesktop?: string[] }).bannersDesktop,
              )
                ? (submission.theme_assets as { bannersDesktop: string[] }).bannersDesktop.map(
                    (url, i) => (
                      <li key={`d-${i}`}>
                        <a
                          href={url}
                          className="text-primary underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Banner desktop {i + 1}
                        </a>
                      </li>
                    ),
                  )
                : null}
            </ul>
          </div>
        ) : null}
        <pre className="bg-muted/40 overflow-x-auto rounded-lg border p-4 text-xs">
          {JSON.stringify(submission.payload, null, 2)}
        </pre>
      </div>
    </>
  );
}
