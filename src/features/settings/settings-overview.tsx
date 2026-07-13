import { PlaceholderPanel } from "@/components/dashboard/placeholder-panel";
import { PageHeader } from "@/components/ui/page-header";

export function SettingsOverview() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Settings"
        title="Settings"
        description="A dedicated route for future workspace preferences and presentation settings."
      />
      <PlaceholderPanel
        label="settings"
        title="Settings module placeholder"
        body="Forms and validation will be added only when the final Figma flow defines the required interactions."
      />
    </div>
  );
}
