"use client";

import Link from "next/link";
import { useCrmNavigation } from "@/components/crm/crm-navigation";

type Props = React.ComponentProps<typeof Link>;

export function CrmTableLink({ href, onClick, className, children, ...rest }: Props) {
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
