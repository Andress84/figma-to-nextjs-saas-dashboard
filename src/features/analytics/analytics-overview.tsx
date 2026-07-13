import { PlaceholderPanel } from "@/components/dashboard/placeholder-panel";
import { PageHeader } from "@/components/ui/page-header";

export function AnalyticsOverview() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Analytics"
        title="Analytics"
        description="A dedicated route for future revenue, engagement, retention, and growth reporting."
      />
      <PlaceholderPanel
        label="analytics"
        title="Analytics module placeholder"
        body="The production dashboard will add accessible charts and range controls after the Figma design is approved."
      />
    </div>
  );
}
