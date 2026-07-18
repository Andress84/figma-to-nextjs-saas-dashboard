"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartNoAxesCombined,
  CreditCard,
  LayoutDashboard,
  Settings,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { appShellConfig } from "@/data/mock/app-shell";
import { cn } from "@/lib/utils";
import type { DashboardNavIconKey } from "@/types/navigation";

const navigationIcons = {
  overview: LayoutDashboard,
  analytics: ChartNoAxesCombined,
  customers: UsersRound,
  subscriptions: CreditCard,
  settings: Settings,
} satisfies Record<DashboardNavIconKey, LucideIcon>;

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
      {appShellConfig.navigation.map((item) => {
        const isCurrent = isCurrentRoute(pathname, item.href);
        const Icon = navigationIcons[item.iconKey];

        return (
          <li key={item.href}>
            <Link
              className="navigation-link"
              href={item.href}
              aria-current={isCurrent ? "page" : undefined}
              onClick={onNavigate}
            >
              <Icon className="navigation-icon" size={19} strokeWidth={1.8} aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
