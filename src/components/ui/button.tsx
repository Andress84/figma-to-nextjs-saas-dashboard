import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
export type ButtonSize = "default" | "compact";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  leadingIcon?: ReactNode;
  size?: ButtonSize;
  trailingIcon?: ReactNode;
  variant?: ButtonVariant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className,
    disabled,
    leadingIcon,
    loading = false,
    loadingText = "Loading",
    size = "default",
    trailingIcon,
    type = "button",
    variant = "primary",
    ...buttonProps
  },
  ref,
) {
  return (
    <button
      {...buttonProps}
      ref={ref}
      className={cn("ui-button", `ui-button--${variant}`, `ui-button--${size}`, className)}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      data-loading={loading || undefined}
    >
      <span className="ui-button-content" aria-hidden={loading || undefined}>
        {leadingIcon ? (
          <span className="ui-button-icon" aria-hidden="true">
            {leadingIcon}
          </span>
        ) : null}
        <span>{children}</span>
        {trailingIcon ? (
          <span className="ui-button-icon" aria-hidden="true">
            {trailingIcon}
          </span>
        ) : null}
      </span>
      {loading ? (
        <span className="ui-button-loading" aria-live="polite">
          <span className="ui-button-spinner" aria-hidden="true" />
          <span className="sr-only">{loadingText}</span>
        </span>
      ) : null}
    </button>
  );
});
