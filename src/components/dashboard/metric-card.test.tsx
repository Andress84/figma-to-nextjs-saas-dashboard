import { render, screen } from "@testing-library/react";
import { DollarSign } from "lucide-react";
import { describe, expect, it } from "vitest";
import { MetricCard } from "./metric-card";
import { TrendBadge } from "./trend-badge";

describe("MetricCard", () => {
  it("renders its formatted value, trend, supporting text, and highlighted treatment", () => {
    render(
      <MetricCard
        label="Monthly Recurring Revenue"
        value="$84,720"
        icon={<DollarSign />}
        trend={<TrendBadge tone="positive" label="+8.4%" />}
        supportingText="+$6,580 net increase"
        highlighted
      />,
    );

    expect(
      screen.getByRole("heading", { level: 3, name: "Monthly Recurring Revenue" }),
    ).toBeInTheDocument();
    expect(screen.getByText("$84,720")).toHaveClass("dashboard-metric-card-value");
    expect(screen.getByText("+8.4%")).toBeVisible();
    expect(screen.getByText("+$6,580 net increase")).toBeVisible();

    const card = screen.getByText("$84,720").closest(".dashboard-metric-card");
    expect(card).toHaveClass("ui-card--highlighted");
    expect(card).not.toHaveAttribute("tabindex");
    expect(card).not.toHaveAttribute("role", "button");
  });

  it("renders an optional sparkline slot without hiding textual information", () => {
    render(
      <MetricCard
        label="Active Subscriptions"
        value="2,846"
        supportingText="+141 net subscriptions"
        sparkline={<span data-testid="sparkline">Trend visualization</span>}
      />,
    );

    expect(screen.getByText("2,846")).toBeVisible();
    expect(screen.getByText("+141 net subscriptions")).toBeVisible();
    expect(screen.getByTestId("sparkline")).toBeVisible();
  });
});
