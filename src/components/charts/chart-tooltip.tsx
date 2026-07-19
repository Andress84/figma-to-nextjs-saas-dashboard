import type { ChartSeries, ChartTooltipTrend, ChartValueFormat } from "./chart-types";
import { formatChartValue, readUnknownRecordValue } from "./chart-utils";

export interface ChartTooltipPayloadEntry {
  readonly color?: string;
  readonly dataKey?: unknown;
  readonly name?: number | string;
  readonly payload?: unknown;
  readonly value?: number | string | readonly (number | string)[];
}

export interface ChartTooltipProps<TData extends object> {
  readonly active?: boolean;
  readonly fallbackValueFormat?: ChartValueFormat;
  readonly label?: number | string;
  readonly payload?: readonly ChartTooltipPayloadEntry[];
  readonly series?: readonly ChartSeries<TData>[];
  readonly trend?: ChartTooltipTrend<TData>;
}

function findPayloadEntry(payload: readonly ChartTooltipPayloadEntry[], dataKey: number | string) {
  return payload.find((entry) => String(entry.dataKey) === String(dataKey));
}

export function ChartTooltip<TData extends object>({
  active = false,
  fallbackValueFormat = "number",
  label,
  payload = [],
  series = [],
  trend,
}: ChartTooltipProps<TData>) {
  if (!active || payload.length === 0) {
    return null;
  }

  const orderedEntries =
    series.length > 0
      ? series.flatMap((item) => {
          const entry = findPayloadEntry(payload, item.dataKey);
          return entry ? [{ entry, item }] : [];
        })
      : payload.map((entry) => ({ entry, item: null }));
  const tooltipLabel = label ?? orderedEntries[0]?.entry.name ?? "Active data point";
  const sourcePayload = orderedEntries[0]?.entry.payload;
  const trendValue = trend ? readUnknownRecordValue(sourcePayload, String(trend.dataKey)) : null;

  return (
    <div className="chart-tooltip" role="status" aria-live="polite">
      <p className="chart-tooltip-label">{tooltipLabel}</p>
      <dl className="chart-tooltip-values">
        {orderedEntries.map(({ entry, item }, index) => {
          const entryLabel = item?.label ?? entry.name ?? `Series ${index + 1}`;
          const entryFormat = item?.valueFormat ?? fallbackValueFormat;
          const entryColor = item?.color;

          return (
            <div className="chart-tooltip-value" key={`${entryLabel}-${String(entry.dataKey)}`}>
              <dt>
                {entryColor ? (
                  <span
                    className="chart-series-marker"
                    data-color={entryColor}
                    data-marker={item?.marker ?? "dot"}
                    aria-hidden="true"
                  />
                ) : null}
                {entryLabel}
              </dt>
              <dd>{formatChartValue(entry.value, entryFormat)}</dd>
            </div>
          );
        })}
      </dl>
      {trend && trendValue !== null ? (
        <p className="chart-tooltip-trend" data-tone={trend.tone ?? "neutral"}>
          {trend.label}: {formatChartValue(trendValue, trend.valueFormat)}
        </p>
      ) : null}
    </div>
  );
}
