import { Card } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { useSettings } from "./settings-context";
import { SETTINGS_TABS, type SettingsTabId } from "./settings-utils";

const tabItems = SETTINGS_TABS.map((tab) => ({
  ...tab,
  controlsId: `settings-${tab.value}-panel`,
  id: `settings-${tab.value}-tab`,
}));

export function SettingsTabs() {
  const { activeTab, selectTab } = useSettings();

  return (
    <Card className="settings-tabs-card" padding="none">
      <div
        className="settings-tabs-viewport"
        role="region"
        aria-label="Scrollable settings navigation"
        tabIndex={0}
      >
        <Tabs
          items={tabItems}
          label="Settings sections"
          value={activeTab}
          onValueChange={(value) => selectTab(value as SettingsTabId)}
        />
      </div>
    </Card>
  );
}
