"use client";

import { Bell, Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { MobileDrawer, mobileDrawerId } from "./mobile-drawer";
import { SubteraBrand } from "./subtera-brand";

export function MobileNavigation() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const shouldRestoreFocusRef = useRef(false);

  const closeDrawer = useCallback(() => {
    shouldRestoreFocusRef.current = true;
    setIsDrawerOpen(false);
  }, []);

  useEffect(() => {
    if (isDrawerOpen || !shouldRestoreFocusRef.current) {
      return;
    }

    shouldRestoreFocusRef.current = false;
    const focusFrame = window.requestAnimationFrame(() => menuButtonRef.current?.focus());

    return () => window.cancelAnimationFrame(focusFrame);
  }, [isDrawerOpen]);

  useEffect(() => {
    if (!isNotificationVisible) {
      return;
    }

    function dismissOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsNotificationVisible(false);
      }
    }

    document.addEventListener("keydown", dismissOnEscape);

    return () => document.removeEventListener("keydown", dismissOnEscape);
  }, [isNotificationVisible]);

  function openDrawer() {
    setIsNotificationVisible(false);
    setIsDrawerOpen(true);
  }

  return (
    <>
      <header className="mobile-navigation">
        <SubteraBrand className="subtera-brand-mobile" />
        <div className="mobile-navigation-actions">
          <button
            className="mobile-icon-button notification-button"
            type="button"
            aria-label="Notifications"
            aria-expanded={isNotificationVisible}
            onClick={() => setIsNotificationVisible((isVisible) => !isVisible)}
          >
            <Bell size={19} strokeWidth={1.8} aria-hidden="true" />
            <span className="notification-dot" aria-hidden="true" />
          </button>
          <button
            ref={menuButtonRef}
            className="mobile-icon-button"
            type="button"
            aria-label="Open navigation menu"
            aria-haspopup="dialog"
            aria-expanded={isDrawerOpen}
            aria-controls={mobileDrawerId}
            onClick={openDrawer}
          >
            <Menu size={20} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>

        {isNotificationVisible ? (
          <div className="mobile-notification-status" role="status">
            <span>You’re all caught up.</span>
            <button
              type="button"
              aria-label="Dismiss notification status"
              onClick={() => setIsNotificationVisible(false)}
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </header>

      <MobileDrawer isOpen={isDrawerOpen} onRequestClose={closeDrawer} />
    </>
  );
}
