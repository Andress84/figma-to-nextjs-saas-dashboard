import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ReportingPeriodPopover } from "./reporting-period-popover";

describe("ReportingPeriodPopover", () => {
  it("renders the approved fixed range and both deterministic calendar months", async () => {
    const user = userEvent.setup();
    render(<ReportingPeriodPopover />);
    const trigger = screen.getByRole("button", {
      name: "Reporting period: Jun 15 – Jul 14, 2026",
    });

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);

    const dialog = screen.getByRole("dialog", { name: "Reporting period" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(within(dialog).getByText("Current approved range: Jun 15 – Jul 14, 2026")).toBeVisible();
    expect(within(dialog).getByLabelText("Last 30 days preset, active")).toBeVisible();
    expect(within(dialog).getByRole("heading", { level: 3, name: "June 2026" })).toBeVisible();
    expect(within(dialog).getByRole("heading", { level: 3, name: "July 2026" })).toBeVisible();
    expect(within(dialog).getByText("Selected range: Jun 15 – Jul 14, 2026")).toBeVisible();
    expect(within(dialog).getByText("Static demo snapshot")).toBeVisible();

    const rangeStart = dialog.querySelector('time[datetime="2026-06-15"]');
    const rangeEnd = dialog.querySelector('time[datetime="2026-07-14"]');
    expect(rangeStart).toHaveAttribute("data-selected", "true");
    expect(rangeStart).toHaveAttribute("data-range-start", "true");
    expect(rangeStart).toHaveAccessibleName(/start of selected reporting period/);
    expect(rangeEnd).toHaveAttribute("data-selected", "true");
    expect(rangeEnd).toHaveAttribute("data-range-end", "true");
    expect(rangeEnd).toHaveAccessibleName(/end of selected reporting period/);
  });

  it("supports fixed mobile month navigation without changing the approved range", async () => {
    const user = userEvent.setup();
    render(<ReportingPeriodPopover />);
    await user.click(screen.getByRole("button", { name: /Reporting period:/ }));
    const dialog = screen.getByRole("dialog", { name: "Reporting period" });
    const june = within(dialog)
      .getByRole("heading", { level: 3, name: "June 2026" })
      .closest("section");
    const july = within(dialog)
      .getByRole("heading", { level: 3, name: "July 2026" })
      .closest("section");

    expect(june).toHaveAttribute("data-mobile-active", "true");
    expect(july).toHaveAttribute("data-mobile-active", "false");
    await user.click(within(dialog).getByRole("button", { name: "Show next month" }));
    expect(june).toHaveAttribute("data-mobile-active", "false");
    expect(july).toHaveAttribute("data-mobile-active", "true");
    expect(within(dialog).getByText("Selected range: Jun 15 – Jul 14, 2026")).toBeVisible();
  });

  it("dismisses with Escape and restores focus to its trigger", async () => {
    const user = userEvent.setup();
    render(<ReportingPeriodPopover />);
    const trigger = screen.getByRole("button", { name: /Reporting period:/ });

    await user.click(trigger);
    expect(screen.getByRole("heading", { level: 2, name: "Reporting period" })).toHaveFocus();
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog", { name: "Reporting period" })).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("dismisses on outside pointer interaction and restores trigger focus", async () => {
    const user = userEvent.setup();
    render(
      <>
        <ReportingPeriodPopover />
        <h1>Outside content</h1>
      </>,
    );
    const trigger = screen.getByRole("button", { name: /Reporting period:/ });

    await user.click(trigger);
    await user.click(screen.getByRole("heading", { level: 1, name: "Outside content" }));

    expect(screen.queryByRole("dialog", { name: "Reporting period" })).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("uses no runtime current-date or random generation", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src",
        "components",
        "dashboard",
        "reporting-period",
        "reporting-period-popover.tsx",
      ),
      "utf8",
    );

    expect(source).not.toMatch(/Date\.now|Math\.random|new Date\s*\(|randomUUID/);
  });
});
