"use client";

import Link from "next/link";
import { useRef } from "react";
import { DashboardNavigation } from "./dashboard-navigation";

export function MobileNavigation() {
  const menuRef = useRef<HTMLDetailsElement>(null);

  function closeMenu() {
    if (menuRef.current) {
      menuRef.current.open = false;
    }
  }

  return (
    <div className="mobile-navigation">
      <Link className="brand brand-mobile" href="/" aria-label="SaaS dashboard overview">
        <span className="brand-mark" aria-hidden="true">
          S
        </span>
        <strong>SaaS Dashboard</strong>
      </Link>
      <details className="mobile-menu" ref={menuRef}>
        <summary>Menu</summary>
        <nav aria-label="Mobile primary navigation">
          <DashboardNavigation onNavigate={closeMenu} />
        </nav>
      </details>
    </div>
  );
}
