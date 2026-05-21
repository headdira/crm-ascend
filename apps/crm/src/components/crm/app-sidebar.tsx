"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgeCheck,
  FileSignature,
  GraduationCap,
  LifeBuoy,
  Package,
  Settings,
  UserPlus,
  Wrench,
} from "lucide-react";
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
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col gap-1 border-b px-4 py-4">
        <span className="text-sm font-semibold">CRM Ascend</span>
        <span className="text-muted-foreground text-xs">Fase 1 · Interno</span>
      </SidebarHeader>
      <SidebarContent>
        {nav.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active =
                    pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={active}>
                        <Link href={item.href}>
                          <Icon data-icon="inline-start" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        <SidebarGroup>
          <SidebarGroupLabel>Matrículas</SidebarGroupLabel>
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
                <SidebarMenuButton asChild>
                  <Link href="/crm">
                    <Settings data-icon="inline-start" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
