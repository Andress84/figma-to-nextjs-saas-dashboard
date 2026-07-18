"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ToggleLabel = { label: string; labelledBy?: never } | { label?: never; labelledBy: string };

type ToggleNativeProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-label" | "aria-labelledby" | "children" | "onClick" | "role"
>;

export type ToggleProps = ToggleNativeProps &
  ToggleLabel & {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
  };

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  {
    checked,
    className,
    disabled,
    label,
    labelledBy,
    onCheckedChange,
    type = "button",
    ...buttonProps
  },
  ref,
) {
  return (
    <button
      {...buttonProps}
      ref={ref}
      className={cn("ui-toggle", className)}
      type={type}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      aria-labelledby={labelledBy}
      disabled={disabled}
      data-state={checked ? "checked" : "unchecked"}
      onClick={() => onCheckedChange(!checked)}
    >
      <span className="ui-toggle-track" aria-hidden="true">
        <span className="ui-toggle-thumb" />
      </span>
    </button>
  );
});
