import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type IconButtonVariant = "default" | "ghost" | "secondary" | "destructive";
export type IconButtonSize = "default" | "compact" | "mobile";

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> {
  active?: boolean;
  label: string;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  {
    active = false,
    children,
    className,
    label,
    size = "default",
    type = "button",
    variant = "default",
    ...buttonProps
  },
  ref,
) {
  return (
    <button
      {...buttonProps}
      ref={ref}
      className={cn(
        "ui-icon-button",
        `ui-icon-button--variant-${variant}`,
        `ui-icon-button--size-${size}`,
        className,
      )}
      type={type}
      aria-label={label}
      data-active={active || undefined}
    >
      {children}
    </button>
  );
});
