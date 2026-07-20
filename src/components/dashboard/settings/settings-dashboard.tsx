"use client";

import { type FormEvent, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { PAGE_COPY } from "@/data/mock/pages";
import type { SettingsData } from "@/types/dashboard";
import { DangerZone } from "./danger-zone";
import { DataPrivacy } from "./data-privacy";
import { NotificationSettings } from "./notification-settings";
import { RegionalPreferences } from "./regional-preferences";
import { ReportingDefaults } from "./reporting-defaults";
import { SettingsProvider, useSettings } from "./settings-context";
import { SettingsTabs } from "./settings-tabs";
import { SETTINGS_TABS } from "./settings-utils";
import { WorkspaceProfile } from "./workspace-profile";

function SettingsDashboardContent() {
  const formRef = useRef<HTMLFormElement>(null);
  const {
    activeTab,
    announcement,
    announcementId,
    discardChanges,
    isDirty,
    saveChanges,
    selectTab,
  } = useSettings();
  const activeTabLabel = SETTINGS_TABS.find((tab) => tab.value === activeTab)?.label ?? "Settings";

  useEffect(() => {
    formRef.current?.setAttribute("data-settings-ready", "true");
  }, []);

  function submitSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveChanges();
  }

  return (
    <form
      ref={formRef}
      className="page-stack settings-page"
      noValidate
      aria-label="Workspace settings"
      onSubmit={submitSettings}
    >
      <PageHeader
        className="settings-page-header"
        title={PAGE_COPY.settings.title}
        description={PAGE_COPY.settings.description}
        actions={
          <div className="settings-page-actions">
            <Button variant="secondary" disabled={!isDirty} onClick={discardChanges}>
              Discard changes
            </Button>
            <Button type="submit" disabled={!isDirty}>
              Save changes
            </Button>
          </div>
        }
      />

      <SettingsTabs />

      {activeTab === "general" ? (
        <div
          className="settings-general-grid"
          id="settings-general-panel"
          role="tabpanel"
          aria-labelledby="settings-general-tab"
          tabIndex={0}
        >
          <div className="settings-column settings-column--left">
            <WorkspaceProfile />
            <RegionalPreferences />
            <DangerZone />
          </div>
          <div className="settings-column settings-column--right">
            <ReportingDefaults />
            <NotificationSettings />
            <DataPrivacy />
          </div>
        </div>
      ) : (
        <Card
          className="settings-unavailable-panel"
          id={`settings-${activeTab}-panel`}
          role="tabpanel"
          aria-labelledby={`settings-${activeTab}-tab`}
          tabIndex={0}
        >
          <h2>{activeTabLabel} settings</h2>
          <p>
            This tab is not configured in the frontend demo. The approved General settings remain
            available without implying billing, integration or backend functionality.
          </p>
          <Button variant="secondary" onClick={() => selectTab("general")}>
            Return to General
          </Button>
        </Card>
      )}

      <span
        key={announcementId}
        className="sr-only settings-announcement"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </span>
    </form>
  );
}

export function SettingsDashboard({ initialData }: Readonly<{ initialData: SettingsData }>) {
  return (
    <SettingsProvider initialData={initialData}>
      <SettingsDashboardContent />
    </SettingsProvider>
  );
}
