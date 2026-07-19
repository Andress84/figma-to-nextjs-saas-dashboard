import { PageHeader } from "@/components/ui/page-header";
import { PAGE_COPY } from "@/data/mock/pages";
import { REPORTING_PERIOD } from "@/data/mock/reporting";
import { TRANSACTIONS } from "@/data/mock/transactions";
import { CustomerGrowth } from "./customer-growth";
import { OverviewMetrics } from "./overview-metrics";
import { OverviewReportActions } from "./overview-report-actions";
import { OverviewReportProvider } from "./overview-report-context";
import { RecentTransactions } from "./recent-transactions";
import { RevenueOverview } from "./revenue-overview";
import { SubscriptionsByPlan } from "./subscriptions-by-plan";

export function OverviewDashboard() {
  return (
    <OverviewReportProvider transactions={TRANSACTIONS}>
      <div className="page-stack overview-page">
        <PageHeader
          className="overview-page-header"
          title={PAGE_COPY.overview.title}
          description={PAGE_COPY.overview.description}
          actions={<OverviewReportActions reportingPeriod={REPORTING_PERIOD.displayLabel} />}
        />

        <OverviewMetrics />

        <div className="overview-primary-grid">
          <RevenueOverview />
          <CustomerGrowth />
        </div>

        <div className="overview-secondary-grid">
          <SubscriptionsByPlan />
          <RecentTransactions />
        </div>
      </div>
    </OverviewReportProvider>
  );
}
