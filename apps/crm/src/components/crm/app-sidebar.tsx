"use client";

import Image from "next/image";
import { CrmNavLink } from "@/components/crm/crm-navigation";
import { usePathname } from "next/navigation";
import {
  BadgeCheck,
  FileSignature,
  FormInput,
  ClipboardList,
  GraduationCap,
  LifeBuoy,
  Package,
  Palette,
  Settings,
  UserPlus,
  Wrench,
} from "lucide-react";
import { LOGO_URL, SITE_NAME } from "@/lib/brand";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const nav = [
  {
    label: "Comercial",
    items: [
      { href: "/crm/leads", label: "Leads", icon: UserPlus },
      { href: "/crm/forms", label: "Formulário", icon: FormInput },
      { href: "/crm/forms/respostas", label: "Respostas do formulário", icon: ClipboardList },
      { href: "/crm/students", label: "Alunos", icon: GraduationCap },
    ],
  },
  {
    label: "Catálogo",
    items: [{ href: "/crm/products", label: "Produtos", icon: Package }],
  },
  {
    label: "Contratos",
    items: [{ href: "/crm/contracts", label: "Contratos", icon: FileSignature }],
  },
  {
    label: "Operações",
    items: [
      { href: "/crm/cases", label: "Casos", icon: LifeBuoy },
      { href: "/crm/services", label: "Serviços", icon: Wrench },
      { href: "/crm/builder", label: "Builder", icon: Palette },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-sidebar-border">
      <SidebarHeader className="border-sidebar-border flex flex-col gap-3 border-b px-4 py-4">
        <CrmNavLink href="/crm" className="flex items-center gap-3">
          <Image
            src={LOGO_URL}
            alt={SITE_NAME}
            width={140}
            height={40}
            className="h-9 w-auto opacity-95"
            priority
          />
        </CrmNavLink>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">CRM interno</p>
          <p className="text-muted-foreground text-xs">Operação · Fase 1</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {nav.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.15em]">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active =
                    pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={active}>
                        <CrmNavLink href={item.href}>
                          <Icon data-icon="inline-start" />
                          <span>{item.label}</span>
                        </CrmNavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.15em]">
            Matrículas
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton disabled>
                  <BadgeCheck data-icon="inline-start" />
                  <span className="text-muted-foreground">Via contratos</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/crm"}>
                  <CrmNavLink href="/crm">
                    <Settings data-icon="inline-start" />
                    <span>Dashboard</span>
                  </CrmNavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
