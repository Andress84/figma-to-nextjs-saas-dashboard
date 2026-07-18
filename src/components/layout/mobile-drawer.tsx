"use client";

import { Search, X } from "lucide-react";
import { type KeyboardEvent as ReactKeyboardEvent, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ProfileRow } from "@/components/dashboard/profile-row";
import { WorkspaceSwitcher } from "@/components/dashboard/workspace-switcher";
import { appShellConfig } from "@/data/mock/app-shell";
import { DashboardNavigation } from "./dashboard-navigation";
import { SubteraBrand } from "./subtera-brand";

export const mobileDrawerId = "mobile-navigation-drawer";

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

interface MobileDrawerProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

export function MobileDrawer({ isOpen, onRequestClose }: Readonly<MobileDrawerProps>) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const portalNode = typeof document === "undefined" ? null : document.body;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const body = document.body;
    const applicationShell = document.querySelector<HTMLElement>(".dashboard-shell");
    const previousBodyOverflow = body.style.overflow;
    const previousBodyPaddingRight = body.style.paddingRight;
    const wasApplicationShellInert = applicationShell?.hasAttribute("inert") ?? false;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const existingPaddingRight = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;

    body.style.overflow = "hidden";

    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${existingPaddingRight + scrollbarWidth}px`;
    }

    if (applicationShell) {
      applicationShell.setAttribute("inert", "");
    }

    return () => {
      body.style.overflow = previousBodyOverflow;
      body.style.paddingRight = previousBodyPaddingRight;

      if (applicationShell) {
        if (wasApplicationShellInert) {
          applicationShell.setAttribute("inert", "");
        } else {
          applicationShell.removeAttribute("inert");
        }
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !portalNode) {
      return;
    }

    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => window.cancelAnimationFrame(focusFrame);
  }, [isOpen, portalNode]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onRequestClose();
      }
    }

    document.addEventListener("keydown", closeOnEscape);

    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isOpen, onRequestClose]);

  useEffect(() => {
    const desktopBreakpoint = window.matchMedia("(min-width: 64rem)");

    function closeAtDesktop(event: MediaQueryListEvent) {
      if (event.matches) {
        onRequestClose();
      }
    }

    desktopBreakpoint.addEventListener("change", closeAtDesktop);

    return () => {
      desktopBreakpoint.removeEventListener("change", closeAtDesktop);
    };
  }, [onRequestClose]);

  function containFocus(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab") {
      return;
    }

    const drawer = drawerRef.current;

    if (!drawer) {
      return;
    }

    const focusableElements = Array.from(drawer.querySelectorAll<HTMLElement>(focusableSelector));
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

  if (!isOpen || !portalNode) {
    return null;
  }

  return createPortal(
    <div
      className="mobile-drawer-layer"
      onKeyDown={containFocus}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onRequestClose();
        }
      }}
    >
      <div
        ref={drawerRef}
        id={mobileDrawerId}
        className="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-navigation-title"
      >
        <div className="mobile-drawer-header">
          <h2 className="sr-only" id="mobile-navigation-title">
            Navigation menu
          </h2>
          <SubteraBrand onNavigate={onRequestClose} />
          <button
            ref={closeButtonRef}
            className="mobile-icon-button mobile-drawer-close"
            type="button"
            aria-label="Close navigation menu"
            onClick={onRequestClose}
          >
            <X size={22} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>

        <WorkspaceSwitcher name={appShellConfig.workspace.name} />

        <div className="workspace-search mobile-workspace-search" role="search">
          <label className="sr-only" htmlFor="mobile-workspace-search">
            Search workspace
          </label>
          <Search size={18} strokeWidth={1.8} aria-hidden="true" />
          <input
            id="mobile-workspace-search"
            name="mobile-workspace-search"
            type="search"
            placeholder="Search workspace"
          />
        </div>

        <nav className="mobile-drawer-navigation" aria-label="Mobile primary navigation">
          <DashboardNavigation onNavigate={onRequestClose} />
        </nav>

        <ProfileRow {...appShellConfig.profile} />
      </div>
    </div>,
    portalNode,
  );
}
