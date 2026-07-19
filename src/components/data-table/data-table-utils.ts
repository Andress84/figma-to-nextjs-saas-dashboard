import type {
  DataTableColumn,
  DataTablePaginationState,
  DataTableRowId,
  DataTableSortDirection,
  DataTableSortState,
} from "./data-table-types";

export type PaginationItem = number | "ellipsis-end" | "ellipsis-start";

export function getNextSortDirection(
  direction: DataTableSortDirection | null,
  allowUnsorted: boolean,
) {
  if (direction === null) {
    return "ascending";
  }

  if (direction === "ascending") {
    return "descending";
  }

  return allowUnsorted ? null : "ascending";
}

export function sortRows<TData, TColumnId extends string>(
  rows: readonly TData[],
  columns: readonly DataTableColumn<TData, TColumnId>[],
  sortState: DataTableSortState<TColumnId> | null,
) {
  const copiedRows = rows.map((row, originalIndex) => ({ originalIndex, row }));

  if (sortState === null) {
    return copiedRows.map(({ row }) => row);
  }

  const column = columns.find(
    (candidate) => candidate.id === sortState.columnId && candidate.sortable === true,
  );

  if (!column || column.sortable !== true) {
    return copiedRows.map(({ row }) => row);
  }

  const multiplier = sortState.direction === "ascending" ? 1 : -1;

  copiedRows.sort((left, right) => {
    const comparison = column.compareRows(left.row, right.row) * multiplier;
    return comparison === 0 ? left.originalIndex - right.originalIndex : comparison;
  });

  return copiedRows.map(({ row }) => row);
}

export function getPageCount(totalRows: number, rowsPerPage: number) {
  if (!Number.isFinite(totalRows) || !Number.isFinite(rowsPerPage) || rowsPerPage <= 0) {
    return 1;
  }

  return Math.max(1, Math.ceil(Math.max(0, totalRows) / rowsPerPage));
}

export function clampPage(currentPage: number, pageCount: number) {
  return Math.min(Math.max(1, Math.trunc(currentPage)), Math.max(1, Math.trunc(pageCount)));
}

export function paginateRows<TData>(rows: readonly TData[], pagination: DataTablePaginationState) {
  const pageCount = getPageCount(rows.length, pagination.rowsPerPage);
  const currentPage = clampPage(pagination.currentPage, pageCount);
  const startIndex = (currentPage - 1) * pagination.rowsPerPage;

  return rows.slice(startIndex, startIndex + pagination.rowsPerPage);
}

export function getPaginationItems(
  currentPage: number,
  pageCount: number,
): readonly PaginationItem[] {
  const safePageCount = Math.max(1, Math.trunc(pageCount));
  const safeCurrentPage = clampPage(currentPage, safePageCount);

  if (safePageCount <= 7) {
    return Array.from({ length: safePageCount }, (_, index) => index + 1);
  }

  const pages = new Set([
    1,
    safePageCount,
    safeCurrentPage - 1,
    safeCurrentPage,
    safeCurrentPage + 1,
  ]);
  const visiblePages = [...pages]
    .filter((page) => page >= 1 && page <= safePageCount)
    .sort((left, right) => left - right);
  const items: PaginationItem[] = [];

  visiblePages.forEach((page, index) => {
    const previousPage = visiblePages[index - 1];

    if (previousPage !== undefined && page - previousPage > 1) {
      items.push(previousPage === 1 ? "ellipsis-start" : "ellipsis-end");
    }

    items.push(page);
  });

  return items;
}

export function getVisibleSelectionState<TRowId extends DataTableRowId>(
  visibleRowIds: readonly TRowId[],
  selectedRowIds: readonly TRowId[],
) {
  const selectedIds = new Set(selectedRowIds);
  const selectedVisibleCount = visibleRowIds.reduce(
    (count, rowId) => count + Number(selectedIds.has(rowId)),
    0,
  );

  return {
    allSelected: visibleRowIds.length > 0 && selectedVisibleCount === visibleRowIds.length,
    indeterminate: selectedVisibleCount > 0 && selectedVisibleCount < visibleRowIds.length,
    selectedVisibleCount,
  } as const;
}
