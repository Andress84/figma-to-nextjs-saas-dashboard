import { Toggle } from "@/components/ui/toggle";
import { SettingsControlRow } from "./settings-control-row";
import { SettingsSection } from "./settings-section";
import { useSettings } from "./settings-context";

const NOTIFICATION_ROWS = [
  {
    description: "Recurring revenue and subscriber movement every Monday.",
    id: "weekly-performance-summary",
    key: "weeklyPerformanceSummary",
    label: "Weekly performance summary",
  },
  {
    description: "Notify when cancellation activity exceeds the usual range.",
    id: "churn-alerts",
    key: "churnAlerts",
    label: "Churn alerts",
  },
  {
    description: "Flag subscriptions requiring billing attention.",
    id: "failed-payment-alerts",
    key: "failedPaymentAlerts",
    label: "Failed payment alerts",
  },
  {
    description: "Receive a reminder three days before trial completion.",
    id: "trial-expiration-reminders",
    key: "trialExpirationReminders",
    label: "Trial expiration reminders",
  },
  {
    description: "Notify for individual MRR changes above $1,000.",
    id: "large-mrr-change-alerts",
    key: "largeMrrChangeAlerts",
    label: "Large MRR change alerts",
  },
] as const;

export function NotificationSettings() {
  const { draft, updateNotification } = useSettings();

  return (
    <SettingsSection
      id="notification-settings"
      className="settings-notifications"
      title="Notifications"
      description="Choose which workspace events generate alerts."
    >
      <div className="settings-control-list">
        {NOTIFICATION_ROWS.map((notification) => (
          <SettingsControlRow
            key={notification.id}
            id={notification.id}
            label={notification.label}
            description={notification.description}
          >
            <Toggle
              labelledBy={`${notification.id}-label`}
              checked={draft.notifications[notification.key]}
              onCheckedChange={(checked) => updateNotification(notification.key, checked)}
            />
          </SettingsControlRow>
        ))}
      </div>
    </SettingsSection>
  );
}
