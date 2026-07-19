import type { ChartColorKey, ChartSeriesMarker } from "./chart-types";

export interface ChartLegendItem {
  readonly color: ChartColorKey;
  readonly label: string;
  readonly marker?: ChartSeriesMarker;
  readonly value?: string;
}

export interface ChartLegendProps {
  readonly items: readonly ChartLegendItem[];
  readonly label?: string;
}

export function ChartLegend({ items, label = "Chart legend" }: ChartLegendProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <ul className="chart-legend" aria-label={label}>
      {items.map((item) => (
        <li key={item.label} className="chart-legend-item">
          <span
            className="chart-series-marker"
            data-color={item.color}
            data-marker={item.marker ?? "dot"}
            aria-hidden="true"
          />
          <span className="chart-legend-label">{item.label}</span>
          {item.value ? <span className="chart-legend-value">{item.value}</span> : null}
        </li>
      ))}
    </ul>
  );
}
