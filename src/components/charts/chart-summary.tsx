import type { ChartSeries } from "./chart-types";
import { formatChartValue, readChartLabel, readChartValue } from "./chart-utils";

export interface ChartSummaryProps<TData extends object> {
  readonly data: readonly TData[];
  readonly label: string;
  readonly labelHeading?: string;
  readonly labelKey: Extract<keyof TData, string>;
  readonly series: readonly ChartSeries<TData>[];
  readonly visible?: boolean;
}

export function ChartSummary<TData extends object>({
  data,
  label,
  labelHeading = "Period",
  labelKey,
  series,
  visible = false,
}: ChartSummaryProps<TData>) {
  return (
    <div className={visible ? "chart-summary" : "sr-only"} data-chart-summary="true">
      <table>
        <caption>{label}</caption>
        <thead>
          <tr>
            <th scope="col">{labelHeading}</th>
            {series.map((item) => (
              <th scope="col" key={item.dataKey}>
                {item.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((datum, index) => {
            const rowLabel = readChartLabel(datum, labelKey);

            return (
              <tr key={`${rowLabel}-${index}`}>
                <th scope="row">{rowLabel}</th>
                {series.map((item) => (
                  <td key={item.dataKey}>
                    {formatChartValue(readChartValue(datum, item.dataKey), item.valueFormat)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
