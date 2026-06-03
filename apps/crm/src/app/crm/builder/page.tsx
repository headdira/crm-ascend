import { CrmHeader } from "@/components/crm/crm-header";
import { getCurrentStaff } from "@/lib/auth";
import { getBuilderSettings, listBuilderAssets } from "@/lib/actions/builder";
import { BuilderAdminTabs } from "./builder-admin-tabs";

export default async function BuilderAdminPage() {
  const staff = await getCurrentStaff();
  const [logos, banners, settings] = await Promise.all([
    listBuilderAssets("logo"),
    listBuilderAssets("banner"),
    getBuilderSettings(),
  ]);

  return (
    <>
      <CrmHeader
        crumbs={[{ label: "CRM", href: "/crm" }, { label: "Builder" }]}
        staffName={staff?.full_name ?? ""}
        staffEmail={staff?.email ?? ""}
      />
      <div className="flex flex-col gap-4 p-6">
        <div>
          <h1 className="text-2xl font-semibold">Club Builder</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie logos, banners, vídeo e respostas dos clientes.
          </p>
        </div>

        <BuilderAdminTabs logos={logos} banners={banners} settings={settings} />
      </div>
    </>
  );
}
