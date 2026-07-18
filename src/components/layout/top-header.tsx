import { Bell, ChevronDown, CircleHelp } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { IconButton } from "@/components/ui/icon-button";
import { appShellConfig } from "@/data/mock/app-shell";
import { DashboardBreadcrumb } from "./dashboard-breadcrumb";

export function TopHeader() {
  return (
    <header className="top-header">
      <DashboardBreadcrumb />
      <div className="top-header-actions">
        <IconButton className="top-header-icon-button" label="Help" size="mobile">
          <CircleHelp size={19} strokeWidth={1.8} aria-hidden="true" />
        </IconButton>
        <IconButton
          className="top-header-icon-button notification-button"
          label="Notifications"
          size="mobile"
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
    </header>
  );
}
