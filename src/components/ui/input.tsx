import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type InputControlSize = "default" | "compact";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "placeholder" | "value"> {
  controlSize?: InputControlSize;
  inputClassName?: string;
  invalid?: boolean;
  leadingIcon?: ReactNode;
  placeholder?: string | null;
  trailingContent?: ReactNode;
  value?: InputHTMLAttributes<HTMLInputElement>["value"] | null;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    "aria-invalid": ariaInvalid,
    className,
    controlSize = "default",
    disabled,
    inputClassName,
    invalid = false,
    leadingIcon,
    placeholder,
    readOnly,
    trailingContent,
    value,
    ...inputProps
  },
  ref,
) {
  const isInvalid =
    invalid || (ariaInvalid !== undefined && ariaInvalid !== false && ariaInvalid !== "false");

  return (
    <span
      className={cn("ui-input", `ui-input--${controlSize}`, className)}
      data-disabled={disabled || undefined}
      data-invalid={isInvalid || undefined}
      data-readonly={readOnly || undefined}
    >
      {leadingIcon ? (
        <span className="ui-input-leading" aria-hidden="true">
          {leadingIcon}
        </span>
      ) : null}
      <input
        {...inputProps}
        ref={ref}
        className={cn("ui-input-control", inputClassName)}
        disabled={disabled}
        placeholder={placeholder ?? undefined}
        readOnly={readOnly}
        value={value ?? undefined}
        aria-invalid={ariaInvalid ?? (invalid || undefined)}
      />
      {trailingContent ? <span className="ui-input-trailing">{trailingContent}</span> : null}
    </span>
  );
});
