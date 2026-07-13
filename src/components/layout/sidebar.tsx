import Link from "next/link";
import { DashboardNavigation } from "./dashboard-navigation";

export function Sidebar() {
  return (
    <aside className="sidebar">
      <Link className="brand" href="/" aria-label="SaaS dashboard overview">
        <span className="brand-mark" aria-hidden="true">
          S
        </span>
        <span>
          <strong>SaaS Dashboard</strong>
          <small>Foundation</small>
        </span>
      </Link>
      <nav className="sidebar-nav" aria-label="Primary navigation">
        <DashboardNavigation />
      </nav>
      <div className="sidebar-note">
        <span className="status-dot" aria-hidden="true" />
        <div>
          <strong>Phase 1</strong>
          <span>Technical foundation</span>
        </div>
      </div>
    </aside>
  );
}
