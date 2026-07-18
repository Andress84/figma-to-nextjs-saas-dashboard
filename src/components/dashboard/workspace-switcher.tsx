import { ChevronDown, PanelsTopLeft } from "lucide-react";

interface WorkspaceSwitcherProps {
  name: string;
}

export function WorkspaceSwitcher({ name }: Readonly<WorkspaceSwitcherProps>) {
  return (
    <div className="workspace-switcher">
      <span className="workspace-mark" aria-hidden="true">
        <PanelsTopLeft size={20} strokeWidth={1.8} />
      </span>
      <span className="workspace-copy">
        <span className="workspace-label">Workspace</span>
        <strong>{name}</strong>
      </span>
      <ChevronDown className="workspace-chevron" size={16} aria-hidden="true" />
    </div>
  );
}
