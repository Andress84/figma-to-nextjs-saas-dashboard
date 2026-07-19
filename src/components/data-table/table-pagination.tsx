"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useId, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { clampPage, getPageCount, getPaginationItems } from "./data-table-utils";

export interface RowsPerPageControlProps {
  readonly label?: string;
  readonly onChange: (rowsPerPage: number) => void;
  readonly options?: readonly number[];
  readonly value: number;
}

export function RowsPerPageControl({
  label = "Rows per page",
  onChange,
  options = [8, 16, 24],
  value,
}: Readonly<RowsPerPageControlProps>) {
  const id = useId();

  return (
    <label className="data-table-rows-per-page" htmlFor={id}>
      <span>{label}</span>
      <Select
        id={id}
        controlSize="compact"
        value={String(value)}
        onChange={(event) => {
          const nextValue = Number(event.currentTarget.value);

          if (Number.isInteger(nextValue) && nextValue > 0) {
            onChange(nextValue);
          }
        }}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
    </label>
  );
}

export interface TablePaginationProps {
  readonly ariaLabel?: string;
  readonly className?: string;
  readonly currentPage: number;
  readonly onPageChange: (page: number) => void;
  readonly rowsPerPage: number;
  readonly totalRows: number;
}

export function TablePagination({
  ariaLabel = "Table pagination",
  className,
  currentPage,
  onPageChange,
  rowsPerPage,
  totalRows,
}: Readonly<TablePaginationProps>) {
  const pageCount = getPageCount(totalRows, rowsPerPage);
  const safeCurrentPage = clampPage(currentPage, pageCount);
  const paginationItems = getPaginationItems(safeCurrentPage, pageCount);

  return (
    <nav className={cn("data-table-pagination", className)} aria-label={ariaLabel}>
      <IconButton
        label="Go to previous page"
        size="compact"
        variant="ghost"
        disabled={safeCurrentPage === 1}
        onClick={() => onPageChange(safeCurrentPage - 1)}
      >
        <ChevronLeft size={16} strokeWidth={1.9} aria-hidden="true" />
      </IconButton>
      <div className="data-table-pagination-pages">
        {paginationItems.map((item) =>
          typeof item === "number" ? (
            <Button
              key={item}
              className="data-table-page-button"
              size="compact"
              variant={item === safeCurrentPage ? "secondary" : "ghost"}
              aria-label={`Go to page ${item}`}
              aria-current={item === safeCurrentPage ? "page" : undefined}
              onClick={() => onPageChange(item)}
            >
              {item}
            </Button>
          ) : (
            <span className="data-table-pagination-ellipsis" key={item} aria-hidden="true">
              …
            </span>
          ),
        )}
      </div>
      <IconButton
        label="Go to next page"
        size="compact"
        variant="ghost"
        disabled={safeCurrentPage === pageCount}
        onClick={() => onPageChange(safeCurrentPage + 1)}
      >
        <ChevronRight size={16} strokeWidth={1.9} aria-hidden="true" />
      </IconButton>
    </nav>
  );
}

export interface TablePaginationFooterProps {
  readonly children?: ReactNode;
  readonly className?: string;
  readonly pagination: ReactNode;
  readonly rowsPerPage?: ReactNode;
  readonly summary?: ReactNode;
}

export function TablePaginationFooter({
  children,
  className,
  pagination,
  rowsPerPage,
  summary,
}: Readonly<TablePaginationFooterProps>) {
  return (
    <div className={cn("data-table-footer", className)}>
      <div className="data-table-footer-summary">
        {summary}
        {rowsPerPage}
        {children}
      </div>
      {pagination}
    </div>
  );
}
