import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PLAN_PERFORMANCE } from "@/data/mock/plans";
import { AnalyticsDashboard } from "./analytics-dashboard";
import {
  ANALYTICS_EXPORT_FILE_NAME,
  buildAnalyticsReportCsv,
  buildPlanPerformanceCsv,
  PLAN_PERFORMANCE_EXPORT_FILE_NAME,
} from "./analytics-export";

describe("AnalyticsDashboard", () => {
  it("renders the approved composition and canonical metric values", () => {
    render(<AnalyticsDashboard />);

    expect(screen.getByRole("heading", { level: 1, name: "Analytics" })).toBeVisible();
    const metrics = screen.getByRole("region", { name: "Analytics metrics" });
    expect(within(metrics).getAllByRole("heading", { level: 3 })).toHaveLength(4);
    expect(within(metrics).getByText("+8.4%")).toBeVisible();
    expect(within(metrics).getByText("$29.77")).toBeVisible();
    expect(within(metrics).getByText("+141")).toBeVisible();
    expect(within(metrics).getByText("3.84%")).toBeVisible();
    expect(screen.getByRole("figure", { name: "Revenue and MRR Trends" })).toBeVisible();
    expect(screen.getByRole("figure", { name: "Subscription Growth" })).toBeVisible();
    expect(screen.getByRole("figure", { name: "Churn and Retention" })).toBeVisible();
    expect(screen.getByRole("table", { name: /Plan performance by subscriber mix/ })).toBeVisible();
  });

  it("switches Revenue to MRR with keyboard radio semantics", async () => {
    const user = userEvent.setup();
    render(<AnalyticsDashboard />);
    const figure = screen.getByRole("figure", { name: "Revenue and MRR Trends" });
    const revenueOption = within(figure).getByRole("radio", { name: "Revenue" });
    const mrrOption = within(figure).getByRole("radio", { name: "MRR" });

    expect(revenueOption).toBeChecked();
    revenueOption.focus();
    await user.keyboard("{ArrowRight}");

    expect(mrrOption).toBeChecked();
    expect(within(figure).getAllByText("Current MRR").length).toBeGreaterThan(0);
    expect(within(figure).getAllByText("Previous MRR").length).toBeGreaterThan(0);
    expect(within(figure).getAllByText("$84,720")[0]).toBeVisible();
  });

  it("removes comparison series, legends, and summaries with a pressed button", async () => {
    const user = userEvent.setup();
    render(<AnalyticsDashboard />);
    const compare = screen.getByRole("button", { name: "Compare to previous period" });
    const revenueFigure = screen.getByRole("figure", { name: "Revenue and MRR Trends" });
    const churnFigure = screen.getByRole("figure", { name: "Churn and Retention" });

    expect(compare).toHaveAttribute("aria-pressed", "true");
    expect(within(revenueFigure).getAllByText("Previous revenue").length).toBeGreaterThan(0);
    expect(within(churnFigure).getAllByText("Previous churn rate").length).toBeGreaterThan(0);

    await user.click(compare);

    expect(compare).toHaveAttribute("aria-pressed", "false");
    expect(within(revenueFigure).queryByText("Previous revenue")).not.toBeInTheDocument();
    expect(within(churnFigure).queryByText("Previous churn rate")).not.toBeInTheDocument();
  });

  it("filters plan performance, exposes active state, and restores focus after Escape", async () => {
    const user = userEvent.setup();
    render(<AnalyticsDashboard />);
    const trigger = screen.getByRole("button", { name: "Filters" });

    await user.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Filter Analytics report" });
    await user.selectOptions(within(dialog).getByRole("combobox", { name: "Plan" }), "growth");

    expect(within(dialog).getByText("1 of 4 plans shown")).toBeVisible();
    expect(screen.getByRole("button", { name: "Filters (1)" })).toBeVisible();
    const table = screen.getByRole("table", { name: /Plan performance by subscriber mix/ });
    expect(within(table).getByRole("rowheader", { name: "Growth" })).toBeVisible();
    expect(within(table).queryByRole("rowheader", { name: "Starter" })).not.toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(dialog).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Filters (1)" })).toHaveFocus();
  });

  it("dismisses the filter popover on outside pointer interaction", async () => {
    const user = userEvent.setup();
    render(<AnalyticsDashboard />);
    const trigger = screen.getByRole("button", { name: "Filters" });

    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: "Filter Analytics report" })).toBeVisible();
    await user.click(screen.getByRole("heading", { level: 1, name: "Analytics" }));

    expect(
      screen.queryByRole("dialog", { name: "Filter Analytics report" }),
    ).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("builds deterministic report and plan CSV from visible canonical data", () => {
    const reportCsv = buildAnalyticsReportCsv({
      compareToPrevious: true,
      planPerformance: PLAN_PERFORMANCE,
      revenueView: "revenue",
    });
    const planCsv = buildPlanPerformanceCsv(PLAN_PERFORMANCE);

    expect(reportCsv).toContain('Revenue and MRR Trends,Gross revenue,Jun 15–21,"$24,860"');
    expect(reportCsv).toContain("Subscription Growth,Period totals");
    expect(reportCsv).toContain('Plan Performance,Teams,Selected period,"$16,533",167');
    expect(planCsv.split("\r\n")).toHaveLength(5);
    expect(planCsv).toContain("Plan,Price,Active,Share,MRR,MRR contribution,Churn,Trend");
    expect(planCsv).toContain('Growth,$29,900,31.6%,"$26,100",30.8%,3.6%,+7.0%');
  });

  it("downloads the visible report and announces successful export", async () => {
    const createObjectUrl = vi.fn(() => "blob:subtera-analytics");
    const revokeObjectUrl = vi.fn();
    Object.defineProperty(URL, "createObjectURL", { configurable: true, value: createObjectUrl });
    Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: revokeObjectUrl });
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);
    const user = userEvent.setup();
    render(<AnalyticsDashboard />);

    await user.click(screen.getByRole("button", { name: "Export report" }));

    expect(createObjectUrl).toHaveBeenCalledOnce();
    expect(revokeObjectUrl).toHaveBeenCalledWith("blob:subtera-analytics");
    expect(
      screen.getByText(`Downloaded ${ANALYTICS_EXPORT_FILE_NAME} with 4 visible plans.`),
    ).toBeInTheDocument();
  });

  it("exports visible plan data and exposes accessible chart summaries", async () => {
    const createObjectUrl = vi.fn(() => "blob:subtera-plans");
    Object.defineProperty(URL, "createObjectURL", { configurable: true, value: createObjectUrl });
    Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: vi.fn() });
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);
    const user = userEvent.setup();
    const { container } = render(<AnalyticsDashboard />);

    expect(container.querySelectorAll('[data-chart-summary="true"]')).toHaveLength(3);
    expect(screen.getByText("Revenue and MRR Trends data summary")).toBeInTheDocument();
    expect(screen.getByText("Subscription Growth data summary")).toBeInTheDocument();
    expect(screen.getByText("Churn and Retention data summary")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Export data" }));
    expect(
      screen.getByText(`Downloaded ${PLAN_PERFORMANCE_EXPORT_FILE_NAME} with 4 plans.`),
    ).toBeInTheDocument();
  });

  it("uses fixed deterministic Analytics sources", () => {
    const analyticsDirectory = join(process.cwd(), "src", "components", "dashboard", "analytics");
    const productionFiles = readdirSync(analyticsDirectory).filter(
      (fileName) => !fileName.endsWith(".test.tsx") && /\.(ts|tsx)$/.test(fileName),
    );

    for (const fileName of productionFiles) {
      const source = readFileSync(join(analyticsDirectory, fileName), "utf8");
      expect(source).not.toMatch(/Date\.now|Math\.random|new Date\s*\(|randomUUID/);
    }
  });
});
