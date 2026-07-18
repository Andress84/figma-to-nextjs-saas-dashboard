import { Search } from "lucide-react";
import { ProfileRow } from "@/components/dashboard/profile-row";
import { WorkspaceSwitcher } from "@/components/dashboard/workspace-switcher";
import { Input } from "@/components/ui/input";
import { appShellConfig } from "@/data/mock/app-shell";
import { DashboardNavigation } from "./dashboard-navigation";
import { SubteraBrand } from "./subtera-brand";

export function Sidebar() {
  return (
    <aside className="sidebar">
      <SubteraBrand />
      <WorkspaceSwitcher name={appShellConfig.workspace.name} />
      <div role="search">
        <label className="sr-only" htmlFor="workspace-search">
          Search workspace
        </label>
        <Input
          className="workspace-search"
          id="workspace-search"
          name="workspace-search"
          type="search"
          placeholder="Search"
          leadingIcon={<Search size={17} strokeWidth={1.8} />}
          trailingContent={<kbd aria-hidden="true">⌘K</kbd>}
        />
      </div>
      <nav className="sidebar-nav" aria-label="Primary navigation">
        <p className="sidebar-nav-label">Workspace</p>
        <DashboardNavigation />
      </nav>
      <ProfileRow {...appShellConfig.profile} />
    </aside>
  );
}
