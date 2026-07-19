import {
  formatChurnPercent,
  formatCount,
  formatCurrency,
  formatPercentagePoints,
  formatPercent,
  formatSignedPercent,
  formatTransactionAmount,
} from "@/lib/formatters";
import type {
  ChartColorKey,
  ChartSeries,
  ChartSeriesMarker,
  ChartValueFormat,
} from "./chart-types";

const CHART_COLOR_TOKENS = {
  violet: "var(--color-chart-current)",
  lavender: "var(--color-accent-lavender)",
  blue: "var(--color-accent-blue)",
  slate: "var(--color-chart-comparison)",
  success: "var(--color-success)",
  warning: "var(--color-warning)",
  danger: "var(--color-chart-churn)",
  information: "var(--color-information)",
} as const satisfies Record<ChartColorKey, string>;

export function getChartColor(color: ChartColorKey) {
  return CHART_COLOR_TOKENS[color];
}

export function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function readChartValue<TData extends object>(
  datum: TData,
  dataKey: Extract<keyof TData, string>,
) {
  const value: unknown = datum[dataKey];
  return isFiniteNumber(value) ? value : null;
}

export function readChartLabel<TData extends object>(
  datum: TData,
  labelKey: Extract<keyof TData, string>,
) {
  const label: unknown = datum[labelKey];
  return typeof label === "string" || typeof label === "number" ? String(label) : "Unlabelled";
}

export function formatChartValue(value: unknown, format: ChartValueFormat) {
  if (!isFiniteNumber(value)) {
    return "Not available";
  }

  switch (format) {
    case "currency":
      return formatCurrency(value);
    case "transaction-currency":
      return formatTransactionAmount(value);
    case "count":
      return formatCount(value);
    case "percent":
      return formatPercent(value);
    case "signed-percent":
      return formatSignedPercent(value);
    case "churn-percent":
      return formatChurnPercent(value);
    case "percentage-points":
      return formatPercentagePoints(value);
    case "number":
      return String(value);
  }
}

export function formatChartAxisValue(value: number, format: ChartValueFormat) {
  if (!Number.isFinite(value)) {
    return "—";
  }

  if (format === "currency" || format === "transaction-currency") {
    if (Math.abs(value) >= 1_000) {
      return `$${Math.round(value / 1_000)}k`;
    }

    return formatCurrency(value);
  }

  if (format === "percent" || format === "signed-percent") {
    return formatPercent(value);
  }

  if (format === "churn-percent" || format === "percentage-points") {
    return `${value.toFixed(value % 1 === 0 ? 0 : 1)}%`;
  }

  return formatCount(value);
}

export function hasChartData<TData extends object>(
  data: readonly TData[],
  series: readonly ChartSeries<TData>[],
) {
  return data.some((datum) => series.some((item) => readChartValue(datum, item.dataKey) !== null));
}

export function resolveSeriesMarker<TData extends object>(
  series: ChartSeries<TData>,
  fallback: ChartSeriesMarker,
) {
  return series.marker ?? fallback;
}

export function readUnknownRecordValue(value: unknown, key: string) {
  if (typeof value !== "object" || value === null || !(key in value)) {
    return null;
  }

  return (value as Record<string, unknown>)[key];
}
