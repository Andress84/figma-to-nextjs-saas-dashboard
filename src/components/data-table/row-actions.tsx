"use client";

import { Ellipsis } from "lucide-react";
import {
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { IconButton } from "@/components/ui/icon-button";
import type { DataTableRowAction } from "./data-table-types";

const VIEWPORT_PADDING = 8;
const MENU_GAP = 8;
const MENU_WIDTH = 196;
const MENU_ITEM_HEIGHT = 44;
const MENU_VERTICAL_PADDING = 8;

interface MenuPosition {
  readonly left: number;
  readonly placement: "above" | "below";
  readonly top: number;
}

export interface RowActionsProps<TData> {
  readonly actions: readonly DataTableRowAction<TData>[];
  readonly row: TData;
  readonly rowLabel: string;
}

function getMenuPosition(trigger: HTMLButtonElement, actionCount: number): MenuPosition {
  const triggerRect = trigger.getBoundingClientRect();
  const availableWidth = Math.max(0, window.innerWidth - VIEWPORT_PADDING * 2);
  const availableHeight = Math.max(0, window.innerHeight - VIEWPORT_PADDING * 2);
  const menuWidth = Math.min(MENU_WIDTH, availableWidth);
  const menuHeight = Math.min(
    actionCount * MENU_ITEM_HEIGHT + MENU_VERTICAL_PADDING,
    availableHeight,
  );
  const fitsAbove = triggerRect.top - MENU_GAP - menuHeight >= VIEWPORT_PADDING;
  const fitsBelow =
    triggerRect.bottom + MENU_GAP + menuHeight <= window.innerHeight - VIEWPORT_PADDING;
  const placement = fitsBelow || !fitsAbove ? "below" : "above";
  const preferredTop =
    placement === "below" ? triggerRect.bottom + MENU_GAP : triggerRect.top - MENU_GAP - menuHeight;
  const top = Math.min(
    Math.max(VIEWPORT_PADDING, preferredTop),
    Math.max(VIEWPORT_PADDING, window.innerHeight - menuHeight - VIEWPORT_PADDING),
  );
  const preferredLeft = triggerRect.right - menuWidth;
  const left = Math.min(
    Math.max(VIEWPORT_PADDING, preferredLeft),
    Math.max(VIEWPORT_PADDING, window.innerWidth - menuWidth - VIEWPORT_PADDING),
  );

  return { left, placement, top };
}

export function RowActions<TData>({ actions, row, rowLabel }: Readonly<RowActionsProps<TData>>) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition>({
    left: VIEWPORT_PADDING,
    placement: "below",
    top: VIEWPORT_PADDING,
  });
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback((restoreFocus: boolean) => {
    setIsOpen(false);

    if (restoreFocus) {
      queueMicrotask(() => triggerRef.current?.focus());
    }
  }, []);

  const openMenu = useCallback(() => {
    const trigger = triggerRef.current;

    if (!trigger || actions.length === 0) {
      return;
    }

    setPosition(getMenuPosition(trigger, actions.length));
    setIsOpen(true);
  }, [actions.length]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    menuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]:not(:disabled)')?.focus();

    function handleDocumentPointerDown(event: PointerEvent) {
      const target = event.target;

      if (
        target instanceof Node &&
        !menuRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    function handleDocumentKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu(true);
      }
    }

    function handleViewportChange() {
      setIsOpen(false);
    }

    document.addEventListener("pointerdown", handleDocumentPointerDown);
    document.addEventListener("keydown", handleDocumentKeyDown);
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    return () => {
      document.removeEventListener("pointerdown", handleDocumentPointerDown);
      document.removeEventListener("keydown", handleDocumentKeyDown);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [closeMenu, isOpen]);

  function moveMenuFocus(event: KeyboardEvent<HTMLDivElement>) {
    const menuItems = [
      ...event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'),
    ].filter((item) => !item.disabled);
    const currentIndex = menuItems.findIndex((item) => item === document.activeElement);
    let nextIndex = currentIndex;

    if (event.key === "ArrowDown") {
      nextIndex = currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0;
    } else if (event.key === "ArrowUp") {
      nextIndex = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = menuItems.length - 1;
    } else if (event.key === "Tab") {
      setIsOpen(false);
      return;
    } else {
      return;
    }

    event.preventDefault();
    menuItems[nextIndex]?.focus();
  }

  function handleTriggerPointerDown(event: ReactPointerEvent<HTMLButtonElement>) {
    if (event.button !== 0) {
      return;
    }

    event.stopPropagation();
  }

  return (
    <>
      <IconButton
        ref={triggerRef}
        label={`Actions for ${rowLabel}`}
        size="compact"
        variant="ghost"
        aria-controls={isOpen ? menuId : undefined}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        disabled={actions.length === 0}
        onClick={() => (isOpen ? closeMenu(false) : openMenu())}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            openMenu();
          }
        }}
        onPointerDown={handleTriggerPointerDown}
      >
        <Ellipsis size={18} strokeWidth={2} aria-hidden="true" />
      </IconButton>
      {isOpen
        ? createPortal(
            <div
              ref={menuRef}
              id={menuId}
              className="data-table-row-actions-menu"
              role="menu"
              aria-label={`Actions for ${rowLabel}`}
              data-placement={position.placement}
              style={{ left: position.left, top: position.top }}
              onKeyDown={moveMenuFocus}
            >
              {actions.map((action) => (
                <button
                  className="data-table-row-action"
                  key={action.id}
                  type="button"
                  role="menuitem"
                  data-tone={action.tone ?? "default"}
                  disabled={action.disabled}
                  onClick={() => {
                    action.onSelect(row);
                    closeMenu(true);
                  }}
                >
                  {action.icon ? (
                    <span className="data-table-row-action-icon" aria-hidden="true">
                      {action.icon}
                    </span>
                  ) : null}
                  <span>{action.label}</span>
                </button>
              ))}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
