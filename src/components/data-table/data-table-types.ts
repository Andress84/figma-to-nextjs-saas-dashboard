import type { ReactNode } from "react";

export type DataTableRowId = string | number;
export type DataTableColumnAlignment = "start" | "center" | "end";
export type DataTableSortDirection = "ascending" | "descending";

export interface DataTableSortState<TColumnId extends string> {
  readonly columnId: TColumnId;
  readonly direction: DataTableSortDirection;
}

interface DataTableColumnBase<TData, TColumnId extends string> {
  readonly align?: DataTableColumnAlignment;
  readonly emphasized?: boolean;
  readonly id: TColumnId;
  readonly label: string;
  readonly numeric?: boolean;
  readonly renderCell: (row: TData) => ReactNode;
  readonly rowHeader?: boolean;
}

export type DataTableColumn<TData, TColumnId extends string> =
  | (DataTableColumnBase<TData, TColumnId> & {
      readonly compareRows: (left: TData, right: TData) => number;
      readonly sortable: true;
    })
  | (DataTableColumnBase<TData, TColumnId> & {
      readonly compareRows?: never;
      readonly sortable?: false;
    });

export interface DataTableSelectionState<TRowId extends DataTableRowId> {
  readonly showSelectionColumn?: boolean;
  readonly selectedRowIds: readonly TRowId[];
}

export interface DataTableSelectionCallbacks<TData, TRowId extends DataTableRowId> {
  readonly getSelectionLabel: (row: TData) => string;
  readonly onRowSelectionChange: (row: TData, rowId: TRowId, selected: boolean) => void;
  readonly onVisibleRowsSelectionChange: (rowIds: readonly TRowId[], selected: boolean) => void;
}

export type DataTableSelectionConfig<
  TData,
  TRowId extends DataTableRowId,
> = DataTableSelectionState<TRowId> & DataTableSelectionCallbacks<TData, TRowId>;

export interface DataTablePaginationState {
  readonly currentPage: number;
  readonly rowsPerPage: number;
}

export interface DataTablePaginationCallbacks {
  readonly onPageChange: (page: number) => void;
  readonly onRowsPerPageChange: (rowsPerPage: number) => void;
}

export interface DataTableEmptyState {
  readonly action?: ReactNode;
  readonly description?: string;
  readonly title: string;
}

export interface DataTableLoadingState {
  readonly label?: string;
  readonly rowCount?: number;
}

export interface DataTableRowAction<TData> {
  readonly disabled?: boolean;
  readonly icon?: ReactNode;
  readonly id: string;
  readonly label: string;
  readonly onSelect: (row: TData) => void;
  readonly tone?: "default" | "destructive";
}
