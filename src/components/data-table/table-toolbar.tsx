import { Search } from "lucide-react";
import { useId, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Input, type InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface TableToolbarProps {
  readonly actions?: ReactNode;
  readonly className?: string;
  readonly filters?: ReactNode;
  readonly search?: ReactNode;
  readonly status?: ReactNode;
}

export function TableToolbar({
  actions,
  className,
  filters,
  search,
  status,
}: Readonly<TableToolbarProps>) {
  return (
    <div className={cn("data-table-toolbar", className)}>
      <div className="data-table-toolbar-controls">
        {search}
        {filters}
      </div>
      {status ? <div className="data-table-toolbar-status">{status}</div> : null}
      {actions ? <div className="data-table-toolbar-actions">{actions}</div> : null}
    </div>
  );
}

export interface TableSearchProps extends Omit<InputProps, "aria-label" | "leadingIcon" | "type"> {
  readonly label: string;
}

export function TableSearch({
  className,
  id,
  label,
  placeholder,
  ...inputProps
}: Readonly<TableSearchProps>) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className={cn("data-table-search", className)}>
      <label className="sr-only" htmlFor={inputId}>
        {label}
      </label>
      <Input
        {...inputProps}
        id={inputId}
        type="search"
        placeholder={placeholder ?? label}
        leadingIcon={<Search size={16} strokeWidth={1.8} />}
      />
    </div>
  );
}

export interface TableFiltersProps {
  readonly activeFilterCount?: number;
  readonly children: ReactNode;
  readonly clearAction?: ReactNode;
  readonly label?: string;
}

export function TableFilters({
  activeFilterCount = 0,
  children,
  clearAction,
  label = "Table filters",
}: Readonly<TableFiltersProps>) {
  return (
    <div className="data-table-filters" role="group" aria-label={label}>
      {children}
      {activeFilterCount > 0 ? (
        <Badge size="compact" variant="violet">
          {activeFilterCount} active
        </Badge>
      ) : null}
      {clearAction}
    </div>
  );
}

export interface TableSelectionSummaryProps {
  readonly count: number;
}

export function TableSelectionSummary({ count }: Readonly<TableSelectionSummaryProps>) {
  return (
    <Badge variant={count > 0 ? "violet" : "neutral"} aria-live="polite">
      {count} {count === 1 ? "row" : "rows"} selected
    </Badge>
  );
}
