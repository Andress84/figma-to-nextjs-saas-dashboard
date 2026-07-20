import { SettingsDashboard } from "@/components/dashboard/settings/settings-dashboard";
import { SETTINGS_DATA } from "@/data/mock/settings";

export function SettingsOverview() {
  return <SettingsDashboard initialData={SETTINGS_DATA} />;
}
