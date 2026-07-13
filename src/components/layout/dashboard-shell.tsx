import type { ReactNode } from "react";
import { MobileNavigation } from "./mobile-navigation";
import { PageContainer } from "./page-container";
import { Sidebar } from "./sidebar";
import { TopHeader } from "./top-header";

export function DashboardShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="dashboard-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Sidebar />
      <div className="dashboard-column">
        <TopHeader />
        <MobileNavigation />
        <main id="main-content" tabIndex={-1}>
          <PageContainer>{children}</PageContainer>
        </main>
      </div>
    </div>
  );
}
