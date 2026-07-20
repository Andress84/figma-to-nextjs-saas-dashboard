import type { ReactNode } from "react";

interface SettingsFieldControlProps {
  readonly "aria-describedby"?: string;
  readonly "aria-invalid"?: true;
  readonly id: string;
  readonly invalid: boolean;
}

interface SettingsFieldProps {
  readonly children: (controlProps: SettingsFieldControlProps) => ReactNode;
  readonly className?: string;
  readonly description?: string;
  readonly error?: string;
  readonly id: string;
  readonly label: string;
}

export function SettingsField({
  children,
  className,
  description,
  error,
  id,
  label,
}: Readonly<SettingsFieldProps>) {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={className ? `settings-field ${className}` : "settings-field"}>
      <label className="settings-field-label" htmlFor={id}>
        {label}
      </label>
      {children({
        id,
        invalid: Boolean(error),
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
      })}
      {description ? (
        <p className="settings-field-description" id={descriptionId}>
          {description}
        </p>
      ) : null}
      {error ? (
        <p className="settings-field-error" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
