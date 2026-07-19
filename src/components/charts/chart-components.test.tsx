import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PLAN_PERFORMANCE } from "@/data/mock/plans";
import { CUSTOMER_GROWTH_SERIES, REVENUE_SERIES } from "@/data/mock/revenue";
import { AreaTrendChart } from "./area-trend-chart";
import { ChartSummary } from "./chart-summary";
import { DonutChart } from "./donut-chart";
import { LineTrendChart } from "./line-trend-chart";
import type { ComparisonChartSeries, NonEmptyChartSeries } from "./chart-types";

const revenueSeries = [
  {
    color: "violet",
    dataKey: "currentRevenue",
    label: "Current period",
    valueFormat: "currency",
  },
  {
    color: "slate",
    dataKey: "previousRevenue",
    label: "Previous period",
    marker: "dashed-line",
    valueFormat: "currency",
  },
] as const satisfies ComparisonChartSeries<(typeof REVENUE_SERIES)[number]>;

const growthSeries = [
  {
    color: "violet",
    dataKey: "newPaidSubscriptions",
    label: "New subscriptions",
    valueFormat: "count",
  },
  {
    color: "danger",
    dataKey: "churnedSubscriptions",
    label: "Churned",
    valueFormat: "count",
  },
] as const satisfies NonEmptyChartSeries<(typeof CUSTOMER_GROWTH_SERIES)[number]>;

describe("chart components", () => {
  it("renders a donut total, segment labels, values, and accessible segment summary", () => {
    const segments = PLAN_PERFORMANCE.map((item) => ({
      color: item.plan.colorKey,
      id: item.plan.id,
      label: item.plan.name,
      value: item.activeSubscriptions,
    }));

    render(
      <DonutChart
        title="Subscriptions by Plan"
        description="Active subscriptions and monthly value"
        data={segments}
        totalLabel="Active"
      />,
    );

    const legend = screen.getByRole("list", { name: "Chart legend" });
    expect(
      within(legend)
        .getAllByRole("listitem")
        .map((item) => item.textContent),
    ).toEqual(["Starter1,326", "Growth900", "Pro453", "Teams167"]);
    expect(
      screen.getByText("Subscriptions by Plan segment summary. 2,846 Active total."),
    ).toBeInTheDocument();
    expect(screen.getAllByText("2,846").length).toBeGreaterThan(0);
  });

  it("exposes approved chart data without NaN or undefined output", () => {
    const { container } = render(
      <>
        <ChartSummary
          data={REVENUE_SERIES}
          label="Revenue data"
          labelKey="label"
          series={revenueSeries}
        />
        <ChartSummary
          data={CUSTOMER_GROWTH_SERIES}
          label="Growth data"
          labelKey="label"
          series={growthSeries}
        />
      </>,
    );

    expect(container).toHaveTextContent("$24,860");
    expect(container).toHaveTextContent("53");
    expect(container.textContent).not.toMatch(/NaN|undefined/);
  });

  it("renders a typed empty-data state instead of a broken chart", () => {
    render(
      <LineTrendChart title="Customer Growth" data={[]} labelKey="label" series={growthSeries} />,
    );

    expect(screen.getByRole("status")).toHaveTextContent("No chart data available.");
    expect(screen.getByText("Customer Growth data summary")).toBeInTheDocument();
  });

  it("applies reduced-motion configuration to a full interactive chart", () => {
    vi.spyOn(window, "matchMedia").mockImplementation(
      (query: string): MediaQueryList => ({
        addEventListener: vi.fn(),
        addListener: vi.fn(),
        dispatchEvent: vi.fn(),
        matches: true,
        media: query,
        onchange: null,
        removeEventListener: vi.fn(),
        removeListener: vi.fn(),
      }),
    );

    const { container } = render(
      <AreaTrendChart
        title="Revenue Overview"
        data={REVENUE_SERIES}
        labelKey="label"
        series={revenueSeries}
      />,
    );

    expect(container.querySelector(".chart-canvas")).toHaveAttribute(
      "data-animation-active",
      "false",
    );
    expect(screen.getByText("Revenue Overview data summary")).toBeInTheDocument();
  });
});
