import { CrmNavLink } from "@/components/crm/crm-navigation";
import {
  BadgeCheck,
  FileSignature,
  GraduationCap,
  LifeBuoy,
  UserPlus,
} from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CrmHeader } from "@/components/crm/crm-header";
import { getCurrentStaff } from "@/lib/auth";
import { getDashboardStats } from "@/lib/actions/dashboard";

export default async function CrmDashboardPage() {
  const staff = await getCurrentStaff();
  const stats = await getDashboardStats();

  const cards = [
    {
      title: "Leads novos (7d)",
      value: stats.newLeads7d,
      href: "/crm/leads",
      icon: UserPlus,
    },
    {
      title: "Alunos ativos",
      value: stats.activeStudents,
      href: "/crm/students",
      icon: GraduationCap,
    },
    {
      title: "Casos abertos",
      value: stats.openCases,
      href: "/crm/cases",
      icon: LifeBuoy,
    },
    {
      title: "Contratos rascunho",
      value: stats.draftContracts,
      href: "/crm/contracts",
      icon: FileSignature,
    },
  ];

  return (
    <>
      <CrmHeader
        crumbs={[{ label: "CRM" }]}
        staffName={staff?.full_name ?? ""}
        staffEmail={staff?.email ?? ""}
      />
      <div className="flex flex-col gap-6 p-6">
        <div>
          <p className="text-primary text-xs font-bold uppercase tracking-[0.2em]">Ascend Club</p>
          <h1 className="text-2xl font-black tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Resumo operacional — Fase 1</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <CrmNavLink key={c.href} href={c.href}>
                <Card className="border-border/80 transition-colors hover:border-primary/30 hover:bg-accent/40">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <CardDescription>{c.title}</CardDescription>
                      <CardTitle className="text-3xl tabular-nums">{c.value}</CardTitle>
                    </div>
                    <Icon className="text-muted-foreground size-5" />
                  </CardHeader>
                </Card>
              </CrmNavLink>
            );
          })}
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BadgeCheck className="size-4" />
              Matrículas
            </CardTitle>
            <CardDescription>
              Geradas automaticamente ao ativar contratos com status ativo.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </>
  );
}
