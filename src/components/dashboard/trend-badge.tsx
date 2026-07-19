import { ArrowDownRight, ArrowUpRight, Minus, TrendingDown } from "lucide-react";
import type { ReactNode } from "react";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TrendTone } from "@/types/dashboard";

export interface TrendBadgeProps {
  readonly className?: string;
  readonly icon?: ReactNode;
  readonly label: string;
  readonly tone: TrendTone;
}

const badgeVariantByTone = {
  positive: "success",
  negative: "error",
  improvement: "success",
  neutral: "neutral",
} as const satisfies Record<TrendTone, BadgeVariant>;

const defaultIconByTone = {
  positive: <ArrowUpRight size={13} strokeWidth={2.2} />,
  negative: <TrendingDown size={13} strokeWidth={2.2} />,
  improvement: <ArrowDownRight size={13} strokeWidth={2.2} />,
  neutral: <Minus size={13} strokeWidth={2.2} />,
} as const satisfies Record<TrendTone, ReactNode>;

export function TrendBadge({ className, icon, label, tone }: TrendBadgeProps) {
  return (
    <Badge
      className={cn("dashboard-trend-badge", `dashboard-trend-badge--${tone}`, className)}
      leadingIcon={icon === undefined ? defaultIconByTone[tone] : icon}
      variant={badgeVariantByTone[tone]}
    >
      {label}
    </Badge>
  );
}
