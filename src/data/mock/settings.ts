import { PRODUCT_IDENTITY } from "@/data/mock/identity";
import type { SettingsData } from "@/types/dashboard";

export const SETTINGS_DATA = {
  workspaceProfile: {
    workspaceLogo: "A",
    workspaceName: PRODUCT_IDENTITY.workspace.name,
    workspaceSlug: "acme-cloud",
    companyName: "Acme Cloud Inc.",
    workspaceOwner: PRODUCT_IDENTITY.profile.name,
    supportEmail: "support@acmecloud.io",
  },
  regionalPreferences: {
    timeZone: "Europe/Berlin",
    currency: "USD – US Dollar",
    language: "English",
    dateFormat: "MM/DD/YYYY",
    weekStartsOn: "Monday",
  },
  reportingDefaults: {
    defaultReportingPeriod: "Last 30 days",
    compareWithPreviousPeriod: true,
    defaultRevenueView: "Gross Revenue",
    defaultChartGranularity: "Weekly",
    includeTrialAccountsInCustomerTotals: true,
  },
  notifications: {
    weeklyPerformanceSummary: true,
    churnAlerts: true,
    failedPaymentAlerts: true,
    trialExpirationReminders: true,
    largeMrrChangeAlerts: false,
  },
  dataAndPrivacy: {
    dataRetention: "24 months",
    lastSuccessfulSync: "2026-07-14T10:42:00Z",
  },
  dangerZone: {
    isVisualOnly: true,
  },
} as const satisfies SettingsData;
