import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TRANSACTIONS } from "@/data/mock/transactions";
import { OverviewDashboard } from "./overview-dashboard";
import { buildOverviewTransactionsCsv, OVERVIEW_EXPORT_FILE_NAME } from "./overview-export";

describe("OverviewDashboard", () => {
  it("renders all four canonical metrics from typed dashboard data", () => {
    render(<OverviewDashboard />);

    const metrics = screen.getByRole("region", { name: "Overview metrics" });
    expect(within(metrics).getAllByRole("heading", { level: 3 })).toHaveLength(4);
    expect(within(metrics).getByText("$84,720")).toBeVisible();
    expect(within(metrics).getByText("$1,016,640")).toBeVisible();
    expect(within(metrics).getByText("2,846")).toBeVisible();
    expect(within(metrics).getByText("3.84%")).toBeVisible();
    expect(within(metrics).getByText("-0.43 pp")).toBeVisible();
  });

  it("switches the revenue chart to MRR with accessible selected-state and labels", async () => {
    const user = userEvent.setup();
    const { container } = render(<OverviewDashboard />);
    const revenueFigure = screen.getByRole("figure", { name: "Revenue Overview" });
    const revenueOption = within(revenueFigure).getByRole("radio", { name: "Revenue" });
    const mrrOption = within(revenueFigure).getByRole("radio", { name: "MRR" });

    expect(revenueOption).toBeChecked();
    expect(container.querySelector(".overview-chart-metric strong")).toHaveTextContent("$112,480");

    await user.click(mrrOption);

    expect(mrrOption).toBeChecked();
    expect(revenueOption).not.toBeChecked();
    expect(container.querySelector(".overview-chart-metric strong")).toHaveTextContent("$84,720");
    expect(within(revenueFigure).getAllByText("Current MRR").length).toBeGreaterThan(0);
    expect(within(revenueFigure).getAllByText("Previous MRR").length).toBeGreaterThan(0);
  });

  it("renders the canonical plan distribution and real navigation actions", () => {
    render(<OverviewDashboard />);

    const planFigure = screen.getByRole("figure", { name: "Subscriptions by Plan" });
    const legend = within(planFigure).getByRole("list", { name: "Plan distribution legend" });
    expect(within(legend).getAllByRole("group")).toHaveLength(4);
    expect(
      within(legend).getByRole("group", { name: "Starter plan performance" }),
    ).toHaveTextContent("1,326 · 46.6%");
    expect(within(legend).getByRole("group", { name: "Teams plan performance" })).toHaveTextContent(
      "$16,533",
    );
    expect(
      screen.getByText("Subscriptions by Plan segment summary. 2,846 Active total."),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View details" })).toHaveAttribute(
      "href",
      "/subscriptions",
    );
    expect(screen.getAllByRole("link", { name: "View all" })[0]).toHaveAttribute(
      "href",
      "/customers",
    );
  });

  it("renders recent transactions with native table semantics and canonical records", () => {
    render(<OverviewDashboard />);

    const table = screen.getByRole("table", { name: "Recent subscription transactions" });
    expect(within(table).getAllByRole("columnheader")).toHaveLength(6);
    expect(within(table).getAllByRole("rowheader")).toHaveLength(5);
    expect(within(table).getByRole("rowheader", { name: /Olivia Chen/ })).toBeInTheDocument();
    expect(within(table).getByRole("rowheader", { name: /Koto Studio/ })).toBeInTheDocument();
    expect(within(table).getByText("$29.00")).toBeVisible();
    expect(within(table).getByText("Refunded")).toBeVisible();
  });

  it("filters visible transaction records and restores trigger focus after Escape", async () => {
    const user = userEvent.setup();
    render(<OverviewDashboard />);
    const filterTrigger = screen.getByRole("button", { name: "Filters" });

    await user.click(filterTrigger);
    const dialog = screen.getByRole("dialog", { name: "Filter recent transactions" });
    const statusFilter = within(dialog).getByRole("combobox", { name: "Status" });
    await user.selectOptions(statusFilter, "refunded");

    expect(screen.queryByText("Olivia Chen")).not.toBeInTheDocument();
    expect(screen.getAllByText("Marco Ruiz")).toHaveLength(2);
    expect(within(dialog).getByText("1 of 5 shown")).toBeVisible();

    await user.keyboard("{Escape}");
    expect(
      screen.queryByRole("dialog", { name: "Filter recent transactions" }),
    ).not.toBeInTheDocument();
    expect(filterTrigger).toHaveFocus();
  });

  it("builds deterministic, escaped CSV and announces a browser download", async () => {
    const csv = buildOverviewTransactionsCsv(TRANSACTIONS);
    expect(csv.split("\r\n")).toHaveLength(6);
    expect(csv).toContain("Customer,Plan,Date,Payment method,Amount,Status");
    expect(csv).toContain('Olivia Chen,Growth,"Jul 14, 10:42",Visa •4242,$29.00,Paid');
    expect(csv).toContain('Koto Studio,Teams,"Jul 12, 16:41",Visa •3320,$99.00,Failed');

    const createObjectUrl = vi.fn(() => "blob:subtera-overview");
    const revokeObjectUrl = vi.fn();
    Object.defineProperty(URL, "createObjectURL", { configurable: true, value: createObjectUrl });
    Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: revokeObjectUrl });
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);
    const user = userEvent.setup();
    render(<OverviewDashboard />);

    await user.click(screen.getByRole("button", { name: "Export" }));

    expect(createObjectUrl).toHaveBeenCalledOnce();
    expect(revokeObjectUrl).toHaveBeenCalledWith("blob:subtera-overview");
    expect(
      screen
        .getByText(`Downloaded ${OVERVIEW_EXPORT_FILE_NAME} with 5 transactions.`)
        .closest('[role="status"]'),
    ).toBeInTheDocument();
  });

  it("uses named controls and fixed deterministic data sources", () => {
    render(<OverviewDashboard />);

    expect(screen.getByRole("button", { name: /Reporting period: Jun 15/ })).toBeVisible();
    expect(screen.getByRole("radiogroup", { name: "Revenue metric" })).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Scrollable recent transactions table" }),
    ).toHaveAttribute("tabindex", "0");

    const overviewDirectory = join(process.cwd(), "src", "components", "dashboard", "overview");
    const productionFiles = readdirSync(overviewDirectory).filter(
      (fileName) => !fileName.endsWith(".test.tsx") && /\.(ts|tsx)$/.test(fileName),
    );

    for (const fileName of productionFiles) {
      const source = readFileSync(join(overviewDirectory, fileName), "utf8");
      expect(source).not.toMatch(/Date\.now|Math\.random|new Date\s*\(|randomUUID/);
    }
  });
});
