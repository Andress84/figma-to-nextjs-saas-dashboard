"use client";

import { usePathname } from "next/navigation";
import { appShellConfig } from "@/data/mock/app-shell";

function getCurrentPageLabel(pathname: string) {
  return (
    appShellConfig.navigation.find((item) =>
      item.href === "/" ? pathname === item.href : pathname.startsWith(item.href),
    )?.label ?? "Overview"
  );
}

export function DashboardBreadcrumb() {
  const pathname = usePathname();
  const currentPage = getCurrentPageLabel(pathname);

  return (
    <nav className="dashboard-breadcrumb" aria-label="Breadcrumb">
      <ol>
        <li>Dashboard</li>
        <li className="breadcrumb-separator" aria-hidden="true">
          /
        </li>
        <li aria-current="page">{currentPage}</li>
      </ol>
    </nav>
  );
}
