"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
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
  const [draft, setDraftState] = useState(() => cloneSettingsData(initialData));
  const draftRef = useRef(draft);
  const [baseline, setBaseline] = useState(() => cloneSettingsData(initialData));
  const baselineRef = useRef(baseline);
  const [logoSelection, updateLogoSelection] =
    useState<SettingsLogoSelection>(EMPTY_LOGO_SELECTION);
  const logoSelectionRef = useRef(logoSelection);
  const [baselineLogoSelection, setBaselineLogoSelection] =
    useState<SettingsLogoSelection>(EMPTY_LOGO_SELECTION);
  const baselineLogoSelectionRef = useRef(baselineLogoSelection);
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

  const updateDraft = useCallback((updater: (current: SettingsData) => SettingsData) => {
    const next = updater(draftRef.current);
    draftRef.current = next;
    setDraftState(next);
  }, []);

  const updateWorkspaceProfile = useCallback(
    <Key extends keyof SettingsData["workspaceProfile"]>(
      key: Key,
      value: SettingsData["workspaceProfile"][Key],
    ) => {
      updateDraft((current) => ({
        ...current,
        workspaceProfile: { ...current.workspaceProfile, [key]: value },
      }));

      if (key === "workspaceName" || key === "workspaceSlug" || key === "supportEmail") {
        clearError(key);
      }
    },
    [clearError, updateDraft],
  );

  const updateRegionalPreference = useCallback(
    <Key extends keyof SettingsData["regionalPreferences"]>(
      key: Key,
      value: SettingsData["regionalPreferences"][Key],
    ) => {
      updateDraft((current) => ({
        ...current,
        regionalPreferences: { ...current.regionalPreferences, [key]: value },
      }));
      clearError(key);
    },
    [clearError, updateDraft],
  );

  const updateReportingDefault = useCallback(
    <Key extends keyof SettingsData["reportingDefaults"]>(
      key: Key,
      value: SettingsData["reportingDefaults"][Key],
    ) => {
      updateDraft((current) => ({
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
    [clearError, updateDraft],
  );

  const updateNotification = useCallback(
    <Key extends keyof SettingsData["notifications"]>(
      key: Key,
      value: SettingsData["notifications"][Key],
    ) => {
      updateDraft((current) => ({
        ...current,
        notifications: { ...current.notifications, [key]: value },
      }));
    },
    [updateDraft],
  );

  const setLogoSelection = useCallback((selection: SettingsLogoSelection) => {
    logoSelectionRef.current = selection;
    updateLogoSelection(selection);
  }, []);

  const saveChanges = useCallback(() => {
    const latestDraft = draftRef.current;
    const nextErrors = validateSettings(latestDraft);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      announce("Settings were not saved. Correct the highlighted fields and try again.");
      queueMicrotask(() => {
        document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      });
      return;
    }

    const nextBaseline = cloneSettingsData(latestDraft);
    const nextBaselineLogoSelection = { ...logoSelectionRef.current };
    baselineRef.current = nextBaseline;
    baselineLogoSelectionRef.current = nextBaselineLogoSelection;
    setBaseline(nextBaseline);
    setBaselineLogoSelection(nextBaselineLogoSelection);
    announce("Settings saved for this in-memory demo session.");
  }, [announce]);

  const discardChanges = useCallback(() => {
    const restoredDraft = cloneSettingsData(baselineRef.current);
    const restoredLogoSelection = { ...baselineLogoSelectionRef.current };
    draftRef.current = restoredDraft;
    logoSelectionRef.current = restoredLogoSelection;
    setDraftState(restoredDraft);
    updateLogoSelection(restoredLogoSelection);
    setErrors({});
    announce("Unsaved settings changes were discarded.");
  }, [announce]);

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
