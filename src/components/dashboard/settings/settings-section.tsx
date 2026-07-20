import type { ReactNode } from "react";
import { Card, type CardVariant } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SettingsSectionProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly description: string;
  readonly id: string;
  readonly title: string;
  readonly variant?: CardVariant;
}

export function SettingsSection({
  children,
  className,
  description,
  id,
  title,
  variant = "default",
}: Readonly<SettingsSectionProps>) {
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  return (
    <Card
      className={cn("settings-section", className)}
      variant={variant}
      role="region"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <div className="settings-section-heading">
        <h2 id={titleId}>{title}</h2>
        <p id={descriptionId}>{description}</p>
      </div>
      {children}
    </Card>
  );
}
