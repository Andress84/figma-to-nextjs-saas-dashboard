"use client";

import {
  cloneElement,
  type FocusEventHandler,
  type KeyboardEventHandler,
  type PointerEventHandler,
  type ReactElement,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

export type TooltipPlacement = "top" | "right" | "bottom" | "left";

interface TooltipTriggerProps {
  "aria-describedby"?: string;
  onBlur?: FocusEventHandler<HTMLElement>;
  onFocus?: FocusEventHandler<HTMLElement>;
  onKeyDown?: KeyboardEventHandler<HTMLElement>;
  onPointerEnter?: PointerEventHandler<HTMLElement>;
  onPointerLeave?: PointerEventHandler<HTMLElement>;
}

export interface TooltipProps {
  children: ReactElement<TooltipTriggerProps>;
  className?: string;
  content: ReactNode;
  delay?: number;
  placement?: TooltipPlacement;
}

export function Tooltip({
  children,
  className,
  content,
  delay = 300,
  placement = "top",
}: Readonly<TooltipProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipId = useId();
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearOpenTimer() {
    if (openTimer.current !== null) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }
  }

  function openAfterDelay() {
    clearOpenTimer();

    if (delay <= 0) {
      setIsOpen(true);
      return;
    }

    openTimer.current = setTimeout(() => {
      openTimer.current = null;
      setIsOpen(true);
    }, delay);
  }

  function openImmediately() {
    clearOpenTimer();
    setIsOpen(true);
  }

  function close() {
    clearOpenTimer();
    setIsOpen(false);
  }

  useEffect(
    () => () => {
      if (openTimer.current !== null) {
        clearTimeout(openTimer.current);
      }
    },
    [],
  );

  const describedBy = isOpen
    ? [children.props["aria-describedby"], tooltipId].filter(Boolean).join(" ")
    : children.props["aria-describedby"];

  // cloneElement preserves the single trigger's own ref while adding accessible interaction props.
  // eslint-disable-next-line react-hooks/refs
  const trigger = cloneElement(children, {
    "aria-describedby": describedBy,
    onBlur: (event) => {
      children.props.onBlur?.(event);
      close();
    },
    onFocus: (event) => {
      children.props.onFocus?.(event);
      openImmediately();
    },
    onKeyDown: (event) => {
      children.props.onKeyDown?.(event);

      if (event.key === "Escape") {
        close();
      }
    },
    onPointerEnter: (event) => {
      children.props.onPointerEnter?.(event);
      openAfterDelay();
    },
    onPointerLeave: (event) => {
      children.props.onPointerLeave?.(event);
      close();
    },
  });

  return (
    <span className="ui-tooltip-anchor" data-placement={placement}>
      {trigger}
      {isOpen ? (
        <span id={tooltipId} className={cn("ui-tooltip", className)} role="tooltip">
          {content}
        </span>
      ) : null}
    </span>
  );
}
