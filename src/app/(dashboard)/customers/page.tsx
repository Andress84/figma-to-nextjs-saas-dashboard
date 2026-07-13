import type { Metadata } from "next";
import { CustomersOverview } from "@/features/customers/customers-overview";

export const metadata: Metadata = {
  title: "Customers",
};

export default function CustomersPage() {
  return <CustomersOverview />;
}
