import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { TrendTone } from "@/types/dashboard";
import { TrendBadge } from "./trend-badge";

describe("TrendBadge", () => {
  it.each([
    ["positive", "+8.4%", "ui-badge--success"],
    ["negative", "-2.1%", "ui-badge--error"],
    ["improvement", "-0.43 pp", "ui-badge--success"],
    ["neutral", "86 ending", "ui-badge--neutral"],
  ] satisfies ReadonlyArray<
    readonly [TrendTone, string, string]
  >)("renders readable %s trend text with its explicit semantic treatment", (tone, label, expectedClass) => {
    render(<TrendBadge tone={tone} label={label} />);

    const badge = screen.getByText(label).closest(".dashboard-trend-badge");
    expect(badge).toHaveClass(expectedClass, `dashboard-trend-badge--${tone}`);
  });

  it("remains non-interactive", () => {
    render(<TrendBadge tone="positive" label="+5.2%" />);

    const badge = screen.getByText("+5.2%").closest(".dashboard-trend-badge");
    expect(badge).not.toHaveAttribute("role", "button");
    expect(badge).not.toHaveAttribute("tabindex");
  });
});
