import Image from "next/image";
import { type ChangeEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SettingsField } from "./settings-field";
import { SettingsSection } from "./settings-section";
import { useSettings } from "./settings-context";

const ACCEPTED_LOGO_TYPES = new Set(["image/jpeg", "image/png", "image/svg+xml"]);

export function WorkspaceProfile() {
  const { announce, draft, errors, logoSelection, setLogoSelection, updateWorkspaceProfile } =
    useSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profile = draft.workspaceProfile;

  function selectLogo(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";

    if (!file) {
      return;
    }

    if (!ACCEPTED_LOGO_TYPES.has(file.type)) {
      announce("Choose an SVG, PNG or JPG image for the local logo preview.");
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result !== "string") {
        announce("The selected logo could not be previewed in this demo.");
        return;
      }

      setLogoSelection({ fileName: file.name, previewUrl: reader.result });
      announce(`Selected ${file.name} as a local workspace logo preview. Nothing was uploaded.`);
    });
    reader.addEventListener("error", () => {
      announce("The selected logo could not be previewed in this demo.");
    });
    reader.readAsDataURL(file);
  }

  return (
    <SettingsSection
      id="workspace-profile"
      className="settings-workspace-profile"
      title="Workspace Profile"
      description="Identity and contact information used across Subtera."
    >
      <div className="settings-logo-row">
        <div className="settings-logo-preview">
          {logoSelection.previewUrl ? (
            <Image
              src={logoSelection.previewUrl}
              alt="Workspace logo preview"
              width={56}
              height={56}
              unoptimized
            />
          ) : (
            <span aria-label={`Workspace logo preview, ${profile.workspaceLogo}`}>
              {profile.workspaceLogo}
            </span>
          )}
        </div>
        <div className="settings-logo-copy">
          <strong>Workspace logo</strong>
          <span>SVG, PNG or JPG · Recommended 256 × 256 px</span>
          {logoSelection.fileName ? <span>Local preview: {logoSelection.fileName}</span> : null}
        </div>
        <input
          ref={fileInputRef}
          className="sr-only"
          tabIndex={-1}
          type="file"
          accept="image/svg+xml,image/png,image/jpeg"
          aria-label="Choose workspace logo file"
          onChange={selectLogo}
        />
        <Button size="compact" variant="secondary" onClick={() => fileInputRef.current?.click()}>
          Change logo
        </Button>
      </div>

      <div className="settings-field-grid">
        <SettingsField id="workspace-name" label="Workspace name" error={errors.workspaceName}>
          {({ invalid, ...controlProps }) => (
            <Input
              {...controlProps}
              invalid={invalid}
              name="workspaceName"
              autoComplete="organization"
              value={profile.workspaceName}
              onChange={(event) => updateWorkspaceProfile("workspaceName", event.target.value)}
            />
          )}
        </SettingsField>

        <SettingsField
          id="workspace-slug"
          label="Workspace ID or slug"
          description="Used in workspace links and exports."
          error={errors.workspaceSlug}
        >
          {({ invalid, ...controlProps }) => (
            <Input
              {...controlProps}
              invalid={invalid}
              name="workspaceSlug"
              autoCapitalize="none"
              spellCheck={false}
              value={profile.workspaceSlug}
              onChange={(event) => updateWorkspaceProfile("workspaceSlug", event.target.value)}
            />
          )}
        </SettingsField>

        <SettingsField id="company-name" label="Company name">
          {({ invalid, ...controlProps }) => (
            <Input
              {...controlProps}
              invalid={invalid}
              name="companyName"
              autoComplete="organization"
              value={profile.companyName}
              onChange={(event) => updateWorkspaceProfile("companyName", event.target.value)}
            />
          )}
        </SettingsField>

        <SettingsField
          id="workspace-owner"
          label="Workspace owner"
          description="Owner changes require workspace verification."
        >
          {({ invalid, ...controlProps }) => (
            <Input
              {...controlProps}
              invalid={invalid}
              name="workspaceOwner"
              readOnly
              value={profile.workspaceOwner}
            />
          )}
        </SettingsField>

        <SettingsField
          className="settings-field--wide"
          id="support-email"
          label="Support email"
          error={errors.supportEmail}
        >
          {({ invalid, ...controlProps }) => (
            <Input
              {...controlProps}
              invalid={invalid}
              name="supportEmail"
              type="email"
              autoComplete="email"
              value={profile.supportEmail}
              onChange={(event) => updateWorkspaceProfile("supportEmail", event.target.value)}
            />
          )}
        </SettingsField>
      </div>
    </SettingsSection>
  );
}
