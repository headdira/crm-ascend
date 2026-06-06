"use client";

import { CrmNavLink } from "@/components/crm/crm-navigation";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/crm/forms", label: "Editor do quiz", exact: true },
  { href: "/crm/forms/respostas", label: "Respostas" },
] as const;

export function FormsNav() {
  const pathname = usePathname();

  return (
    <nav
      className="mb-4 border-b border-border sm:mb-6"
      aria-label="Seções do formulário"
    >
      <div className="-mx-1 flex gap-0.5 overflow-x-auto px-1 pb-px [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab) => {
          const active =
            "exact" in tab && tab.exact
              ? pathname === tab.href
              : pathname === tab.href || pathname.startsWith(`${tab.href}/`);

          return (
            <CrmNavLink
              key={tab.href}
              href={tab.href}
              className={cn(
                "-mb-px shrink-0 border-b-2 px-3 py-2.5 text-xs font-semibold transition-colors sm:px-4 sm:text-sm",
                active
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </CrmNavLink>
          );
        })}
      </div>
    </nav>
  );
}
