export type IsoDateString = `${number}-${number}-${number}`;
export type IsoDateTimeString = `${string}T${string}Z`;

export type PlanId = "starter" | "growth" | "pro" | "teams";
export type PlanColorKey = "violet" | "lavender" | "blue" | "slate";

export interface PlanDefinition {
  readonly id: PlanId;
  readonly name: string;
  readonly monthlyPrice: number;
  readonly annualPrice: number;
  readonly colorKey: PlanColorKey;
}

export type TrendTone = "positive" | "negative" | "improvement" | "information" | "neutral";

export type TrendDescriptor =
  | {
      readonly format: "percent";
      readonly fractionDigits: number;
      readonly tone: TrendTone;
      readonly value: number;
    }
  | {
      readonly format: "percentage-points";
      readonly tone: TrendTone;
      readonly value: number;
    }
  | {
      readonly format: "text";
      readonly tone: TrendTone;
      readonly value: string;
    };

export interface PlanPerformance {
  readonly activeSubscriptions: number;
  readonly churnRate: number;
  readonly monthlyRecurringRevenue: number;
  readonly plan: PlanDefinition;
  readonly subscriberShare: number;
  readonly trend: TrendDescriptor;
}

export interface ReportingPeriod {
  readonly displayLabel: string;
  readonly endDate: IsoDateString;
  readonly startDate: IsoDateString;
}

export type PrimaryMetricId =
  | "monthly-recurring-revenue"
  | "annual-recurring-revenue"
  | "active-subscriptions"
  | "churn-rate";

export type PrimaryMetricValueFormat = "currency" | "count" | "churn-percent";

export interface MetricSupportingDetail {
  readonly format: "currency" | "count";
  readonly sign: "none" | "positive";
  readonly suffix: string;
  readonly value: number;
}

export interface PrimaryMetric {
  readonly currentValue: number;
  readonly id: PrimaryMetricId;
  readonly label: string;
  readonly previousValue: number;
  readonly supportingDetail: MetricSupportingDetail;
  readonly trend: TrendDescriptor;
  readonly valueFormat: PrimaryMetricValueFormat;
}

export type CustomerStatus = "active" | "trial" | "past-due" | "churned";
export type SubscriptionStatus = "active" | "trialing" | "past-due" | "paused" | "canceled";
export type TransactionStatus = "paid" | "pending" | "refunded" | "failed";
export type DashboardStatus = CustomerStatus | SubscriptionStatus | TransactionStatus;
export type BillingCycle = "monthly" | "annual";

export interface CustomerRecord {
  readonly atRisk: boolean;
  readonly company: string;
  readonly id: string;
  readonly joinedDate: IsoDateString;
  readonly lastActivityLabel: string;
  readonly lastActivityMinutesAgo: number;
  readonly name: string;
  readonly planId: PlanId;
  readonly status: CustomerStatus;
}

export type SubscriptionAmountQualifier = "after trial" | "former monthly";

export interface SubscriptionRecord {
  readonly amountQualifier?: SubscriptionAmountQualifier;
  readonly billingCycle: BillingCycle;
  readonly customerName: string;
  readonly id: string;
  readonly nextBillingDate: IsoDateString | null;
  readonly nextBillingLabel?: "Paused";
  readonly planId: PlanId;
  readonly startedDate: IsoDateString;
  readonly status: SubscriptionStatus;
}

export interface TransactionRecord {
  readonly amount: number;
  readonly customerName: string;
  readonly id: string;
  readonly paymentMethod: string;
  readonly planId: PlanId;
  readonly status: TransactionStatus;
  readonly timestamp: IsoDateTimeString;
}

export interface RevenueDataPoint {
  readonly currentRevenue: number;
  readonly endDate: IsoDateString;
  readonly id: string;
  readonly label: string;
  readonly previousRevenue: number;
  readonly startDate: IsoDateString;
}

export interface CustomerGrowthDataPoint {
  readonly churnedSubscriptions: number;
  readonly endDate: IsoDateString;
  readonly id: string;
  readonly label: string;
  readonly netSubscriptions: number;
  readonly newCustomerAccounts: number;
  readonly newPaidSubscriptions: number;
  readonly startDate: IsoDateString;
}

export interface ChurnTrendDataPoint {
  readonly currentChurnRate: number;
  readonly id: string;
  readonly label: string;
  readonly previousChurnRate: number;
}

export type CurrentSubscriptionStatus = Exclude<SubscriptionStatus, "canceled">;

export interface SubscriptionStatusCount {
  readonly count: number;
  readonly status: CurrentSubscriptionStatus;
}

export interface SubscriptionStatusSummary {
  readonly currentStatuses: readonly SubscriptionStatusCount[];
  readonly currentTotal: number;
  readonly historicalChurned: number;
  readonly historicalChurnRate: number;
}

export interface PageCopy {
  readonly description: string;
  readonly title: string;
}

export interface DashboardMetric {
  readonly label: string;
  readonly note: string;
  readonly value: string;
}

export type DashboardPageId = "overview" | "analytics" | "customers" | "subscriptions" | "settings";

export interface SettingsData {
  readonly dataAndPrivacy: {
    readonly dataRetention: string;
    readonly lastSuccessfulSync: IsoDateTimeString;
  };
  readonly dangerZone: {
    readonly isVisualOnly: true;
  };
  readonly notifications: {
    readonly churnAlerts: boolean;
    readonly failedPaymentAlerts: boolean;
    readonly largeMrrChangeAlerts: boolean;
    readonly trialExpirationReminders: boolean;
    readonly weeklyPerformanceSummary: boolean;
  };
  readonly regionalPreferences: {
    readonly currency: string;
    readonly dateFormat: string;
    readonly language: string;
    readonly timeZone: string;
    readonly weekStartsOn: string;
  };
  readonly reportingDefaults: {
    readonly compareWithPreviousPeriod: boolean;
    readonly defaultChartGranularity: string;
    readonly defaultReportingPeriod: string;
    readonly defaultRevenueView: string;
    readonly includeTrialAccountsInCustomerTotals: boolean;
  };
  readonly workspaceProfile: {
    readonly companyName: string;
    readonly supportEmail: string;
    readonly workspaceLogo: string;
    readonly workspaceName: string;
    readonly workspaceOwner: string;
    readonly workspaceSlug: string;
  };
}
