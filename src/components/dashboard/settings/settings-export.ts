import { PRODUCT_IDENTITY } from "@/data/mock/identity";
import type { SettingsData } from "@/types/dashboard";

export const WORKSPACE_SETTINGS_EXPORT_FILE_NAME = "subtera-workspace-settings-2026-07-14.json";

export function buildWorkspaceSettingsJson(settings: SettingsData) {
  return JSON.stringify(
    {
      product: PRODUCT_IDENTITY.brand.name,
      workspace: settings.workspaceProfile.workspaceName,
      exportDate: "2026-07-14",
      settings,
    },
    null,
    2,
  );
}

export function downloadSettingsJson(json: string, fileName: string) {
  const blob = new Blob([json], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = fileName;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
