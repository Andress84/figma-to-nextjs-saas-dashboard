import { ChevronDown } from "lucide-react";
import { forwardRef, type ReactNode, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type SelectControlSize = "default" | "compact";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  controlSize?: SelectControlSize;
  invalid?: boolean;
  leadingIcon?: ReactNode;
  selectClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    "aria-invalid": ariaInvalid,
    children,
    className,
    controlSize = "default",
    disabled,
    invalid = false,
    leadingIcon,
    multiple,
    selectClassName,
    ...selectProps
  },
  ref,
) {
  const isInvalid =
    invalid || (ariaInvalid !== undefined && ariaInvalid !== false && ariaInvalid !== "false");

  return (
    <span
      className={cn("ui-select", `ui-select--${controlSize}`, className)}
      data-disabled={disabled || undefined}
      data-invalid={isInvalid || undefined}
      data-leading={Boolean(leadingIcon) || undefined}
    >
      {leadingIcon ? (
        <span className="ui-select-leading" aria-hidden="true">
          {leadingIcon}
        </span>
      ) : null}
      <select
        {...selectProps}
        ref={ref}
        className={cn("ui-select-control", selectClassName)}
        disabled={disabled}
        multiple={multiple}
        aria-invalid={ariaInvalid ?? (invalid || undefined)}
      >
        {children}
      </select>
      {!multiple ? (
        <ChevronDown className="ui-select-chevron" size={16} strokeWidth={1.8} aria-hidden="true" />
      ) : null}
    </span>
  );
});
