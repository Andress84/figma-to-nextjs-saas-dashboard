import { SETTINGS_OPTIONS } from "@/data/mock/settings";
import type { SettingsData } from "@/types/dashboard";

export type SettingsTabId = "general" | "reporting" | "notifications" | "billing" | "integrations";

export type SettingsErrorKey =
  | "workspaceName"
  | "workspaceSlug"
  | "supportEmail"
  | "timeZone"
  | "currency"
  | "language"
  | "dateFormat"
  | "weekStartsOn"
  | "defaultReportingPeriod"
  | "defaultRevenueView"
  | "defaultChartGranularity";

export type SettingsErrors = Partial<Record<SettingsErrorKey, string>>;

export const SETTINGS_TABS = [
  { label: "General", value: "general" },
  { label: "Reporting", value: "reporting" },
  { label: "Notifications", value: "notifications" },
  { label: "Billing", value: "billing" },
  { label: "Integrations", value: "integrations" },
] as const satisfies readonly { readonly label: string; readonly value: SettingsTabId }[];

function includesValue(options: readonly string[], value: string) {
  return options.includes(value);
}

export function cloneSettingsData(settings: SettingsData): SettingsData {
  return {
    workspaceProfile: { ...settings.workspaceProfile },
    regionalPreferences: { ...settings.regionalPreferences },
    reportingDefaults: { ...settings.reportingDefaults },
    notifications: { ...settings.notifications },
    dataAndPrivacy: { ...settings.dataAndPrivacy },
    dangerZone: { ...settings.dangerZone },
  };
}

export function areSettingsEqual(left: SettingsData, right: SettingsData) {
  return JSON.stringify(left) === JSON.stringify(right);
}

export function validateSettings(settings: SettingsData): SettingsErrors {
  const errors: SettingsErrors = {};
  const { workspaceProfile, regionalPreferences, reportingDefaults } = settings;

  if (workspaceProfile.workspaceName.trim().length === 0) {
    errors.workspaceName = "Enter a workspace name.";
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(workspaceProfile.workspaceSlug)) {
    errors.workspaceSlug = "Use lowercase letters, numbers and single hyphens, without spaces.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(workspaceProfile.supportEmail)) {
    errors.supportEmail = "Enter a valid support email address.";
  }

  if (
    !includesValue(SETTINGS_OPTIONS.regionalPreferences.timeZones, regionalPreferences.timeZone)
  ) {
    errors.timeZone = "Choose an approved time zone.";
  }

  if (
    !includesValue(SETTINGS_OPTIONS.regionalPreferences.currencies, regionalPreferences.currency)
  ) {
    errors.currency = "Choose an approved currency.";
  }

  if (
    !includesValue(SETTINGS_OPTIONS.regionalPreferences.languages, regionalPreferences.language)
  ) {
    errors.language = "Choose an approved language.";
  }

  if (
    !includesValue(SETTINGS_OPTIONS.regionalPreferences.dateFormats, regionalPreferences.dateFormat)
  ) {
    errors.dateFormat = "Choose an approved date format.";
  }

  if (
    !includesValue(
      SETTINGS_OPTIONS.regionalPreferences.weekStartsOn,
      regionalPreferences.weekStartsOn,
    )
  ) {
    errors.weekStartsOn = "Choose an approved first day of the week.";
  }

  if (
    !includesValue(
      SETTINGS_OPTIONS.reportingDefaults.reportingPeriods,
      reportingDefaults.defaultReportingPeriod,
    )
  ) {
    errors.defaultReportingPeriod = "Choose an approved reporting period.";
  }

  if (
    !includesValue(
      SETTINGS_OPTIONS.reportingDefaults.revenueViews,
      reportingDefaults.defaultRevenueView,
    )
  ) {
    errors.defaultRevenueView = "Choose an approved revenue view.";
  }

  if (
    !includesValue(
      SETTINGS_OPTIONS.reportingDefaults.chartGranularities,
      reportingDefaults.defaultChartGranularity,
    )
  ) {
    errors.defaultChartGranularity = "Choose an approved chart granularity.";
  }

  return errors;
}

export function formatSettingsSyncDate(value: string) {
  const date = new Date(value);
  const dateLabel = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  }).format(date);
  const timeLabel = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    hourCycle: "h23",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(date);

  return `${dateLabel} at ${timeLabel}`;
}
