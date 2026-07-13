import type { Metadata } from "next";
import { SettingsOverview } from "@/features/settings/settings-overview";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return <SettingsOverview />;
}
