import { useId, type ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface ChartFrameProps {
  readonly actions?: ReactNode;
  readonly children: ReactNode;
  readonly className?: string;
  readonly description?: string;
  readonly emptyMessage?: string;
  readonly height?: "compact" | "standard" | "large";
  readonly isEmpty?: boolean;
  readonly legend?: ReactNode;
  readonly loading?: boolean;
  readonly loadingLabel?: string;
  readonly metric?: ReactNode;
  readonly summary: ReactNode;
  readonly title: string;
}

export function ChartFrame({
  actions,
  children,
  className,
  description,
  emptyMessage = "No chart data available.",
  height = "standard",
  isEmpty = false,
  legend,
  loading = false,
  loadingLabel = "Loading chart data…",
  metric,
  summary,
  title,
}: ChartFrameProps) {
  const generatedId = useId();
  const titleId = `${generatedId}-title`;
  const descriptionId = `${generatedId}-description`;
  const summaryId = `${generatedId}-summary`;
  const describedBy = [description ? descriptionId : null, summaryId].filter(Boolean).join(" ");

  return (
    <Card
      className={cn("chart-frame", className)}
      role="figure"
      aria-busy={loading || undefined}
      aria-labelledby={titleId}
    >
      <div className="chart-frame-header">
        <div className="chart-frame-heading">
          <h2 id={titleId}>{title}</h2>
          {description ? <p id={descriptionId}>{description}</p> : null}
        </div>
        {actions ? <div className="chart-frame-actions">{actions}</div> : null}
      </div>

      {metric ? <div className="chart-frame-metric">{metric}</div> : null}

      {loading || isEmpty ? (
        <div className="chart-frame-state" role="status" data-height={height}>
          {loading ? loadingLabel : emptyMessage}
        </div>
      ) : (
        <div
          className="chart-frame-visualization"
          data-height={height}
          role="img"
          aria-labelledby={titleId}
          aria-describedby={describedBy}
        >
          {children}
        </div>
      )}

      {legend ? <div className="chart-frame-legend">{legend}</div> : null}
      <div id={summaryId}>{summary}</div>
    </Card>
  );
}
