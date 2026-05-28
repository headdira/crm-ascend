"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavContextValue = {
  startNavigation: () => void;
};

const CrmNavContext = createContext<NavContextValue | null>(null);

export function CrmNavigationProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [navigating, setNavigating] = useState(false);

  const startNavigation = useCallback(() => {
    setNavigating(true);
  }, []);

  useEffect(() => {
    setNavigating(false);
  }, [pathname]);

  return (
    <CrmNavContext.Provider value={{ startNavigation }}>
      <div
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-[200] h-[3px] overflow-hidden transition-opacity duration-200",
          navigating ? "opacity-100" : "opacity-0",
        )}
        aria-hidden
      >
        <div className="h-full w-full bg-primary/25">
          <div className="crm-nav-progress-bar h-full w-1/3 bg-primary" />
        </div>
      </div>
      {children}
    </CrmNavContext.Provider>
  );
}

export function useCrmNavigation() {
  const ctx = useContext(CrmNavContext);
  if (!ctx) {
    return { startNavigation: () => undefined };
  }
  return ctx;
}

type CrmNavLinkProps = React.ComponentProps<typeof Link>;

export function CrmNavLink({ href, onClick, className, children, ...rest }: CrmNavLinkProps) {
  const { startNavigation } = useCrmNavigation();

  return (
    <Link
      href={href}
      className={className}
      onClick={(e) => {
        startNavigation();
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
