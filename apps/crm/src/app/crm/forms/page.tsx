import { CrmHeader } from "@/components/crm/crm-header";
import { getCurrentStaff } from "@/lib/auth";
import { getAdsQuizForm } from "@/lib/actions/ads-quiz-form";
import { getAdsQuizPublicUrl } from "@/lib/landing-url";
import { AdsQuizEditor } from "./ads-quiz-editor";
import { FormsNav } from "./forms-nav";

export default async function CrmFormsPage() {
  const staff = await getCurrentStaff();
  const form = await getAdsQuizForm();
  const publicUrl = getAdsQuizPublicUrl();

  return (
    <>
      <CrmHeader
        crumbs={[{ label: "CRM", href: "/crm" }, { label: "Formulário" }]}
        staffName={staff?.full_name ?? "Equipe"}
        staffEmail={staff?.email ?? ""}
      />
      <div className="p-6 lg:p-8">
        <FormsNav />
        <div className="mb-8">
          <h1 className="text-2xl font-black tracking-tight">Quiz de anúncios</h1>
          <p className="text-muted-foreground text-sm mt-2 max-w-xl">
            Funil passo a passo na landing. Edite textos aqui e copie o link para campanhas.
          </p>
        </div>
        <AdsQuizEditor form={form} publicUrl={publicUrl} />
      </div>
    </>
  );
}
