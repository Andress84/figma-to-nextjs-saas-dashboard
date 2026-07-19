import type { DataTableEmptyState as DataTableEmptyStateContract } from "./data-table-types";

export interface EmptyTableStateProps {
  readonly columnCount: number;
  readonly state: DataTableEmptyStateContract;
}

export function EmptyTableState({ columnCount, state }: Readonly<EmptyTableStateProps>) {
  return (
    <tr className="data-table-state-row">
      <td colSpan={columnCount}>
        <div className="data-table-empty-state" role="status">
          <strong>{state.title}</strong>
          {state.description ? <p>{state.description}</p> : null}
          {state.action ? <div className="data-table-empty-action">{state.action}</div> : null}
        </div>
      </td>
    </tr>
  );
}

export interface TableLoadingStateProps {
  readonly columnCount: number;
  readonly label?: string;
  readonly rowCount?: number;
}

export function TableLoadingState({
  columnCount,
  label = "Loading table rows…",
  rowCount = 5,
}: Readonly<TableLoadingStateProps>) {
  const safeColumnCount = Math.max(1, Math.trunc(columnCount));
  const safeRowCount = Math.max(1, Math.trunc(rowCount));
  const rowIds = Array.from({ length: safeRowCount }, (_, index) => `loading-row-${index + 1}`);
  const cellIds = Array.from(
    { length: safeColumnCount },
    (_, index) => `loading-cell-${index + 1}`,
  );

  return (
    <>
      {rowIds.map((rowId, rowIndex) => (
        <tr className="data-table-loading-row" key={rowId} aria-hidden={rowIndex > 0 || undefined}>
          {cellIds.map((cellId, cellIndex) => (
            <td key={`${rowId}-${cellId}`}>
              {rowIndex === 0 && cellIndex === 0 ? (
                <span className="sr-only" role="status">
                  {label}
                </span>
              ) : null}
              <span className="data-table-skeleton" aria-hidden="true" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
