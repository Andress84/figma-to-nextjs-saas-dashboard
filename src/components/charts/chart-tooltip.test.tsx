import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChartTooltip } from "./chart-tooltip";
import type { ComparisonChartSeries } from "./chart-types";

interface RevenueTooltipDatum {
  readonly change: number;
  readonly current: number;
  readonly label: string;
  readonly previous: number;
}

const revenueSeries = [
  {
    color: "violet",
    dataKey: "current",
    label: "Current period",
    valueFormat: "currency",
  },
  {
    color: "slate",
    dataKey: "previous",
    label: "Previous period",
    valueFormat: "currency",
  },
] as const satisfies ComparisonChartSeries<RevenueTooltipDatum>;

describe("ChartTooltip", () => {
  it("renders the active payload using shared currency and percentage formatting", () => {
    const activeDatum: RevenueTooltipDatum = {
      change: 9.4,
      current: 107_220,
      label: "Jul 6–12",
      previous: 97_970,
    };

    render(
      <ChartTooltip
        active
        label={activeDatum.label}
        payload={[
          {
            dataKey: "previous",
            name: "Previous period",
            payload: activeDatum,
            value: activeDatum.previous,
          },
          {
            dataKey: "current",
            name: "Current period",
            payload: activeDatum,
            value: activeDatum.current,
          },
        ]}
        series={revenueSeries}
        trend={{
          dataKey: "change",
          label: "Period change",
          tone: "positive",
          valueFormat: "signed-percent",
        }}
      />,
    );

    expect(screen.getByText("Jul 6–12")).toBeVisible();
    expect(screen.getByText("$107,220")).toBeVisible();
    expect(screen.getByText("$97,970")).toBeVisible();
    expect(screen.getByText("Period change: +9.4%")).toHaveAttribute("data-tone", "positive");
  });

  it("does not reserve layout content when inactive", () => {
    const { container } = render(
      <ChartTooltip active={false} payload={[]} series={revenueSeries} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
