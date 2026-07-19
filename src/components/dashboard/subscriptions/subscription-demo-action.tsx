"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useSubscriptions } from "./subscriptions-context";

interface SubscriptionDemoActionProps {
  readonly children: ReactNode;
  readonly message: string;
}

export function SubscriptionDemoAction({
  children,
  message,
}: Readonly<SubscriptionDemoActionProps>) {
  const { setAnnouncement } = useSubscriptions();

  return (
    <Button size="compact" variant="ghost" onClick={() => setAnnouncement(message)}>
      {children}
    </Button>
  );
}
