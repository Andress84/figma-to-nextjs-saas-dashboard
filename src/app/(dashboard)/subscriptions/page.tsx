import type { Metadata } from "next";
import { SubscriptionsOverview } from "@/features/subscriptions/subscriptions-overview";

export const metadata: Metadata = {
  title: "Subscriptions",
};

export default function SubscriptionsPage() {
  return <SubscriptionsOverview />;
}
