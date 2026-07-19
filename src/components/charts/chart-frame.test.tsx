import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChartFrame } from "./chart-frame";
import { ChartLegend } from "./chart-legend";

describe("ChartFrame", () => {
  it("connects the title, description, visualization, and textual summary", () => {
    render(
      <ChartFrame
        title="Revenue Overview"
        description="Gross revenue for the selected period"
        summary={<p>Current period totals $112,480.</p>}
      >
        <svg aria-hidden="true" />
      </ChartFrame>,
    );

    const heading = screen.getByRole("heading", { level: 2, name: "Revenue Overview" });
    const description = screen.getByText("Gross revenue for the selected period");
    const summary = screen.getByText("Current period totals $112,480.");
    const visualization = screen.getByRole("img", { name: "Revenue Overview" });

    expect(screen.getByRole("figure", { name: "Revenue Overview" })).toBeInTheDocument();
    expect(visualization).toHaveAttribute("aria-labelledby", heading.id);
    expect(visualization.getAttribute("aria-describedby")).toContain(description.id);
    expect(visualization.getAttribute("aria-describedby")).toContain(summary.parentElement?.id);
  });

  it("renders a stable empty state without an anonymous chart surface", () => {
    render(
      <ChartFrame title="Customer Growth" isEmpty summary={<p>No weekly values.</p>}>
        <svg />
      </ChartFrame>,
    );

    expect(screen.getByRole("status")).toHaveTextContent("No chart data available.");
    expect(screen.queryByRole("img", { name: "Customer Growth" })).not.toBeInTheDocument();
    expect(screen.getByText("No weekly values.")).toBeInTheDocument();
  });
});

describe("ChartLegend", () => {
  it("keeps readable labels and values in the supplied deterministic order", () => {
    render(
      <ChartLegend
        items={[
          { color: "violet", label: "Current period", marker: "line", value: "$112,480" },
          {
            color: "slate",
            label: "Previous period",
            marker: "dashed-line",
            value: "$102,630",
          },
        ]}
      />,
    );

    const legend = screen.getByRole("list", { name: "Chart legend" });
    const items = within(legend).getAllByRole("listitem");

    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Current period$112,480");
    expect(items[1]).toHaveTextContent("Previous period$102,630");
  });
});
