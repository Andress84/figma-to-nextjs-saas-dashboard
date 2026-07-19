import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface MetricCardProps {
  readonly className?: string;
  readonly highlighted?: boolean;
  readonly icon?: ReactNode;
  readonly label: string;
  readonly sparkline?: ReactNode;
  readonly supportingText?: string;
  readonly trend?: ReactNode;
  readonly value: string;
}

export function MetricCard({
  className,
  highlighted = false,
  icon,
  label,
  sparkline,
  supportingText,
  trend,
  value,
}: MetricCardProps) {
  return (
    <Card
      className={cn("dashboard-metric-card", className)}
      variant={highlighted ? "highlighted" : "default"}
      data-highlighted={highlighted || undefined}
    >
      <div className="dashboard-metric-card-header">
        <h3>{label}</h3>
        {icon ? (
          <span className="dashboard-metric-card-icon" aria-hidden="true">
            {icon}
          </span>
        ) : null}
      </div>
      <p className="dashboard-metric-card-value">{value}</p>
      {trend || supportingText ? (
        <div className="dashboard-metric-card-details">
          {trend ? <span className="dashboard-metric-card-trend">{trend}</span> : null}
          {supportingText ? <p>{supportingText}</p> : null}
        </div>
      ) : null}
      {sparkline ? <div className="dashboard-metric-card-sparkline">{sparkline}</div> : null}
    </Card>
  );
}
