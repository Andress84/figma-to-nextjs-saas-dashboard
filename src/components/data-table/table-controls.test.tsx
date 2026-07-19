import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "@/components/ui/button";
import { RowsPerPageControl, TablePagination } from "./table-pagination";
import { TableFilters, TableSearch, TableToolbar } from "./table-toolbar";

function PaginationHarness() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  return (
    <>
      <output aria-label="Pagination state">
        Page {currentPage}, {rowsPerPage} rows
      </output>
      <RowsPerPageControl value={rowsPerPage} onChange={setRowsPerPage} />
      <TablePagination
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        totalRows={17}
        onPageChange={setCurrentPage}
      />
    </>
  );
}

describe("table controls", () => {
  it("enforces pagination boundaries and exposes the current page", async () => {
    const user = userEvent.setup();
    render(<PaginationHarness />);

    expect(screen.getByRole("button", { name: "Go to previous page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Go to page 1" })).toHaveAttribute(
      "aria-current",
      "page",
    );

    await user.click(screen.getByRole("button", { name: "Go to next page" }));
    await user.click(screen.getByRole("button", { name: "Go to next page" }));
    expect(screen.getByRole("button", { name: "Go to next page" })).toBeDisabled();
    expect(screen.getByLabelText("Pagination state")).toHaveTextContent("Page 3, 8 rows");
  });

  it("changes rows per page through the existing Select primitive", async () => {
    const user = userEvent.setup();
    render(<PaginationHarness />);

    await user.selectOptions(screen.getByRole("combobox", { name: "Rows per page" }), "16");
    expect(screen.getByLabelText("Pagination state")).toHaveTextContent("Page 1, 16 rows");
  });

  it("composes labelled search, filter summary, clear action, and primary actions", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    const onAdd = vi.fn();

    render(
      <TableToolbar
        search={<TableSearch label="Search customers" />}
        filters={
          <TableFilters
            activeFilterCount={2}
            clearAction={
              <Button variant="ghost" size="compact" onClick={onClear}>
                Clear filters
              </Button>
            }
          >
            <Button variant="secondary" size="compact">
              Status
            </Button>
          </TableFilters>
        }
        actions={<Button onClick={onAdd}>Add customer</Button>}
      />,
    );

    expect(screen.getByRole("searchbox", { name: "Search customers" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Table filters" })).toHaveTextContent("2 active");
    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    await user.click(screen.getByRole("button", { name: "Add customer" }));
    expect(onClear).toHaveBeenCalledOnce();
    expect(onAdd).toHaveBeenCalledOnce();
  });
});
