"use client";

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";
import type { SettingsData } from "@/types/dashboard";
import {
  areSettingsEqual,
  cloneSettingsData,
  type SettingsErrorKey,
  type SettingsErrors,
  type SettingsTabId,
  validateSettings,
} from "./settings-utils";

export interface SettingsLogoSelection {
  readonly fileName: string | null;
  readonly previewUrl: string | null;
}

interface SettingsContextValue {
  readonly activeTab: SettingsTabId;
  readonly announcement: string;
  readonly announcementId: number;
  readonly draft: SettingsData;
  readonly errors: SettingsErrors;
  readonly isDirty: boolean;
  readonly logoSelection: SettingsLogoSelection;
  readonly announce: (message: string) => void;
  readonly discardChanges: () => void;
  readonly saveChanges: () => void;
  readonly selectTab: (tab: SettingsTabId) => void;
  readonly setLogoSelection: (selection: SettingsLogoSelection) => void;
  readonly updateNotification: <Key extends keyof SettingsData["notifications"]>(
    key: Key,
    value: SettingsData["notifications"][Key],
  ) => void;
  readonly updateRegionalPreference: <Key extends keyof SettingsData["regionalPreferences"]>(
    key: Key,
    value: SettingsData["regionalPreferences"][Key],
  ) => void;
  readonly updateReportingDefault: <Key extends keyof SettingsData["reportingDefaults"]>(
    key: Key,
    value: SettingsData["reportingDefaults"][Key],
  ) => void;
  readonly updateWorkspaceProfile: <Key extends keyof SettingsData["workspaceProfile"]>(
    key: Key,
    value: SettingsData["workspaceProfile"][Key],
  ) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);
const EMPTY_LOGO_SELECTION: SettingsLogoSelection = { fileName: null, previewUrl: null };

export function SettingsProvider({
  children,
  initialData,
}: Readonly<{ children: ReactNode; initialData: SettingsData }>) {
  const [activeTab, setActiveTab] = useState<SettingsTabId>("general");
  const [draft, setDraft] = useState(() => cloneSettingsData(initialData));
  const [baseline, setBaseline] = useState(() => cloneSettingsData(initialData));
  const [logoSelection, updateLogoSelection] =
    useState<SettingsLogoSelection>(EMPTY_LOGO_SELECTION);
  const [baselineLogoSelection, setBaselineLogoSelection] =
    useState<SettingsLogoSelection>(EMPTY_LOGO_SELECTION);
  const [errors, setErrors] = useState<SettingsErrors>({});
  const [announcementState, setAnnouncementState] = useState({ id: 0, message: "" });
  const isDirty = useMemo(
    () =>
      !areSettingsEqual(draft, baseline) ||
      logoSelection.fileName !== baselineLogoSelection.fileName ||
      logoSelection.previewUrl !== baselineLogoSelection.previewUrl,
    [baseline, baselineLogoSelection, draft, logoSelection],
  );

  const announce = useCallback((message: string) => {
    setAnnouncementState((current) => ({ id: current.id + 1, message }));
  }, []);

  const clearError = useCallback((key: SettingsErrorKey) => {
    setErrors((current) => {
      if (!(key in current)) {
        return current;
      }

      const next = { ...current };
      delete next[key];
      return next;
    });
  }, []);

  const updateWorkspaceProfile = useCallback(
    <Key extends keyof SettingsData["workspaceProfile"]>(
      key: Key,
      value: SettingsData["workspaceProfile"][Key],
    ) => {
      setDraft((current) => ({
        ...current,
        workspaceProfile: { ...current.workspaceProfile, [key]: value },
      }));

      if (key === "workspaceName" || key === "workspaceSlug" || key === "supportEmail") {
        clearError(key);
      }
    },
    [clearError],
  );

  const updateRegionalPreference = useCallback(
    <Key extends keyof SettingsData["regionalPreferences"]>(
      key: Key,
      value: SettingsData["regionalPreferences"][Key],
    ) => {
      setDraft((current) => ({
        ...current,
        regionalPreferences: { ...current.regionalPreferences, [key]: value },
      }));
      clearError(key);
    },
    [clearError],
  );

  const updateReportingDefault = useCallback(
    <Key extends keyof SettingsData["reportingDefaults"]>(
      key: Key,
      value: SettingsData["reportingDefaults"][Key],
    ) => {
      setDraft((current) => ({
        ...current,
        reportingDefaults: { ...current.reportingDefaults, [key]: value },
      }));

      if (
        key === "defaultReportingPeriod" ||
        key === "defaultRevenueView" ||
        key === "defaultChartGranularity"
      ) {
        clearError(key);
      }
    },
    [clearError],
  );

  const updateNotification = useCallback(
    <Key extends keyof SettingsData["notifications"]>(
      key: Key,
      value: SettingsData["notifications"][Key],
    ) => {
      setDraft((current) => ({
        ...current,
        notifications: { ...current.notifications, [key]: value },
      }));
    },
    [],
  );

  const setLogoSelection = useCallback((selection: SettingsLogoSelection) => {
    updateLogoSelection(selection);
  }, []);

  const saveChanges = useCallback(() => {
    const nextErrors = validateSettings(draft);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      announce("Settings were not saved. Correct the highlighted fields and try again.");
      queueMicrotask(() => {
        document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      });
      return;
    }

    setBaseline(cloneSettingsData(draft));
    setBaselineLogoSelection(logoSelection);
    announce("Settings saved for this in-memory demo session.");
  }, [announce, draft, logoSelection]);

  const discardChanges = useCallback(() => {
    setDraft(cloneSettingsData(baseline));
    updateLogoSelection(baselineLogoSelection);
    setErrors({});
    announce("Unsaved settings changes were discarded.");
  }, [announce, baseline, baselineLogoSelection]);

  const value = useMemo<SettingsContextValue>(
    () => ({
      activeTab,
      announcement: announcementState.message,
      announcementId: announcementState.id,
      draft,
      errors,
      isDirty,
      logoSelection,
      announce,
      discardChanges,
      saveChanges,
      selectTab: setActiveTab,
      setLogoSelection,
      updateNotification,
      updateRegionalPreference,
      updateReportingDefault,
      updateWorkspaceProfile,
    }),
    [
      activeTab,
      announcementState,
      announce,
      discardChanges,
      draft,
      errors,
      isDirty,
      logoSelection,
      saveChanges,
      setLogoSelection,
      updateNotification,
      updateRegionalPreference,
      updateReportingDefault,
      updateWorkspaceProfile,
    ],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const value = useContext(SettingsContext);

  if (!value) {
    throw new Error("useSettings must be used within SettingsProvider");
  }

  return value;
}
