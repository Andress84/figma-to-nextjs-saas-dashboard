import { Bell, ChevronDown, CircleHelp } from "lucide-react";
import { appShellConfig } from "@/data/mock/app-shell";
import { DashboardBreadcrumb } from "./dashboard-breadcrumb";

export function TopHeader() {
  return (
    <header className="top-header">
      <DashboardBreadcrumb />
      <div className="top-header-actions">
        <button className="top-header-icon-button" type="button" aria-label="Help">
          <CircleHelp size={19} strokeWidth={1.8} aria-hidden="true" />
        </button>
        <button
          className="top-header-icon-button notification-button"
          type="button"
          aria-label="Notifications"
        >
          <Bell size={19} strokeWidth={1.8} aria-hidden="true" />
          <span className="notification-dot" aria-hidden="true" />
        </button>
        <span className="top-header-divider" aria-hidden="true" />
        <div className="top-header-profile">
          <span className="top-header-avatar" aria-hidden="true">
            {appShellConfig.profile.initials}
          </span>
          <span className="sr-only">
            {appShellConfig.profile.name}, {appShellConfig.profile.role}
          </span>
          <ChevronDown size={17} aria-hidden="true" />
        </div>
      </div>
    </header>
  );
}
