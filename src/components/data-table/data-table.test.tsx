import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { DataTable } from "./data-table";
import { DataTableContainer } from "./data-table-structure";
import type { DataTableColumn, DataTableSortState } from "./data-table-types";

interface TestRow {
  readonly amount: number;
  readonly id: string;
  readonly name: string;
}

type ColumnId = "amount" | "name";

const rows = [
  { id: "account-bravo", name: "Bravo", amount: 20 },
  { id: "account-alpha", name: "Alpha", amount: 10 },
  { id: "account-charlie", name: "Charlie", amount: 30 },
] as const satisfies readonly TestRow[];

const columns = [
  {
    id: "name",
    label: "Name",
    rowHeader: true,
    sortable: true,
    compareRows: (left, right) => left.name.localeCompare(right.name),
    renderCell: (row) => row.name,
  },
  {
    id: "amount",
    label: "Amount",
    align: "end",
    emphasized: true,
    numeric: true,
    sortable: true,
    compareRows: (left, right) => left.amount - right.amount,
    renderCell: (row) => `$${row.amount}`,
  },
] as const satisfies readonly DataTableColumn<TestRow, ColumnId>[];

function updateSelectedIds(current: readonly string[], rowId: string, selected: boolean) {
  if (selected) {
    return current.includes(rowId) ? current : [...current, rowId];
  }

  return current.filter((id) => id !== rowId);
}

function InteractiveTable() {
  const [sortState, setSortState] = useState<DataTableSortState<ColumnId> | null>(null);
  const [selectedRowIds, setSelectedRowIds] = useState<readonly string[]>([]);

  return (
    <DataTableContainer viewportLabel="Scrollable accounts table">
      <DataTable
        caption="Accounts summary"
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        sort={{ state: sortState, onChange: setSortState }}
        selection={{
          selectedRowIds,
          getSelectionLabel: (row) => `${row.name} account`,
          onRowSelectionChange: (_row, rowId, selected) =>
            setSelectedRowIds((current) => updateSelectedIds(current, rowId, selected)),
          onVisibleRowsSelectionChange: (visibleRowIds, selected) =>
            setSelectedRowIds((current) => {
              if (selected) {
                return [...new Set([...current, ...visibleRowIds])];
              }

              const visibleIds = new Set(visibleRowIds);
              return current.filter((rowId) => !visibleIds.has(rowId));
            }),
        }}
      />
    </DataTableContainer>
  );
}

function getBodyRowNames() {
  const table = screen.getByRole("table", { name: "Accounts summary" });
  return within(table)
    .getAllByRole("rowheader")
    .map((cell) => cell.textContent);
}

