import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CUSTOMERS } from "@/data/mock/customers";
import { CustomersDashboard } from "./customers-dashboard";
import { buildCustomerCsv, CUSTOMER_EXPORT_FILE_NAME } from "./customer-export";
import { filterCustomerRecords, sortCustomerRecords } from "./customer-utils";

const APPROVED_CUSTOMERS = [
  "Olivia Chen",
  "Noah Williams",
  "Ava Thompson",
  "Marco Ruiz",
  "Maya Patel",
  "Ethan Brooks",
  "Sophia Nguyen",
  "Liam Carter",
] as const;

function getCustomerTable() {
  return screen.getByRole("table", {
    name: "Customer accounts with subscription status, recurring value and recent activity",
  });
}

describe("CustomersDashboard", () => {
  it("renders the approved KPI content, first-page rows, and semantic table", () => {
    render(<CustomersDashboard />);

    expect(screen.getByRole("heading", { level: 1, name: "Customers" })).toBeVisible();
    expect(
      screen.getByText("Manage customer accounts, subscription status and recurring value."),
    ).toBeVisible();
    const metrics = screen.getByRole("region", { name: "Customer metrics" });
    expect(within(metrics).getAllByRole("heading", { level: 3 })).toHaveLength(4);
    expect(within(metrics).getByText("3,214")).toBeVisible();
    expect(within(metrics).getByText("2,846")).toBeVisible();
    expect(within(metrics).getByText("214")).toBeVisible();
    expect(within(metrics).getByText("96")).toBeVisible();
    expect(within(metrics).getByText("+9.8%")).toBeVisible();
    expect(within(metrics).getByText("12 fewer")).toBeVisible();

    const table = getCustomerTable();
    expect(table.querySelector("caption")).toHaveTextContent("Customer accounts");
    expect(within(table).getAllByRole("columnheader")).toHaveLength(8);
    expect(within(table).getAllByRole("rowheader")).toHaveLength(8);
    for (const customer of APPROVED_CUSTOMERS) {
      expect(within(table).getByRole("rowheader", { name: new RegExp(customer) })).toBeVisible();
    }
    expect(within(table).getByText("Past due")).toBeVisible();
    expect(within(table).getByText("Churned")).toBeVisible();
    expect(screen.getByText("Showing 1–8 of 3,214 customers")).toBeVisible();
    expect(screen.getByRole("row", { name: /Marco Ruiz/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("searches customer and company names case-insensitively and renders an empty state", async () => {
    const user = userEvent.setup();
    render(<CustomersDashboard />);
    const search = screen.getByRole("searchbox", { name: "Search customers" });

    await user.type(search, "olivia");
    expect(
      within(getCustomerTable()).getByRole("rowheader", { name: /Olivia Chen/ }),
    ).toBeVisible();
    expect(
      within(getCustomerTable()).queryByRole("rowheader", { name: /Noah Williams/ }),
    ).toBeNull();

    await user.clear(search);
    await user.type(search, "BRIGHTLAYER");
    expect(
      within(getCustomerTable()).getByRole("rowheader", { name: /Noah Williams/ }),
    ).toBeVisible();

    await user.clear(search);
    await user.type(search, "no customer here");
    expect(screen.getByText("No customer accounts found")).toBeVisible();
    expect(search).toHaveValue("no customer here");
  });

  it("composes keyboard lifecycle tabs with the independent At-risk condition", async () => {
    const user = userEvent.setup();
    render(<CustomersDashboard />);
    const allTab = screen.getByRole("tab", { name: "All" });

    allTab.focus();
    await user.keyboard("{ArrowRight}");
    const activeTab = screen.getByRole("tab", { name: "Active" });
    expect(activeTab).toHaveAttribute("aria-selected", "true");
    expect(within(getCustomerTable()).getAllByText("Active")).toHaveLength(5);
    expect(screen.queryByRole("tab", { name: /At risk/i })).not.toBeInTheDocument();

    const riskFilter = screen.getByRole("button", { name: /At risk: 96/i });
    await user.click(riskFilter);
    expect(riskFilter).toHaveAttribute("aria-pressed", "true");
    expect(within(getCustomerTable()).getByRole("rowheader", { name: /Marco Ruiz/ })).toBeVisible();
    expect(within(getCustomerTable()).getByText("Active")).toBeVisible();
    expect(within(getCustomerTable()).getAllByRole("rowheader")).toHaveLength(1);

    await user.type(screen.getByRole("searchbox", { name: "Search customers" }), "Verde");
    expect(within(getCustomerTable()).getByRole("rowheader", { name: /Marco Ruiz/ })).toBeVisible();
    await user.clear(screen.getByRole("searchbox", { name: "Search customers" }));
    await user.type(screen.getByRole("searchbox", { name: "Search customers" }), "Northstar");
    expect(screen.getByText("No customer accounts found")).toBeVisible();
  });

  it("filters without mutating source data and sorts deterministically", () => {
    const originalOrder = CUSTOMERS.map((customer) => customer.id);
    const filtered = filterCustomerRecords(CUSTOMERS, {
      atRiskOnly: false,
      lifecycle: "active",
      plan: "growth",
      query: "cloud",
    });
    const sorted = sortCustomerRecords(CUSTOMERS, {
      columnId: "monthly-value",
      direction: "descending",
    });

    expect(filtered.map((customer) => customer.name)).toEqual(["Maya Patel"]);
    expect(CUSTOMERS.map((customer) => customer.id)).toEqual(originalOrder);
    expect(sorted.map((customer) => customer.name)).toEqual([
      "Noah Williams",
      "Sophia Nguyen",
      "Ava Thompson",
      "Ethan Brooks",
      "Olivia Chen",
      "Maya Patel",
      "Marco Ruiz",
      "Liam Carter",
    ]);
    expect(CUSTOMERS.map((customer) => customer.id)).toEqual(originalOrder);
  });

  it("sorts from accessible headers and preserves the selected row by stable ID", async () => {
    const user = userEvent.setup();
    render(<CustomersDashboard />);
    const table = getCustomerTable();
    const customerSort = within(table).getByRole("button", { name: /Customer, not sorted/ });

    await user.click(customerSort);
    expect(customerSort.closest("th")).toHaveAttribute("aria-sort", "ascending");
    expect(within(table).getAllByRole("rowheader")[0]).toHaveTextContent("Ava Thompson");
    expect(within(table).getByRole("row", { name: /Marco Ruiz/ })).toHaveAttribute(
      "data-row-id",
      "customer-marco-ruiz",
    );
    expect(within(table).getByRole("row", { name: /Marco Ruiz/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("changes selected-row state through the row menu and restores focus", async () => {
    const user = userEvent.setup();
    render(<CustomersDashboard />);
    const trigger = screen.getByRole("button", { name: "Actions for Marco Ruiz account" });

    await user.click(trigger);
    expect(screen.getByRole("menuitem", { name: "View account (demo)" })).toHaveFocus();
    await user.click(screen.getByRole("menuitem", { name: "Clear selection" }));
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(screen.getByRole("row", { name: /Marco Ruiz/ })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  it("keeps pagination honest for unloaded records and resets after rows-per-page changes", async () => {
    const user = userEvent.setup();
    render(<CustomersDashboard />);

    await user.click(screen.getByRole("button", { name: "Go to next page" }));
    expect(screen.getByText("Records not loaded in this static demo")).toBeVisible();
    expect(screen.getByText(/Page 2 of 402/)).toBeVisible();
    expect(screen.getByRole("button", { name: "Go to previous page" })).toBeEnabled();

    await user.selectOptions(screen.getByRole("combobox", { name: "Rows per page" }), "16");
    expect(screen.getByRole("button", { name: "Go to page 1" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(within(getCustomerTable()).getAllByRole("rowheader")).toHaveLength(8);
  });

  it("builds and downloads deterministic CSV for the currently visible ordered rows", async () => {
    const csv = buildCustomerCsv(CUSTOMERS);
    expect(csv.split("\r\n")).toHaveLength(9);
    expect(csv).toContain(
      "Customer,Company,Plan,Monthly Value,Status,At Risk,Last Activity,Joined",
    );
    expect(csv).toContain(
      'Olivia Chen,Northstar Studio,Growth,$29,Active,No,12 min ago,"May 18, 2026"',
    );
    expect(csv).toContain('Marco Ruiz,Verde Labs,Starter,$15,Active,Yes,6 hrs ago,"Mar 21, 2026"');

    const createObjectUrl = vi.fn(() => "blob:subtera-customers");
    const revokeObjectUrl = vi.fn();
    Object.defineProperty(URL, "createObjectURL", { configurable: true, value: createObjectUrl });
    Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: revokeObjectUrl });
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);
    const user = userEvent.setup();
    render(<CustomersDashboard />);
    await user.type(screen.getByRole("searchbox", { name: "Search customers" }), "Verde");
    await user.click(screen.getByRole("button", { name: "Export CSV" }));

    expect(createObjectUrl).toHaveBeenCalledOnce();
    expect(revokeObjectUrl).toHaveBeenCalledWith("blob:subtera-customers");
    expect(
      screen.getByText(`Downloaded ${CUSTOMER_EXPORT_FILE_NAME} with 1 customer.`),
    ).toBeInTheDocument();
  });

  it("dismisses filters with focus restoration and gives demo feedback for Add and Refresh", async () => {
    const user = userEvent.setup();
    render(<CustomersDashboard />);
    const filterTrigger = screen.getByRole("button", { name: "Filters" });

    await user.click(filterTrigger);
    const dialog = screen.getByRole("dialog", { name: "Filter customer accounts" });
    await user.selectOptions(within(dialog).getByRole("combobox", { name: "Plan" }), "growth");
    expect(screen.getByRole("button", { name: "Filters (1)" })).toBeVisible();
    expect(within(getCustomerTable()).getAllByRole("rowheader")).toHaveLength(2);
    await user.keyboard("{Escape}");
    expect(dialog).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Filters (1)" })).toHaveFocus();

    await user.click(screen.getByRole("button", { name: "Add customer" }));
    expect(
      screen.getByText(
        "Add customer is a non-persistent demo action. No customer record was created.",
      ),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Refresh" }));
    expect(
      screen.getByText("Customer records refreshed. Deterministic demo data is unchanged."),
    ).toBeInTheDocument();
  });

  it("uses fixed deterministic Customers sources", () => {
    const customersDirectory = join(process.cwd(), "src", "components", "dashboard", "customers");
    const productionFiles = readdirSync(customersDirectory).filter(
      (fileName) => !fileName.endsWith(".test.tsx") && /\.(ts|tsx)$/.test(fileName),
    );

    for (const fileName of productionFiles) {
      const source = readFileSync(join(customersDirectory, fileName), "utf8");
      expect(source).not.toMatch(/Date\.now|Math\.random|new Date\s*\(|randomUUID/);
    }
  });
});
