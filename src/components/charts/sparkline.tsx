"use client";

import { Line, LineChart, ResponsiveContainer } from "recharts";
import type { ChartColorKey } from "./chart-types";
import { getChartColor } from "./chart-utils";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

type SparklineTone = "violet" | "neutral" | "success" | "warning" | "danger";

interface SparklineBaseProps {
  readonly data: readonly number[];
  readonly size?: "compact" | "default";
  readonly tone?: SparklineTone;
}

type SparklineAccessibilityProps =
  | {
      readonly decorative?: true;
      readonly label?: never;
    }
  | {
      readonly decorative: false;
      readonly label: string;
    };

export type SparklineProps = SparklineBaseProps & SparklineAccessibilityProps;

const SPARKLINE_COLORS = {
  violet: "violet",
  neutral: "slate",
  success: "success",
  warning: "warning",
  danger: "danger",
} as const satisfies Record<SparklineTone, ChartColorKey>;

export function Sparkline({
  data,
  decorative = true,
  label,
  size = "default",
  tone = "violet",
}: SparklineProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const animationActive = !prefersReducedMotion;
  const chartData = data
    .filter((value) => Number.isFinite(value))
    .map((value, index) => ({ index, value }));

  return (
    <span
      className="chart-sparkline"
      data-animation-active={String(animationActive)}
      data-size={size}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : label}
      role={decorative ? undefined : "img"}
    >
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <LineChart data={chartData} accessibilityLayer={false}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={getChartColor(SPARKLINE_COLORS[tone])}
              strokeWidth={2}
              dot={false}
              isAnimationActive={animationActive}
              animationDuration={animationActive ? 180 : 0}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : null}
    </span>
  );
}
