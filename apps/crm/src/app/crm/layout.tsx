import { redirect } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/crm/app-sidebar";
import { CrmNavigationProvider } from "@/components/crm/crm-navigation";
import { SupabaseConfigProvider } from "@/components/crm/supabase-config-provider";
import { getCurrentStaff } from "@/lib/auth";
import { syncStaffUser } from "@/lib/actions/staff";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

export default async function CrmLayout({ children }: { children: React.ReactNode }) {
  const supabaseEnv = getSupabasePublicEnv();
  if (!supabaseEnv.ok) {
    redirect("/login?error=config");
  }

  await syncStaffUser();
  const staff = await getCurrentStaff();

  if (!staff?.is_active) {
    redirect("/login?error=staff");
  }

  return (
    <SupabaseConfigProvider url={supabaseEnv.url} anonKey={supabaseEnv.anonKey}>
      <div className="ascend-crm-shell">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="min-w-0 bg-transparent">
            <CrmNavigationProvider>{children}</CrmNavigationProvider>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </SupabaseConfigProvider>
  );
}
