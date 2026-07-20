"use client";

import { Bell, ChevronDown, CircleHelp, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { IconButton } from "@/components/ui/icon-button";
import { appShellConfig } from "@/data/mock/app-shell";
import { DashboardBreadcrumb } from "./dashboard-breadcrumb";

type UtilityStatus = "help" | "notifications" | null;

const utilityStatusId = "top-header-utility-status";

export function TopHeader() {
  const [utilityStatus, setUtilityStatus] = useState<UtilityStatus>(null);
  const helpButtonRef = useRef<HTMLButtonElement>(null);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!utilityStatus) {
      return;
    }

    function dismissOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setUtilityStatus(null);
      }
    }

    document.addEventListener("keydown", dismissOnEscape);

    return () => document.removeEventListener("keydown", dismissOnEscape);
  }, [utilityStatus]);

  function toggleUtilityStatus(status: Exclude<UtilityStatus, null>) {
    setUtilityStatus((current) => (current === status ? null : status));
  }

  function dismissUtilityStatus() {
    const activeStatus = utilityStatus;
    setUtilityStatus(null);
    queueMicrotask(() => {
      if (activeStatus === "help") {
        helpButtonRef.current?.focus();
      } else if (activeStatus === "notifications") {
        notificationButtonRef.current?.focus();
      }
    });
  }

  return (
    <header className="top-header">
      <DashboardBreadcrumb />
      <div className="top-header-actions">
        <IconButton
          ref={helpButtonRef}
          className="top-header-icon-button"
          label="Help"
          size="mobile"
          active={utilityStatus === "help"}
          aria-controls={utilityStatusId}
          aria-expanded={utilityStatus === "help"}
          onClick={() => toggleUtilityStatus("help")}
        >
          <CircleHelp size={19} strokeWidth={1.8} aria-hidden="true" />
        </IconButton>
        <IconButton
          ref={notificationButtonRef}
          className="top-header-icon-button notification-button"
          label="Notifications"
          size="mobile"
          active={utilityStatus === "notifications"}
          aria-controls={utilityStatusId}
          aria-expanded={utilityStatus === "notifications"}
          onClick={() => toggleUtilityStatus("notifications")}
        >
          <Bell size={19} strokeWidth={1.8} aria-hidden="true" />
          <span className="notification-dot" aria-hidden="true" />
        </IconButton>
        <span className="top-header-divider" aria-hidden="true" />
        <div className="top-header-profile">
          <Avatar
            className="top-header-avatar"
            name={appShellConfig.profile.name}
            initials={appShellConfig.profile.initials}
            decorative
          />
          <span className="sr-only">
            {appShellConfig.profile.name}, {appShellConfig.profile.role}
          </span>
          <ChevronDown size={17} aria-hidden="true" />
        </div>
      </div>

      {utilityStatus ? (
        <div
          className="top-header-utility-status"
          id={utilityStatusId}
          role="status"
          aria-live="polite"
        >
          <span>
            {utilityStatus === "help"
              ? "Help resources are not connected in this frontend demo."
              : "You’re all caught up."}
          </span>
          <IconButton
            className="top-header-utility-dismiss"
            label="Dismiss utility message"
            size="mobile"
            variant="ghost"
            onClick={dismissUtilityStatus}
          >
            <X size={16} aria-hidden="true" />
          </IconButton>
        </div>
      ) : null}
    </header>
  );
}
