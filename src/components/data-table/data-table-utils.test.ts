import { describe, expect, it } from "vitest";
import type { DataTableColumn } from "./data-table-types";
import {
  getPageCount,
  getPaginationItems,
  getVisibleSelectionState,
  paginateRows,
  sortRows,
} from "./data-table-utils";

interface TestRow {
  readonly id: string;
  readonly name: string;
  readonly value: number;
}

type ColumnId = "name" | "value";

const columns = [
  {
    id: "name",
    label: "Name",
    sortable: true,
    compareRows: (left, right) => left.name.localeCompare(right.name),
    renderCell: (row) => row.name,
  },
  {
    id: "value",
    label: "Value",
    sortable: true,
    compareRows: (left, right) => left.value - right.value,
    renderCell: (row) => row.value,
  },
] as const satisfies readonly DataTableColumn<TestRow, ColumnId>[];

const rows = [
  { id: "row-charlie", name: "Charlie", value: 20 },
  { id: "row-alpha", name: "Alpha", value: 10 },
  { id: "row-bravo", name: "Bravo", value: 10 },
] as const satisfies readonly TestRow[];

describe("data-table utilities", () => {
  it("sorts a copy deterministically without mutating the source rows", () => {
    const originalOrder = rows.map((row) => row.id);
    const ascending = sortRows(rows, columns, {
      columnId: "value",
      direction: "ascending",
    });
    const descending = sortRows(rows, columns, {
      columnId: "value",
      direction: "descending",
    });

    expect(ascending.map((row) => row.id)).toEqual(["row-alpha", "row-bravo", "row-charlie"]);
    expect(descending.map((row) => row.id)).toEqual(["row-charlie", "row-alpha", "row-bravo"]);
    expect(rows.map((row) => row.id)).toEqual(originalOrder);
    expect(ascending).not.toBe(rows);
  });

  it("paginates a copy and derives page counts without hard-coded totals", () => {
    expect(getPageCount(17, 8)).toBe(3);
    expect(paginateRows(rows, { currentPage: 2, rowsPerPage: 2 }).map((row) => row.id)).toEqual([
      "row-bravo",
    ]);
    expect(getPaginationItems(10, 20)).toEqual([
      1,
      "ellipsis-start",
      9,
      10,
      11,
      "ellipsis-end",
      20,
    ]);
  });

  it("derives checked and indeterminate state from visible stable IDs", () => {
    expect(getVisibleSelectionState(["a", "b", "c"], ["b", "outside"])).toEqual({
      allSelected: false,
      indeterminate: true,
      selectedVisibleCount: 1,
    });
    expect(getVisibleSelectionState(["a", "b"], ["a", "b", "outside"])).toEqual({
      allSelected: true,
      indeterminate: false,
      selectedVisibleCount: 2,
    });
  });
});
