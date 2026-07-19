"use client";

import type { ReactNode } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartFrame } from "./chart-frame";
import { ChartLegend } from "./chart-legend";
import { ChartSummary } from "./chart-summary";
import { ChartTooltip } from "./chart-tooltip";
import type { ChartSeries, ChartValueFormat, DonutChartSegment } from "./chart-types";
import { formatChartValue, getChartColor } from "./chart-utils";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

export interface DonutChartProps {
  readonly actions?: ReactNode;
  readonly className?: string;
  readonly data: readonly DonutChartSegment[];
  readonly description?: string;
  readonly height?: "compact" | "standard" | "large";
  readonly legend?: ReactNode;
  readonly metric?: ReactNode;
  readonly segmentValueFormat?: ChartValueFormat;
  readonly summaryVisible?: boolean;
  readonly title: string;
  readonly totalLabel: string;
  readonly totalValueFormat?: ChartValueFormat;
}

const DONUT_SUMMARY_SERIES = [
  {
    color: "violet",
    dataKey: "value",
    label: "Value",
    valueFormat: "count",
  },
] as const satisfies readonly ChartSeries<DonutChartSegment>[];

export function DonutChart({
  actions,
  className,
  data,
  description,
  height = "standard",
  legend,
  metric,
  segmentValueFormat = "count",
  summaryVisible = false,
  title,
  totalLabel,
  totalValueFormat = "count",
}: DonutChartProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const animationActive = !prefersReducedMotion;
  const chartData = data.filter((segment) => Number.isFinite(segment.value) && segment.value >= 0);
  const total = chartData.reduce((sum, segment) => sum + segment.value, 0);
  const summarySeries = DONUT_SUMMARY_SERIES.map((item) => ({
    ...item,
    valueFormat: segmentValueFormat,
  }));

  return (
    <ChartFrame
      actions={actions}
      className={className}
      description={description}
      height={height}
      isEmpty={chartData.length === 0 || total === 0}
      metric={metric}
      title={title}
      legend={
        legend ?? (
          <ChartLegend
            items={chartData.map((segment) => ({
              color: segment.color,
              label: segment.label,
              marker: "segment",
              value: formatChartValue(segment.value, segmentValueFormat),
            }))}
          />
        )
      }
      summary={
        <ChartSummary
          data={chartData}
          label={`${title} segment summary. ${formatChartValue(total, totalValueFormat)} ${totalLabel} total.`}
          labelHeading="Segment"
          labelKey="label"
          series={summarySeries}
          visible={summaryVisible}
        />
      }
      summaryVisible={summaryVisible}
    >
      <div
        className="chart-canvas chart-canvas--donut"
        data-animation-active={String(animationActive)}
      >
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <PieChart accessibilityLayer={false}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius="58%"
              outerRadius="82%"
              paddingAngle={1}
              stroke="var(--color-surface-primary)"
              strokeWidth={2}
              isAnimationActive={animationActive}
              animationDuration={animationActive ? 360 : 0}
            >
              {chartData.map((segment) => (
                <Cell key={segment.id} fill={getChartColor(segment.color)} />
              ))}
            </Pie>
            <text x="50%" y="47%" textAnchor="middle" className="chart-donut-total">
              {formatChartValue(total, totalValueFormat)}
            </text>
            <text x="50%" y="57%" textAnchor="middle" className="chart-donut-label">
              {totalLabel}
            </text>
            <Tooltip
              allowEscapeViewBox={{ x: false, y: false }}
              isAnimationActive={animationActive}
              shared={false}
              wrapperStyle={{ maxWidth: "min(220px, calc(100% - 16px))", outline: "none" }}
              content={({ active, payload }) => (
                <ChartTooltip<DonutChartSegment>
                  active={active}
                  payload={payload}
                  fallbackValueFormat={segmentValueFormat}
                />
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  );
}
