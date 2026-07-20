import { Info } from "lucide-react";
import { Select } from "@/components/ui/select";
import { SETTINGS_OPTIONS } from "@/data/mock/settings";
import { SettingsField } from "./settings-field";
import { SettingsSection } from "./settings-section";
import { useSettings } from "./settings-context";

export function RegionalPreferences() {
  const { draft, errors, updateRegionalPreference } = useSettings();
  const preferences = draft.regionalPreferences;

  const fields = [
    {
      error: errors.timeZone,
      id: "time-zone",
      key: "timeZone",
      label: "Time zone",
      options: SETTINGS_OPTIONS.regionalPreferences.timeZones,
      value: preferences.timeZone,
    },
    {
      error: errors.currency,
      id: "currency",
      key: "currency",
      label: "Currency",
      options: SETTINGS_OPTIONS.regionalPreferences.currencies,
      value: preferences.currency,
    },
    {
      error: errors.language,
      id: "language",
      key: "language",
      label: "Language",
      options: SETTINGS_OPTIONS.regionalPreferences.languages,
      value: preferences.language,
    },
    {
      error: errors.dateFormat,
      id: "date-format",
      key: "dateFormat",
      label: "Date format",
      options: SETTINGS_OPTIONS.regionalPreferences.dateFormats,
      value: preferences.dateFormat,
    },
    {
      error: errors.weekStartsOn,
      id: "week-starts-on",
      key: "weekStartsOn",
      label: "Week starts on",
      options: SETTINGS_OPTIONS.regionalPreferences.weekStartsOn,
      value: preferences.weekStartsOn,
    },
  ] as const;

  return (
    <SettingsSection
      id="regional-preferences"
      className="settings-regional-preferences"
      title="Regional Preferences"
      description="Formatting defaults for workspace reports and tables."
    >
      <div className="settings-field-grid settings-regional-grid">
        {fields.map((field) => (
          <SettingsField key={field.id} id={field.id} label={field.label} error={field.error}>
            {({ invalid, ...controlProps }) => (
              <Select
                {...controlProps}
                invalid={invalid}
                required
                value={field.value}
                onChange={(event) => updateRegionalPreference(field.key, event.target.value)}
              >
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            )}
          </SettingsField>
        ))}
      </div>
      <div className="settings-information-message" role="note">
        <Info size={17} strokeWidth={1.8} aria-hidden="true" />
        <span>
          Changing the time zone updates report grouping and display only. Stored transaction
          timestamps remain unchanged.
        </span>
      </div>
    </SettingsSection>
  );
}
