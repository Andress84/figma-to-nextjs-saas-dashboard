import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type CardVariant = "default" | "raised" | "highlighted" | "danger";
export type CardPadding = "default" | "compact" | "none";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: CardPadding;
  variant?: CardVariant;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, padding = "default", variant = "default", ...cardProps },
  ref,
) {
  return (
    <div
      {...cardProps}
      ref={ref}
      className={cn("ui-card", `ui-card--${variant}`, `ui-card--padding-${padding}`, className)}
    />
  );
});
