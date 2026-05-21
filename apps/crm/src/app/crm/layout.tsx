import { redirect } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/crm/app-sidebar";
import { getCurrentStaff } from "@/lib/auth";
import { syncStaffUser } from "@/lib/actions/staff";

export default async function CrmLayout({ children }: { children: React.ReactNode }) {
  await syncStaffUser();
  const staff = await getCurrentStaff();

  if (!staff?.is_active) {
    redirect("/login?error=staff");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-w-0">{children}</SidebarInset>
    </SidebarProvider>
  );
}
