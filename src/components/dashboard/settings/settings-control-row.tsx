import type { ReactNode } from "react";

interface SettingsControlRowProps {
  readonly children: ReactNode;
  readonly controlId?: string;
  readonly description: string;
  readonly error?: string;
  readonly id: string;
  readonly label: string;
}

export function SettingsControlRow({
  children,
  controlId,
  description,
  error,
  id,
  label,
}: Readonly<SettingsControlRowProps>) {
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div
      className={
        controlId ? "settings-control-row settings-control-row--field" : "settings-control-row"
      }
    >
      <div className="settings-control-row-copy">
        {controlId ? (
          <label id={labelId} htmlFor={controlId}>
            {label}
          </label>
        ) : (
          <span id={labelId}>{label}</span>
        )}
        <p id={descriptionId}>{description}</p>
        {error ? (
          <p className="settings-field-error" id={errorId}>
            {error}
          </p>
        ) : null}
      </div>
      <div className="settings-control-row-action">{children}</div>
    </div>
  );
}
