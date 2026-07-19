"use client";

import { useSubscriptions } from "./subscriptions-context";

export function SubscriptionAnnouncement() {
  const { announcement } = useSubscriptions();

  return (
    <span className="sr-only" role="status" aria-live="polite">
      {announcement}
    </span>
  );
}
