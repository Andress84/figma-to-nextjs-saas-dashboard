import { PageHeader } from "@/components/ui/page-header";
import { PAGE_COPY } from "@/data/mock/pages";
import { CustomerDirectory } from "./customer-directory";
import { CustomerMetrics } from "./customer-metrics";
import { CustomerPageActions } from "./customer-page-actions";
import { CustomersProvider } from "./customers-context";

export function CustomersDashboard() {
  return (
    <CustomersProvider>
      <div className="page-stack customers-page">
        <PageHeader
          className="customers-page-header"
          title={PAGE_COPY.customers.title}
          description={PAGE_COPY.customers.description}
          actions={<CustomerPageActions />}
        />
        <CustomerMetrics />
        <CustomerDirectory />
      </div>
    </CustomersProvider>
  );
}
