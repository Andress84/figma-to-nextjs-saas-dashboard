"use client";

import type { ReactNode } from "react";
import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartFrame } from "./chart-frame";
import { ChartLegend } from "./chart-legend";
import { ChartSummary } from "./chart-summary";
import { ChartTooltip } from "./chart-tooltip";
import type { ChartTooltipTrend, NonEmptyChartSeries } from "./chart-types";
import {
  formatChartAxisValue,
  formatChartValue,
  getChartColor,
  hasChartData,
  resolveSeriesMarker,
} from "./chart-utils";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

export interface LineTrendChartProps<TData extends object> {
  readonly actions?: ReactNode;
  readonly className?: string;
  readonly data: readonly TData[];
  readonly description?: string;
  readonly height?: "compact" | "standard" | "large";
  readonly labelHeading?: string;
  readonly labelKey: Extract<keyof TData, string>;
  readonly metric?: ReactNode;
  readonly series: NonEmptyChartSeries<TData>;
  readonly showPoints?: boolean;
  readonly summaryVisible?: boolean;
  readonly title: string;
  readonly tooltipTrend?: ChartTooltipTrend<TData>;
}

export function LineTrendChart<TData extends object>({
  actions,
  className,
  data,
  description,
  height = "standard",
  labelHeading,
  labelKey,
  metric,
  series,
  showPoints = true,
  summaryVisible = false,
  title,
  tooltipTrend,
}: LineTrendChartProps<TData>) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const animationActive = !prefersReducedMotion;
  const chartData = data.map((datum) => datum);
  const isEmpty = !hasChartData(data, series);
  const primaryFormat = series[0].valueFormat;

  return (
    <ChartFrame
      actions={actions}
      className={className}
      description={description}
      height={height}
      isEmpty={isEmpty}
      metric={metric}
      title={title}
      legend={
        <ChartLegend
          items={series.map((item) => ({
            color: item.color,
            label: item.label,
            marker: resolveSeriesMarker(item, "line"),
            value:
              item.legendValue === undefined
                ? undefined
                : formatChartValue(item.legendValue, item.valueFormat),
          }))}
        />
      }
      summary={
        <ChartSummary
          data={data}
          label={`${title} data summary`}
          labelHeading={labelHeading}
          labelKey={labelKey}
          series={series}
          visible={summaryVisible}
        />
      }
    >
      <div className="chart-canvas" data-animation-active={String(animationActive)}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <RechartsLineChart
            data={chartData}
            accessibilityLayer={false}
            margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
          >
            <CartesianGrid vertical={false} stroke="var(--color-chart-grid)" />
            <XAxis
              dataKey={labelKey}
              axisLine={false}
              tickLine={false}
              minTickGap={24}
              tickMargin={12}
              tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              width={48}
              tickMargin={8}
              tickFormatter={(value: number) => formatChartAxisValue(value, primaryFormat)}
              tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
            />
            <Tooltip
              allowEscapeViewBox={{ x: false, y: false }}
              cursor={{ stroke: "var(--color-border-strong)", strokeDasharray: "3 4" }}
              isAnimationActive={animationActive}
              wrapperStyle={{ maxWidth: "min(240px, calc(100% - 16px))", outline: "none" }}
              content={({ active, label, payload }) => (
                <ChartTooltip
                  active={active}
                  label={label}
                  payload={payload}
                  series={series}
                  trend={tooltipTrend}
                />
              )}
            />
            {series.map((item) => (
              <Line
                key={item.dataKey}
                type="monotone"
                dataKey={item.dataKey}
                name={item.label}
                stroke={getChartColor(item.color)}
                strokeWidth={2.25}
                strokeDasharray={item.marker === "dashed-line" ? "5 6" : undefined}
                dot={showPoints ? { r: 3, strokeWidth: 0 } : false}
                activeDot={{ r: 5, strokeWidth: 2, fill: "var(--color-surface-primary)" }}
                isAnimationActive={animationActive}
                animationDuration={animationActive ? 360 : 0}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  );
}
