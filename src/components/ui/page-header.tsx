import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  actions?: ReactNode;
  className?: string;
  description: string;
  eyebrow?: string;
  title: string;
}

export function PageHeader({
  actions,
  className,
  description,
  eyebrow,
  title,
}: Readonly<PageHeaderProps>) {
  if (!actions) {
    return (
      <header className={cn("page-header", className)}>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        <p>{description}</p>
      </header>
    );
  }

  return (
    <header className={cn("page-header page-header--with-actions", className)}>
      <div className="page-header-copy">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="page-header-actions">{actions}</div>
    </header>
  );
}
