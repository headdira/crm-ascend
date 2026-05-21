"use client";

import type { ComponentProps } from "react";
import CheckoutLink from "../CheckoutLink";
import { brandCta } from "./tokens";
import { cn } from "@/lib/utils";

type Variant = keyof typeof brandCta;

type Props = Omit<ComponentProps<typeof CheckoutLink>, "className"> & {
  variant?: Variant;
  className?: string;
};

export default function BrandCheckoutLink({
  variant = "primary",
  className,
  ...rest
}: Props) {
  return <CheckoutLink className={cn(brandCta[variant], className)} {...rest} />;
}
