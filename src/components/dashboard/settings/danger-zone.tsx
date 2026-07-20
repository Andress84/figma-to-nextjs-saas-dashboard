import {
  type KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { SettingsSection } from "./settings-section";
import { useSettings } from "./settings-context";

const focusableSelector = [
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "a[href]",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function DangerZone() {
  const { announce, draft } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const portalNode = typeof document === "undefined" ? null : document.body;

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    queueMicrotask(() => triggerRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const body = document.body;
    const applicationShell = document.querySelector<HTMLElement>(".dashboard-shell");
    const previousBodyOverflow = body.style.overflow;
    const wasApplicationShellInert = applicationShell?.hasAttribute("inert") ?? false;

    body.style.overflow = "hidden";
    applicationShell?.setAttribute("inert", "");
    const focusFrame = window.requestAnimationFrame(() => cancelRef.current?.focus());

    function dismissOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDialog();
      }
    }

    document.addEventListener("keydown", dismissOnEscape);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", dismissOnEscape);
      body.style.overflow = previousBodyOverflow;

      if (applicationShell) {
        if (wasApplicationShellInert) {
          applicationShell.setAttribute("inert", "");
        } else {
          applicationShell.removeAttribute("inert");
        }
      }
    };
  }, [closeDialog, isOpen]);

  function containFocus(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab" || !dialogRef.current) {
      return;
    }

    const focusableElements = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector),
    );

    if (focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    const activeIndex = focusableElements.findIndex(
      (element) => element === document.activeElement,
    );
    const fallbackIndex = event.shiftKey ? focusableElements.length - 1 : 0;
    const nextIndex =
      activeIndex === -1
        ? fallbackIndex
        : (activeIndex + (event.shiftKey ? -1 : 1) + focusableElements.length) %
          focusableElements.length;

    focusableElements[nextIndex]?.focus();
  }

  return (
    <>
      <SettingsSection
        id="danger-zone"
        className="settings-danger-zone"
        title="Danger Zone"
        description="Permanent workspace actions require additional confirmation."
        variant="danger"
      >
        <div className="settings-danger-body">
          <p>
            Deleting this workspace removes its reporting configuration and disconnects all linked
            customer data. This action cannot be undone.
          </p>
          <Button ref={triggerRef} variant="destructive" onClick={() => setIsOpen(true)}>
            Delete workspace
          </Button>
        </div>
      </SettingsSection>

      {isOpen && portalNode
        ? createPortal(
            <div
              className="settings-dialog-layer"
              onKeyDown={containFocus}
              onClick={(event) => {
                if (event.target === event.currentTarget) {
                  closeDialog();
                }
              }}
            >
              <div
                ref={dialogRef}
                className="settings-confirmation-dialog"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="delete-workspace-title"
                aria-describedby="delete-workspace-description"
              >
                <h2 id="delete-workspace-title">Delete {draft.workspaceProfile.workspaceName}?</h2>
                <p id="delete-workspace-description">
                  This portfolio demo will not delete data. Confirming only closes this dialog and
                  records accessible, nonpersistent feedback.
                </p>
                <div className="settings-confirmation-actions">
                  <Button ref={cancelRef} variant="ghost" onClick={closeDialog}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      announce(
                        "Delete workspace was confirmed as a demo action. No workspace data was deleted.",
                      );
                      closeDialog();
                    }}
                  >
                    Confirm demo deletion
                  </Button>
                </div>
              </div>
            </div>,
            portalNode,
          )
        : null}
    </>
  );
}
