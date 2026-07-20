"use client";

import { type HTMLAttributes, type KeyboardEvent, type ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  controlsId?: string;
  disabled?: boolean;
  id?: string;
  label: ReactNode;
  value: string;
}

export interface TabsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onChange" | "onKeyDown"> {
  items: readonly TabItem[];
  label: string;
  onValueChange: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  value: string;
}

export function Tabs({
  className,
  items,
  label,
  onValueChange,
  orientation = "horizontal",
  value,
  ...tabListProps
}: Readonly<TabsProps>) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedEnabledIndex = items.findIndex((item) => item.value === value && !item.disabled);
  const rovingIndex =
    selectedEnabledIndex >= 0 ? selectedEnabledIndex : items.findIndex((item) => !item.disabled);

  function activateAt(index: number) {
    const item = items[index];

    if (!item || item.disabled) {
      return;
    }

    tabRefs.current[index]?.focus();

    if (item.value !== value) {
      onValueChange(item.value);
    }
  }

  function moveFrom(index: number, direction: 1 | -1) {
    if (items.length === 0) {
      return;
    }

    for (let offset = 1; offset <= items.length; offset += 1) {
      const candidate = (index + direction * offset + items.length) % items.length;

      if (!items[candidate]?.disabled) {
        activateAt(candidate);
        return;
      }
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const previousKey = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp";
    const nextKey = orientation === "horizontal" ? "ArrowRight" : "ArrowDown";

    if (event.key === previousKey) {
      event.preventDefault();
      moveFrom(index, -1);
    } else if (event.key === nextKey) {
      event.preventDefault();
      moveFrom(index, 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      const firstEnabled = items.findIndex((item) => !item.disabled);
      activateAt(firstEnabled);
    } else if (event.key === "End") {
      event.preventDefault();
      const lastEnabled = items.findLastIndex((item) => !item.disabled);
      activateAt(lastEnabled);
    }
  }

  return (
    <div
      {...tabListProps}
      className={cn("ui-tabs", `ui-tabs--${orientation}`, className)}
      role="tablist"
      aria-label={label}
      aria-orientation={orientation}
    >
      {items.map((item, index) => {
        const isSelected = item.value === value;

        return (
          <button
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            key={item.value}
            id={item.id}
            className="ui-tab"
            type="button"
            role="tab"
            aria-selected={isSelected}
            aria-controls={item.controlsId}
            aria-disabled={item.disabled || undefined}
            disabled={item.disabled}
            tabIndex={index === rovingIndex ? 0 : -1}
            data-selected={isSelected || undefined}
            onClick={() => activateAt(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
