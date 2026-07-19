"use client";

import type { ReactNode } from "react";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
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

export interface GroupedBarChartProps<TData extends object> {
  readonly actions?: ReactNode;
  readonly className?: string;
  readonly data: readonly TData[];
  readonly description?: string;
  readonly footer?: ReactNode;
  readonly height?: "compact" | "standard" | "large";
  readonly labelHeading?: string;
  readonly labelKey: Extract<keyof TData, string>;
  readonly metric?: ReactNode;
  readonly series: ComparisonChartSeries<TData>;
  readonly summaryVisible?: boolean;
  readonly title: string;
  readonly tooltipTrend?: ChartTooltipTrend<TData>;
}

export function GroupedBarChart<TData extends object>({
  actions,
  className,
  data,
  description,
  footer,
  height = "standard",
  labelHeading,
  labelKey,
  metric,
  series,
  summaryVisible = false,
  title,
  tooltipTrend,
}: GroupedBarChartProps<TData>) {
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
      footer={footer}
      height={height}
      isEmpty={isEmpty}
      metric={metric}
      title={title}
      legend={
        <ChartLegend
          items={series.map((item) => ({
            color: item.color,
            label: item.label,
            marker: resolveSeriesMarker(item, "bar"),
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
          <RechartsBarChart
            data={chartData}
            accessibilityLayer={false}
            barCategoryGap="28%"
            barGap={4}
            margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
          >
            <CartesianGrid vertical={false} stroke="var(--color-chart-grid)" />
            <XAxis
              dataKey={labelKey}
              axisLine={false}
              tickLine={false}
              minTickGap={20}
              tickMargin={12}
              tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              width={40}
              tickMargin={8}
              tickFormatter={(value: number) => formatChartAxisValue(value, primaryFormat)}
              tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
            />
            <Tooltip
              allowEscapeViewBox={{ x: false, y: false }}
              cursor={{ fill: "var(--color-surface-selected)" }}
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
              <Bar
                key={item.dataKey}
                dataKey={item.dataKey}
                name={item.label}
                fill={getChartColor(item.color)}
                radius={[4, 4, 0, 0]}
                isAnimationActive={animationActive}
                animationDuration={animationActive ? 320 : 0}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  );
}
