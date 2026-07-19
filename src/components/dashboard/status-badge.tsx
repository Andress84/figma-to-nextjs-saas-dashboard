import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DashboardStatus } from "@/types/dashboard";

export interface StatusBadgeProps {
  readonly className?: string;
  readonly status: DashboardStatus;
}

interface StatusPresentation {
  readonly label: string;
  readonly variant: BadgeVariant;
}

const statusPresentation = {
  active: { label: "Active", variant: "success" },
  trial: { label: "Trial", variant: "information" },
  "past-due": { label: "Past due", variant: "error" },
  churned: { label: "Churned", variant: "neutral" },
  trialing: { label: "Trialing", variant: "information" },
  paused: { label: "Paused", variant: "neutral" },
  canceled: { label: "Canceled", variant: "neutral" },
  paid: { label: "Paid", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  refunded: { label: "Refunded", variant: "information" },
  failed: { label: "Failed", variant: "error" },
} as const satisfies Record<DashboardStatus, StatusPresentation>;

export function StatusBadge({ className, status }: StatusBadgeProps) {
  const presentation = statusPresentation[status];

  return (
    <Badge
      className={cn("dashboard-status-badge", className)}
      decorativeDot
      variant={presentation.variant}
    >
      {presentation.label}
    </Badge>
  );
}
