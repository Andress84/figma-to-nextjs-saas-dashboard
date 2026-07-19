export type ChartColorKey =
  | "violet"
  | "lavender"
  | "blue"
  | "slate"
  | "success"
  | "warning"
  | "danger"
  | "information";

export type ChartValueFormat =
  | "currency"
  | "transaction-currency"
  | "count"
  | "percent"
  | "signed-percent"
  | "churn-percent"
  | "percentage-points"
  | "number";

export type ChartSeriesMarker = "line" | "dashed-line" | "dot" | "bar" | "segment";

export interface ChartSeries<TData extends object> {
  readonly color: ChartColorKey;
  readonly dataKey: Extract<keyof TData, string>;
  readonly label: string;
  readonly legendValue?: number;
  readonly marker?: ChartSeriesMarker;
  readonly valueFormat: ChartValueFormat;
}

export type NonEmptyChartSeries<TData extends object> = readonly [
  ChartSeries<TData>,
  ...ChartSeries<TData>[],
];

export type ComparisonChartSeries<TData extends object> = readonly [
  ChartSeries<TData>,
  ChartSeries<TData>,
  ...ChartSeries<TData>[],
];

export interface ChartTooltipTrend<TData extends object> {
  readonly dataKey: Extract<keyof TData, string>;
  readonly label: string;
  readonly tone?: "positive" | "negative" | "neutral";
  readonly valueFormat: Extract<
    ChartValueFormat,
    "percent" | "signed-percent" | "percentage-points" | "number"
  >;
}

export interface DonutChartSegment {
  readonly color: ChartColorKey;
  readonly id: string;
  readonly label: string;
  readonly value: number;
}
