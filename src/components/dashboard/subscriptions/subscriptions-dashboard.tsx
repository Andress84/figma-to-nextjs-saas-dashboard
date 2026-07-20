import { PageHeader } from "@/components/ui/page-header";
import { PAGE_COPY } from "@/data/mock/pages";
import { SubscriptionAnnouncement } from "./subscription-announcement";
import { SubscriptionDirectory } from "./subscription-directory";
import { SubscriptionMetrics } from "./subscription-metrics";
import { SubscriptionPageActions } from "./subscription-page-actions";
import { SubscriptionPlanPerformance } from "./subscription-plan-performance";
import { SubscriptionStatus } from "./subscription-status";
import { SubscriptionsProvider } from "./subscriptions-context";

export function SubscriptionsDashboard() {
  return (
    <SubscriptionsProvider>
      <div className="page-stack subscriptions-page">
        <PageHeader
          className="subscriptions-page-header"
          title={PAGE_COPY.subscriptions.title}
          description={PAGE_COPY.subscriptions.description}
          actions={<SubscriptionPageActions />}
        />

        <SubscriptionMetrics />

        <div className="subscription-primary-grid">
          <SubscriptionPlanPerformance />
          <SubscriptionStatus />
        </div>

        <SubscriptionDirectory />
        <SubscriptionAnnouncement />
      </div>
    </SubscriptionsProvider>
  );
}
