"use client";

import { useCallback } from "react";
import { cn } from "@/lib/utils";

export interface RowSelectionCheckboxProps {
  readonly checked: boolean;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly indeterminate?: boolean;
  readonly label: string;
  readonly onCheckedChange: (checked: boolean) => void;
}

export function RowSelectionCheckbox({
  checked,
  className,
  disabled = false,
  indeterminate = false,
  label,
  onCheckedChange,
}: Readonly<RowSelectionCheckboxProps>) {
  const setCheckboxRef = useCallback(
    (checkbox: HTMLInputElement | null) => {
      if (checkbox) {
        checkbox.indeterminate = indeterminate;
      }
    },
    [indeterminate],
  );

  return (
    <label className={cn("data-table-checkbox-target", className)}>
      <input
        ref={setCheckboxRef}
        className="data-table-checkbox"
        type="checkbox"
        aria-label={label}
        checked={checked}
        disabled={disabled}
        onChange={(event) => onCheckedChange(event.currentTarget.checked)}
      />
    </label>
  );
}
