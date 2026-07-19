import { PageHeader } from "@/components/ui/page-header";
import { PAGE_COPY } from "@/data/mock/pages";
import { REPORTING_PERIOD } from "@/data/mock/reporting";
import { AnalyticsMetrics } from "./analytics-metrics";
import { AnalyticsReportActions } from "./analytics-report-actions";
import { AnalyticsReportProvider } from "./analytics-report-context";
import { ChurnRetention } from "./churn-retention";
import { PlanPerformanceTable } from "./plan-performance-table";
import { RevenueMrrTrends } from "./revenue-mrr-trends";
import { SubscriptionGrowth } from "./subscription-growth";

export function AnalyticsDashboard() {
  return (
    <AnalyticsReportProvider>
      <div className="page-stack analytics-page">
        <PageHeader
          className="analytics-page-header"
          title={PAGE_COPY.analytics.title}
          description={PAGE_COPY.analytics.description}
          actions={<AnalyticsReportActions reportingPeriod={REPORTING_PERIOD.displayLabel} />}
        />

        <AnalyticsMetrics />

        <div className="analytics-primary-grid">
          <RevenueMrrTrends />
          <SubscriptionGrowth />
        </div>

        <div className="analytics-secondary-grid">
          <ChurnRetention />
          <PlanPerformanceTable />
        </div>
      </div>
    </AnalyticsReportProvider>
  );
}