describe("DataTable", () => {
  it("renders native table semantics, an accessible caption, and stable domain row IDs", () => {
    render(<InteractiveTable />);

    const table = screen.getByRole("table", { name: "Accounts summary" });
    const headerRow = within(table).getAllByRole("row")[0];

    expect(table.querySelector("caption")).toHaveTextContent("Accounts summary");
    expect(within(headerRow).getAllByRole("columnheader")).toHaveLength(3);
    expect(within(table).getAllByRole("rowheader")).toHaveLength(3);
    expect(
      [...table.querySelectorAll<HTMLTableRowElement>("tbody [data-row-id]")].map(
        (row) => row.dataset.rowId,
      ),
    ).toEqual(["account-bravo", "account-alpha", "account-charlie"]);
  });

  it("updates aria-sort and row order through a keyboard-operable sortable header", async () => {
    const user = userEvent.setup();
    render(<InteractiveTable />);

    const sortButton = screen.getByRole("button", { name: /Name, not sorted/ });
    const columnHeader = sortButton.closest("th");
    expect(columnHeader).toHaveAttribute("aria-sort", "none");

    sortButton.focus();
    await user.keyboard("{Enter}");
    expect(columnHeader).toHaveAttribute("aria-sort", "ascending");
    expect(getBodyRowNames()).toEqual(["Alpha", "Bravo", "Charlie"]);

    await user.keyboard("{Enter}");
    expect(columnHeader).toHaveAttribute("aria-sort", "descending");
    expect(getBodyRowNames()).toEqual(["Charlie", "Bravo", "Alpha"]);

    await user.keyboard("{Enter}");
    expect(columnHeader).toHaveAttribute("aria-sort", "none");
    expect(getBodyRowNames()).toEqual(["Bravo", "Alpha", "Charlie"]);
  });

  it("selects one row by ID and preserves selection when the row order changes", async () => {
    const user = userEvent.setup();
    render(<InteractiveTable />);

    await user.click(screen.getByRole("checkbox", { name: "Select Alpha account" }));
    expect(screen.getByRole("status")).toHaveTextContent("1 row selected");
    expect(screen.getByRole("row", { name: /Alpha/ })).toHaveAttribute("data-selected", "true");

    await user.click(screen.getByRole("button", { name: /Name, not sorted/ }));
    expect(screen.getByRole("checkbox", { name: "Deselect Alpha account" })).toBeChecked();
    expect(screen.getByRole("row", { name: /Alpha/ })).toHaveAttribute(
      "data-row-id",
      "account-alpha",
    );
    expect(screen.getByRole("row", { name: /Alpha/ })).toHaveAttribute("aria-selected", "true");
  });

  it("supports reusable selected-row styling without rendering checkbox controls", () => {
    render(
      <DataTable
        caption="Selected account"
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        selection={{
          showSelectionColumn: false,
          selectedRowIds: ["account-alpha"],
          getSelectionLabel: (row) => `${row.name} account`,
          onRowSelectionChange: vi.fn(),
          onVisibleRowsSelectionChange: vi.fn(),
        }}
      />,
    );

    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    expect(screen.getByRole("row", { name: /Alpha/ })).toHaveAttribute("data-selected", "true");
    expect(screen.getByRole("row", { name: /Alpha/ })).toHaveAttribute("aria-selected", "true");
  });

  it("selects all visible rows and clears them without selecting the row itself", async () => {
    const user = userEvent.setup();
    render(<InteractiveTable />);

    await user.click(screen.getByRole("checkbox", { name: "Select all visible rows" }));
    expect(screen.getByRole("status")).toHaveTextContent("3 rows selected");
    expect(screen.getAllByRole("checkbox").every((checkbox) => checkbox.matches(":checked"))).toBe(
      true,
    );

    await user.click(screen.getByRole("checkbox", { name: "Deselect all visible rows" }));
    expect(screen.getByRole("status")).toHaveTextContent("0 rows selected");
  });

  it("sets the header checkbox indeterminate after a partial selection", async () => {
    const user = userEvent.setup();
    render(<InteractiveTable />);

    await user.click(screen.getByRole("checkbox", { name: "Select Bravo account" }));
    const selectAll = screen.getByRole<HTMLInputElement>("checkbox", {
      name: "Select all visible rows",
    });

    expect(selectAll).not.toBeChecked();
    expect(selectAll.indeterminate).toBe(true);
  });

  it("renders deterministic empty and loading states inside the native table body", () => {
    const { rerender } = render(
      <DataTable
        caption="Empty accounts"
        columns={columns}
        rows={[]}
        getRowId={(row) => row.id}
        emptyState={{ title: "No matching accounts", description: "Clear the active filters." }}
      />,
    );

    expect(screen.getByRole("table", { name: "Empty accounts" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "No matching accountsClear the active filters.",
    );

    rerender(
      <DataTable
        caption="Loading accounts"
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        loading={{ label: "Loading account records", rowCount: 3 }}
      />,
    );

    expect(screen.getByRole("table", { name: "Loading accounts" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
    expect(screen.getByRole("status")).toHaveTextContent("Loading account records");
    expect(screen.queryByRole("rowheader", { name: "Alpha" })).not.toBeInTheDocument();
  });

  it.each([
    { height: 900, label: "1440px", width: 1440 },
    { height: 800, label: "1024px", width: 1024 },
    { height: 1024, label: "768px", width: 768 },
    { height: 844, label: "390×844", width: 390 },
    { height: 700, label: "320×700", width: 320 },
  ])("contains horizontal scrolling in a named table viewport at $label", async ({
    height,
    width,
  }) => {
    const user = userEvent.setup();
    Object.defineProperty(window, "innerWidth", { configurable: true, value: width });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: height });
    render(<InteractiveTable />);

    const viewport = screen.getByRole("region", { name: "Scrollable accounts table" });
    expect(viewport).toHaveStyle({ overflowX: "auto" });
    expect(viewport).toHaveAttribute("tabindex", "0");
    expect(document.body.style.overflowX).toBe("");

    await user.tab();
    expect(viewport).toHaveFocus();
  });
});
