"use client";

import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DataTableColumnAlignment, DataTableSortDirection } from "./data-table-types";
import { getNextSortDirection } from "./data-table-utils";

export interface SortableHeaderProps<TColumnId extends string> {
  readonly align?: DataTableColumnAlignment;
  readonly allowUnsorted?: boolean;
  readonly className?: string;
  readonly columnId: TColumnId;
  readonly direction: DataTableSortDirection | null;
  readonly label: string;
  readonly onSortChange: (columnId: TColumnId, direction: DataTableSortDirection | null) => void;
}

function getSortDescription(label: string, direction: DataTableSortDirection | null) {
  if (direction === "ascending") {
    return `${label}, sorted ascending. Activate to sort descending.`;
  }

  if (direction === "descending") {
    return `${label}, sorted descending. Activate to change sorting.`;
  }

  return `${label}, not sorted. Activate to sort ascending.`;
}

export function SortableHeader<TColumnId extends string>({
  align = "start",
  allowUnsorted = true,
  className,
  columnId,
  direction,
  label,
  onSortChange,
}: Readonly<SortableHeaderProps<TColumnId>>) {
  const SortIcon =
    direction === "ascending" ? ArrowUp : direction === "descending" ? ArrowDown : ChevronsUpDown;

  return (
    <th
      className={cn("data-table-header-cell data-table-sortable-header", className)}
      scope="col"
      aria-sort={direction ?? "none"}
      data-align={align}
    >
      <button
        className="data-table-sort-button"
        type="button"
        aria-label={getSortDescription(label, direction)}
        onClick={() => onSortChange(columnId, getNextSortDirection(direction, allowUnsorted))}
      >
        <span>{label}</span>
        <SortIcon size={14} strokeWidth={2} aria-hidden="true" />
      </button>
    </th>
  );
}
