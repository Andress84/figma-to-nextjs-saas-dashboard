"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { DashboardNavItem } from "@/types/navigation";

const navigationItems = [
  { href: "/", label: "Overview", shortLabel: "OV" },
  { href: "/analytics", label: "Analytics", shortLabel: "AN" },
  { href: "/customers", label: "Customers", shortLabel: "CU" },
  { href: "/subscriptions", label: "Subscriptions", shortLabel: "SU" },
  { href: "/settings", label: "Settings", shortLabel: "SE" },
] satisfies readonly DashboardNavItem[];

function isCurrentRoute(pathname: string, href: string) {
  return href === "/" ? pathname === href : pathname.startsWith(href);
}

interface DashboardNavigationProps {
  className?: string;
  onNavigate?: () => void;
}

export function DashboardNavigation({ className, onNavigate }: Readonly<DashboardNavigationProps>) {
  const pathname = usePathname();

  return (
    <ul className={cn("navigation-list", className)}>
      {navigationItems.map((item) => {
        const isCurrent = isCurrentRoute(pathname, item.href);

        return (
          <li key={item.href}>
            <Link
              className="navigation-link"
              href={item.href}
              aria-current={isCurrent ? "page" : undefined}
              onClick={onNavigate}
            >
              <span className="navigation-marker" aria-hidden="true">
                {item.shortLabel}
              </span>
              <span>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
