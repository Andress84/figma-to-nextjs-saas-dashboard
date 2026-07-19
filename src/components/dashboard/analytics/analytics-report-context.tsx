"use client";

import { createContext, type ReactNode, useContext, useMemo, useState } from "react";
import type { AnalyticsChurnFilter, AnalyticsRevenueView } from "@/data/mock/analytics";
import { PLAN_PERFORMANCE } from "@/data/mock/plans";
import type { PlanId, PlanPerformance } from "@/types/dashboard";

export type AnalyticsPlanFilter = "all" | PlanId;

interface AnalyticsReportContextValue {
  readonly churnFilter: AnalyticsChurnFilter;
  readonly compareToPrevious: boolean;
  readonly planFilter: AnalyticsPlanFilter;
  readonly revenueView: AnalyticsRevenueView;
  readonly setChurnFilter: (value: AnalyticsChurnFilter) => void;
  readonly setCompareToPrevious: (value: boolean) => void;
  readonly setPlanFilter: (value: AnalyticsPlanFilter) => void;
  readonly setRevenueView: (value: AnalyticsRevenueView) => void;
  readonly visiblePlans: readonly PlanPerformance[];
}

const AnalyticsReportContext = createContext<AnalyticsReportContextValue | null>(null);

export function AnalyticsReportProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [compareToPrevious, setCompareToPrevious] = useState(true);
  const [revenueView, setRevenueView] = useState<AnalyticsRevenueView>("revenue");
  const [planFilter, setPlanFilter] = useState<AnalyticsPlanFilter>("all");
  const [churnFilter, setChurnFilter] = useState<AnalyticsChurnFilter>("all");
  const visiblePlans = useMemo(
    () =>
      PLAN_PERFORMANCE.filter(
        (performance) =>
          (planFilter === "all" || performance.plan.id === planFilter) &&
          (churnFilter === "all" ||
            (churnFilter === "low-churn"
              ? performance.churnRate <= 3.5
              : performance.churnRate > 3.5)),
      ),
    [churnFilter, planFilter],
  );
  const value = useMemo<AnalyticsReportContextValue>(
    () => ({
      churnFilter,
      compareToPrevious,
      planFilter,
      revenueView,
      setChurnFilter,
      setCompareToPrevious,
      setPlanFilter,
      setRevenueView,
      visiblePlans,
    }),
    [churnFilter, compareToPrevious, planFilter, revenueView, visiblePlans],
  );

  return (
    <AnalyticsReportContext.Provider value={value}>{children}</AnalyticsReportContext.Provider>
  );
}

export function useAnalyticsReport() {
  const value = useContext(AnalyticsReportContext);

  if (!value) {
    throw new Error("useAnalyticsReport must be used within AnalyticsReportProvider");
  }

  return value;
}
