import { PlaceholderPanel } from "@/components/dashboard/placeholder-panel";
import { PageHeader } from "@/components/ui/page-header";

export function SubscriptionsOverview() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Subscriptions"
        title="Subscriptions"
        description="A dedicated route for future fictional plans, billing intervals, and subscription states."
      />
      <PlaceholderPanel
        label="subscriptions"
        title="Subscription module placeholder"
        body="No billing provider or backend is connected; this portfolio project will use fictional demo records only."
      />
    </div>
  );
}
