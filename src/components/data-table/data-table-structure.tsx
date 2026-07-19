import {
  type HTMLAttributes,
  type ReactNode,
  type TableHTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DataTableColumnAlignment } from "./data-table-types";

export interface DataTableContainerProps extends HTMLAttributes<HTMLDivElement> {
  readonly children: ReactNode;
  readonly footer?: ReactNode;
  readonly header?: ReactNode;
  readonly toolbar?: ReactNode;
  readonly viewportLabel: string;
}

export function DataTableContainer({
  children,
  className,
  footer,
  header,
  toolbar,
  viewportLabel,
  ...containerProps
}: Readonly<DataTableContainerProps>) {
  return (
    <Card {...containerProps} className={cn("data-table-container", className)} padding="none">
      {header}
      {toolbar}
      <div
        className="data-table-viewport"
        role="region"
        aria-label={viewportLabel}
        tabIndex={0}
        style={{ overflowX: "auto" }}
      >
        {children}
      </div>
      {footer}
    </Card>
  );
}

export interface DataTableFrameHeaderProps {
  readonly actions?: ReactNode;
  readonly description?: string;
  readonly title: string;
}

export function DataTableFrameHeader({
  actions,
  description,
  title,
}: Readonly<DataTableFrameHeaderProps>) {
  return (
    <div className="data-table-frame-header">
      <div className="data-table-frame-heading">
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {actions ? <div className="data-table-frame-actions">{actions}</div> : null}
    </div>
  );
}

export function DataTableElement({
  className,
  ...tableProps
}: Readonly<TableHTMLAttributes<HTMLTableElement>>) {
  return <table {...tableProps} className={cn("data-table", className)} />;
}

export interface DataTableCaptionProps {
  readonly children: ReactNode;
  readonly visible?: boolean;
}

export function DataTableCaption({ children, visible = false }: Readonly<DataTableCaptionProps>) {
  return <caption className={visible ? "data-table-caption" : "sr-only"}>{children}</caption>;
}

export function DataTableHeader({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <thead>
      <tr>{children}</tr>
    </thead>
  );
}

interface AlignedCellProps {
  readonly align?: DataTableColumnAlignment;
  readonly emphasized?: boolean;
  readonly numeric?: boolean;
}

export type DataTableHeaderCellProps = Omit<ThHTMLAttributes<HTMLTableCellElement>, "align"> &
  AlignedCellProps;

export function DataTableHeaderCell({
  align = "start",
  children,
  className,
  emphasized = false,
  numeric = false,
  scope = "col",
  ...headerProps
}: Readonly<DataTableHeaderCellProps>) {
  return (
    <th
      {...headerProps}
      className={cn("data-table-header-cell", className)}
      scope={scope}
      data-align={align}
      data-emphasized={emphasized || undefined}
      data-numeric={numeric || undefined}
    >
      {children}
    </th>
  );
}

export interface DataTableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  readonly selected?: boolean;
}

export function DataTableRow({
  className,
  selected = false,
  ...rowProps
}: Readonly<DataTableRowProps>) {
  return (
    <tr
      {...rowProps}
      className={cn("data-table-row", className)}
      data-selected={selected || undefined}
    />
  );
}

export type DataTableCellProps = Omit<TdHTMLAttributes<HTMLTableCellElement>, "align"> &
  AlignedCellProps;

export function DataTableCell({
  align = "start",
  className,
  emphasized = false,
  numeric = false,
  ...cellProps
}: Readonly<DataTableCellProps>) {
  return (
    <td
      {...cellProps}
      className={cn("data-table-cell", className)}
      data-align={align}
      data-emphasized={emphasized || undefined}
      data-numeric={numeric || undefined}
    />
  );
}

export type DataTableRowHeaderCellProps = Omit<ThHTMLAttributes<HTMLTableCellElement>, "align"> &
  AlignedCellProps;

export function DataTableRowHeaderCell({
  align = "start",
  className,
  emphasized = false,
  numeric = false,
  scope = "row",
  ...cellProps
}: Readonly<DataTableRowHeaderCellProps>) {
  return (
    <th
      {...cellProps}
      className={cn("data-table-cell data-table-row-header-cell", className)}
      scope={scope}
      data-align={align}
      data-emphasized={emphasized || undefined}
      data-numeric={numeric || undefined}
    />
  );
}
