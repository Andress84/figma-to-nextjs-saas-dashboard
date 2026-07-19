"use client";

import { useId, type ReactNode } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartFrame } from "./chart-frame";
import { ChartLegend } from "./chart-legend";
import { ChartSummary } from "./chart-summary";
import { ChartTooltip } from "./chart-tooltip";
import type { ChartTooltipTrend, ComparisonChartSeries } from "./chart-types";
import {
  formatChartAxisValue,
  formatChartValue,
  getChartColor,
  hasChartData,
  resolveSeriesMarker,
} from "./chart-utils";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

export interface AreaTrendChartProps<TData extends object> {
  readonly actions?: ReactNode;
  readonly className?: string;
  readonly data: readonly TData[];
  readonly description?: string;
  readonly height?: "compact" | "standard" | "large";
  readonly labelHeading?: string;
  readonly labelKey: Extract<keyof TData, string>;
  readonly metric?: ReactNode;
  readonly series: ComparisonChartSeries<TData>;
  readonly summaryVisible?: boolean;
  readonly title: string;
  readonly tooltipTrend?: ChartTooltipTrend<TData>;
}

export function AreaTrendChart<TData extends object>({
  actions,
  className,
  data,
  description,
  height = "large",
  labelHeading,
  labelKey,
  metric,
  series,
  summaryVisible = false,
  title,
  tooltipTrend,
}: AreaTrendChartProps<TData>) {
  const gradientId = `${useId().replaceAll(":", "")}-area-fill`;
  const prefersReducedMotion = usePrefersReducedMotion();
  const animationActive = !prefersReducedMotion;
  const [primarySeries, ...comparisonSeries] = series;
  const chartData = data.map((datum) => datum);
  const isEmpty = !hasChartData(data, series);

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
          items={series.map((item, index) => ({
            color: item.color,
            label: item.label,
            marker: resolveSeriesMarker(item, index === 0 ? "line" : "dashed-line"),
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
      summaryVisible={summaryVisible}
    >
      <div className="chart-canvas" data-animation-active={String(animationActive)}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <AreaChart
            data={chartData}
            accessibilityLayer={false}
            margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={getChartColor(primarySeries.color)}
                  stopOpacity={0.28}
                />
                <stop
                  offset="100%"
                  stopColor={getChartColor(primarySeries.color)}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
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
              tickFormatter={(value: number) =>
                formatChartAxisValue(value, primarySeries.valueFormat)
              }
              tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
            />
            <Tooltip
              allowEscapeViewBox={{ x: false, y: false }}
              cursor={{ stroke: "var(--color-border-strong)", strokeDasharray: "3 4" }}
              isAnimationActive={animationActive}
              itemSorter="dataKey"
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
            <Area
              type="monotone"
              dataKey={primarySeries.dataKey}
              name={primarySeries.label}
              stroke={getChartColor(primarySeries.color)}
              strokeWidth={2.5}
              fill={`url(#${gradientId})`}
              activeDot={{ r: 5, strokeWidth: 2, fill: "var(--color-surface-primary)" }}
              isAnimationActive={animationActive}
              animationDuration={animationActive ? 360 : 0}
            />
            {comparisonSeries.map((item) => (
              <Line
                key={item.dataKey}
                type="monotone"
                dataKey={item.dataKey}
                name={item.label}
                stroke={getChartColor(item.color)}
                strokeWidth={2}
                strokeDasharray="5 6"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, fill: "var(--color-surface-primary)" }}
                isAnimationActive={animationActive}
                animationDuration={animationActive ? 360 : 0}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  );
}
