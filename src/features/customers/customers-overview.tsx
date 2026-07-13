import { PlaceholderPanel } from "@/components/dashboard/placeholder-panel";
import { PageHeader } from "@/components/ui/page-header";

export function CustomersOverview() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Customers"
        title="Customers"
        description="A dedicated route for the future customer directory and account health experience."
      />
      <PlaceholderPanel
        label="customers"
        title="Customer data placeholder"
        body="Fictional customer records, filters, and an accessible data table will be implemented in a later phase."
      />
    </div>
  );
}
