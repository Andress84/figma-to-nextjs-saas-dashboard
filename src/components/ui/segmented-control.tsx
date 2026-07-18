"use client";

import { type HTMLAttributes, type KeyboardEvent, type ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

export interface SegmentedControlOption {
  disabled?: boolean;
  label: ReactNode;
  value: string;
}

export interface SegmentedControlProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onChange" | "onKeyDown"> {
  label: string;
  onValueChange: (value: string) => void;
  options: readonly SegmentedControlOption[];
  value: string;
}

export function SegmentedControl({
  className,
  label,
  onValueChange,
  options,
  value,
  ...groupProps
}: Readonly<SegmentedControlProps>) {
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedEnabledIndex = options.findIndex(
    (option) => option.value === value && !option.disabled,
  );
  const rovingIndex =
    selectedEnabledIndex >= 0
      ? selectedEnabledIndex
      : options.findIndex((option) => !option.disabled);

  function selectAt(index: number) {
    const option = options[index];

    if (!option || option.disabled) {
      return;
    }

    optionRefs.current[index]?.focus();

    if (option.value !== value) {
      onValueChange(option.value);
    }
  }

  function moveFrom(index: number, direction: 1 | -1) {
    if (options.length === 0) {
      return;
    }

    for (let offset = 1; offset <= options.length; offset += 1) {
      const candidate = (index + direction * offset + options.length) % options.length;

      if (!options[candidate]?.disabled) {
        selectAt(candidate);
        return;
      }
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      moveFrom(index, -1);
    } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      moveFrom(index, 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      selectAt(options.findIndex((option) => !option.disabled));
    } else if (event.key === "End") {
      event.preventDefault();
      selectAt(options.findLastIndex((option) => !option.disabled));
    }
  }

  return (
    <div
      {...groupProps}
      className={cn("ui-segmented-control", className)}
      role="radiogroup"
      aria-label={label}
    >
      {options.map((option, index) => {
        const isSelected = option.value === value;

        return (
          <button
            ref={(element) => {
              optionRefs.current[index] = element;
            }}
            key={option.value}
            className="ui-segmented-option"
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-disabled={option.disabled || undefined}
            disabled={option.disabled}
            tabIndex={index === rovingIndex ? 0 : -1}
            data-selected={isSelected || undefined}
            onClick={() => selectAt(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
