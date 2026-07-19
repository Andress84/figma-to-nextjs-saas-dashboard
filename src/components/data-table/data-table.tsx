import { Fragment } from "react";
import {
  DataTableCaption,
  DataTableCell,
  DataTableElement,
  DataTableHeader,
  DataTableHeaderCell,
  DataTableRow,
  DataTableRowHeaderCell,
} from "./data-table-structure";
import type {
  DataTableColumn,
  DataTableEmptyState,
  DataTableLoadingState,
  DataTableRowId,
  DataTableSelectionConfig,
  DataTableSortState,
} from "./data-table-types";
import { getVisibleSelectionState, sortRows } from "./data-table-utils";
import { RowSelectionCheckbox } from "./row-selection-checkbox";
import { SortableHeader } from "./sortable-header";
import { EmptyTableState as EmptyState, TableLoadingState as LoadingState } from "./table-states";

interface ControlledSorting<TColumnId extends string> {
  readonly allowUnsorted?: boolean;
  readonly onChange: (sortState: DataTableSortState<TColumnId> | null) => void;
  readonly state: DataTableSortState<TColumnId> | null;
}

export interface DataTableProps<TData, TColumnId extends string, TRowId extends DataTableRowId> {
  readonly caption: string;
  readonly captionVisible?: boolean;
  readonly className?: string;
  readonly columns: readonly DataTableColumn<TData, TColumnId>[];
  readonly emptyState?: DataTableEmptyState;
  readonly getRowId: (row: TData) => TRowId;
  readonly loading?: DataTableLoadingState | false;
  readonly rows: readonly TData[];
  readonly selection?: DataTableSelectionConfig<TData, TRowId>;
  readonly sort?: ControlledSorting<TColumnId>;
}

const DEFAULT_EMPTY_STATE = {
  title: "No rows to display",
  description: "Try adjusting the current search or filters.",
} as const satisfies DataTableEmptyState;

export function DataTable<TData, TColumnId extends string, TRowId extends DataTableRowId>({
  caption,
  captionVisible = false,
  className,
  columns,
  emptyState = DEFAULT_EMPTY_STATE,
  getRowId,
  loading = false,
  rows,
  selection,
  sort,
}: Readonly<DataTableProps<TData, TColumnId, TRowId>>) {
  const sortedRows = sortRows(rows, columns, sort?.state ?? null);
  const visibleRowIds = sortedRows.map(getRowId);
  const selectedRowIds = selection?.selectedRowIds ?? [];
  const selectedIds = new Set<DataTableRowId>(selectedRowIds);
  const { allSelected, indeterminate } = getVisibleSelectionState(visibleRowIds, selectedRowIds);
  const columnCount = columns.length + Number(Boolean(selection));

  return (
    <>
      {selection ? (
        <span className="sr-only" role="status" aria-live="polite">
          {selection.selectedRowIds.length} {selection.selectedRowIds.length === 1 ? "row" : "rows"}{" "}
          selected
        </span>
      ) : null}
      <DataTableElement className={className} aria-busy={loading ? true : undefined}>
        <DataTableCaption visible={captionVisible}>{caption}</DataTableCaption>
        <DataTableHeader>
          {selection ? (
            <DataTableHeaderCell className="data-table-selection-cell">
              <RowSelectionCheckbox
                checked={allSelected}
                disabled={visibleRowIds.length === 0 || Boolean(loading)}
                indeterminate={indeterminate}
                label={allSelected ? "Deselect all visible rows" : "Select all visible rows"}
                onCheckedChange={(checked) =>
                  selection.onVisibleRowsSelectionChange(visibleRowIds, checked)
                }
              />
            </DataTableHeaderCell>
          ) : null}
          {columns.map((column) => {
            const direction = sort?.state?.columnId === column.id ? sort.state.direction : null;

            return column.sortable === true && sort ? (
              <SortableHeader
                key={column.id}
                align={column.align}
                allowUnsorted={sort.allowUnsorted}
                columnId={column.id}
                direction={direction}
                label={column.label}
                onSortChange={(columnId, nextDirection) =>
                  sort.onChange(
                    nextDirection === null ? null : { columnId, direction: nextDirection },
                  )
                }
              />
            ) : (
              <DataTableHeaderCell
                key={column.id}
                align={column.align}
                emphasized={column.emphasized}
                numeric={column.numeric}
              >
                {column.label}
              </DataTableHeaderCell>
            );
          })}
        </DataTableHeader>
        <tbody>
          {loading ? (
            <LoadingState
              columnCount={columnCount}
              label={loading.label}
              rowCount={loading.rowCount}
            />
          ) : null}
          {!loading && sortedRows.length === 0 ? (
            <EmptyState columnCount={columnCount} state={emptyState} />
          ) : null}
          {!loading
            ? sortedRows.map((row) => {
                const rowId = getRowId(row);
                const selected = selectedIds.has(rowId);

                return (
                  <DataTableRow key={rowId} data-row-id={String(rowId)} selected={selected}>
                    {selection ? (
                      <DataTableCell className="data-table-selection-cell">
                        <RowSelectionCheckbox
                          checked={selected}
                          label={`${selected ? "Deselect" : "Select"} ${selection.getSelectionLabel(row)}`}
                          onCheckedChange={(checked) =>
                            selection.onRowSelectionChange(row, rowId, checked)
                          }
                        />
                      </DataTableCell>
                    ) : null}
                    {columns.map((column) => {
                      const cellContent = column.renderCell(row);
                      const sharedProps = {
                        align: column.align,
                        emphasized: column.emphasized,
                        numeric: column.numeric,
                        "data-column-id": column.id,
                      } as const;

                      return (
                        <Fragment key={column.id}>
                          {column.rowHeader ? (
                            <DataTableRowHeaderCell {...sharedProps}>
                              {cellContent}
                            </DataTableRowHeaderCell>
                          ) : (
                            <DataTableCell {...sharedProps}>{cellContent}</DataTableCell>
                          )}
                        </Fragment>
                      );
                    })}
                  </DataTableRow>
                );
              })
            : null}
        </tbody>
      </DataTableElement>
    </>
  );
}
