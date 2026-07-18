import { Search } from "lucide-react";
import { ProfileRow } from "@/components/dashboard/profile-row";
import { WorkspaceSwitcher } from "@/components/dashboard/workspace-switcher";
import { appShellConfig } from "@/data/mock/app-shell";
import { DashboardNavigation } from "./dashboard-navigation";
import { SubteraBrand } from "./subtera-brand";

export function Sidebar() {
  return (
    <aside className="sidebar">
      <SubteraBrand />
      <WorkspaceSwitcher name={appShellConfig.workspace.name} />
      <div className="workspace-search" role="search">
        <label className="sr-only" htmlFor="workspace-search">
          Search workspace
        </label>
        <Search size={17} strokeWidth={1.8} aria-hidden="true" />
        <input id="workspace-search" name="workspace-search" type="search" placeholder="Search" />
        <kbd aria-hidden="true">⌘K</kbd>
      </div>
      <nav className="sidebar-nav" aria-label="Primary navigation">
        <p className="sidebar-nav-label">Workspace</p>
        <DashboardNavigation />
      </nav>
      <ProfileRow {...appShellConfig.profile} />
    </aside>
  );
}
