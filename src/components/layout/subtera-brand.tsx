import type { MouseEventHandler } from "react";
import Link from "next/link";
import { appShellConfig } from "@/data/mock/app-shell";
import { cn } from "@/lib/utils";

interface SubteraBrandProps {
  className?: string;
  onNavigate?: MouseEventHandler<HTMLAnchorElement>;
}

export function SubteraBrand({ className, onNavigate }: Readonly<SubteraBrandProps>) {
  return (
    <Link
      className={cn("subtera-brand", className)}
      href="/"
      aria-label={`${appShellConfig.brand.name} overview`}
      onClick={onNavigate}
    >
      <span className="subtera-brand-mark" aria-hidden="true">
        S
      </span>
      <span>{appShellConfig.brand.name}</span>
    </Link>
  );
}
