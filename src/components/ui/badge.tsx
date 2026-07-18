import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "neutral" | "success" | "warning" | "error" | "information" | "violet";
export type BadgeSize = "default" | "compact";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  decorativeDot?: boolean;
  leadingIcon?: ReactNode;
  size?: BadgeSize;
  variant?: BadgeVariant;
}

export function Badge({
  children,
  className,
  decorativeDot = false,
  leadingIcon,
  size = "default",
  variant = "neutral",
  ...badgeProps
}: Readonly<BadgeProps>) {
  return (
    <span
      {...badgeProps}
      className={cn("ui-badge", `ui-badge--${variant}`, `ui-badge--${size}`, className)}
    >
      {decorativeDot ? <span className="ui-badge-dot" aria-hidden="true" /> : null}
      {leadingIcon ? (
        <span className="ui-badge-icon" aria-hidden="true">
          {leadingIcon}
        </span>
      ) : null}
      <span>{children}</span>
    </span>
  );
}
