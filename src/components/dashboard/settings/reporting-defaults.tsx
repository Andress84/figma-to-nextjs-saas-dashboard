import { Select } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { SETTINGS_OPTIONS } from "@/data/mock/settings";
import { SettingsControlRow } from "./settings-control-row";
import { SettingsSection } from "./settings-section";
import { useSettings } from "./settings-context";

export function ReportingDefaults() {
  const { draft, errors, updateReportingDefault } = useSettings();
  const defaults = draft.reportingDefaults;

  return (
    <SettingsSection
      id="reporting-defaults"
      className="settings-reporting-defaults"
      title="Reporting Defaults"
      description="Starting state for analytics and exported reports."
    >
      <div className="settings-control-list">
        <SettingsControlRow
          id="default-reporting-period-row"
          controlId="default-reporting-period"
          label="Default reporting period"
          description="Initial date range used across dashboards."
          error={errors.defaultReportingPeriod}
        >
          <Select
            className="settings-inline-select"
            id="default-reporting-period"
            required
            value={defaults.defaultReportingPeriod}
            aria-describedby={
              errors.defaultReportingPeriod
                ? "default-reporting-period-row-description default-reporting-period-row-error"
                : "default-reporting-period-row-description"
            }
            aria-invalid={Boolean(errors.defaultReportingPeriod) || undefined}
            invalid={Boolean(errors.defaultReportingPeriod)}
            onChange={(event) =>
              updateReportingDefault("defaultReportingPeriod", event.target.value)
            }
          >
            {SETTINGS_OPTIONS.reportingDefaults.reportingPeriods.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </SettingsControlRow>

        <SettingsControlRow
          id="compare-previous-period"
          label="Compare with previous period"
          description="Show comparison data by default."
        >
          <Toggle
            labelledBy="compare-previous-period-label"
            checked={defaults.compareWithPreviousPeriod}
            onCheckedChange={(checked) =>
              updateReportingDefault("compareWithPreviousPeriod", checked)
            }
          />
        </SettingsControlRow>

        <SettingsControlRow
          id="default-revenue-view-row"
          controlId="default-revenue-view"
          label="Default revenue view"
          description="Primary value used in revenue charts."
          error={errors.defaultRevenueView}
        >
          <Select
            className="settings-inline-select"
            id="default-revenue-view"
            required
            value={defaults.defaultRevenueView}
            aria-describedby={
              errors.defaultRevenueView
                ? "default-revenue-view-row-description default-revenue-view-row-error"
                : "default-revenue-view-row-description"
            }
            aria-invalid={Boolean(errors.defaultRevenueView) || undefined}
            invalid={Boolean(errors.defaultRevenueView)}
            onChange={(event) => updateReportingDefault("defaultRevenueView", event.target.value)}
          >
            {SETTINGS_OPTIONS.reportingDefaults.revenueViews.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </SettingsControlRow>

        <SettingsControlRow
          id="default-chart-granularity-row"
          controlId="default-chart-granularity"
          label="Default chart granularity"
          description="Grouping used for trend visualizations."
          error={errors.defaultChartGranularity}
        >
          <Select
            className="settings-inline-select"
            id="default-chart-granularity"
            required
            value={defaults.defaultChartGranularity}
            aria-describedby={
              errors.defaultChartGranularity
                ? "default-chart-granularity-row-description default-chart-granularity-row-error"
                : "default-chart-granularity-row-description"
            }
            aria-invalid={Boolean(errors.defaultChartGranularity) || undefined}
            invalid={Boolean(errors.defaultChartGranularity)}
            onChange={(event) =>
              updateReportingDefault("defaultChartGranularity", event.target.value)
            }
          >
            {SETTINGS_OPTIONS.reportingDefaults.chartGranularities.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </SettingsControlRow>

        <SettingsControlRow
          id="include-trial-accounts"
          label="Include trial accounts in customer totals"
          description="Trials appear in customer-account counts."
        >
          <Toggle
            labelledBy="include-trial-accounts-label"
            checked={defaults.includeTrialAccountsInCustomerTotals}
            onCheckedChange={(checked) =>
              updateReportingDefault("includeTrialAccountsInCustomerTotals", checked)
            }
          />
        </SettingsControlRow>
      </div>
    </SettingsSection>
  );
}
