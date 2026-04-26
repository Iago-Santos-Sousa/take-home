"use client";

import { Button, type buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AppVariant =
  | "primary"
  | "outline"
  | "ghost"
  | "secondary"
  | "danger"
  | "link";

type ShadVariant = VariantProps<typeof buttonVariants>["variant"];

const VARIANT_MAP: Record<AppVariant, ShadVariant> = {
  primary: "default",
  outline: "outline",
  ghost: "ghost",
  secondary: "secondary",
  danger: "destructive",
  link: "link",
};

interface AppButtonProps extends Omit<
  React.ComponentProps<typeof Button>,
  "variant"
> {
  variant?: AppVariant;
  children: ReactNode;
  loading?: boolean;
}

export default function AppButton({
  variant = "primary",
  className,
  children,
  loading,
  disabled,
  ...props
}: AppButtonProps) {
  return (
    <Button
      variant={VARIANT_MAP[variant]}
      className={cn(className)}
      disabled={disabled || loading}
      {...props}
    >
      {children}
    </Button>
  );
}
