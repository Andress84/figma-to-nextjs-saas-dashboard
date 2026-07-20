import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SETTINGS_DATA } from "@/data/mock/settings";
import { SettingsDashboard } from "./settings-dashboard";
import { buildWorkspaceSettingsJson, WORKSPACE_SETTINGS_EXPORT_FILE_NAME } from "./settings-export";
import { cloneSettingsData, validateSettings } from "./settings-utils";

function renderSettings() {
  return render(<SettingsDashboard initialData={SETTINGS_DATA} />);
}

function prepareDownloads() {
  const downloads: string[] = [];
  Object.defineProperty(URL, "createObjectURL", {
    configurable: true,
    value: vi.fn(() => "blob:subtera-settings"),
  });
  Object.defineProperty(URL, "revokeObjectURL", {
    configurable: true,
    value: vi.fn(),
  });
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
    this: HTMLAnchorElement,
  ) {
    downloads.push(this.download);
  });
  return downloads;
}

describe("SettingsDashboard", () => {
  it("renders every approved General value and notification state", () => {
    renderSettings();

    expect(screen.getByRole("heading", { level: 1, name: "Settings" })).toBeVisible();
    expect(
      screen.getByText("Manage workspace preferences, reporting defaults and notifications."),
    ).toBeVisible();
    expect(screen.getByLabelText("Workspace name")).toHaveValue("Acme Cloud");
    expect(screen.getByLabelText("Workspace ID or slug")).toHaveValue("acme-cloud");
    expect(screen.getByLabelText("Company name")).toHaveValue("Acme Cloud Inc.");
    expect(screen.getByLabelText("Workspace owner")).toHaveValue("Maya Chen");
    expect(screen.getByLabelText("Workspace owner")).toHaveAttribute("readonly");
    expect(screen.getByLabelText("Support email")).toHaveValue("support@acmecloud.io");
    expect(screen.getByLabelText("Time zone")).toHaveValue("Europe/Berlin");
    expect(screen.getByLabelText("Currency")).toHaveValue("USD — US Dollar");
    expect(screen.getByLabelText("Language")).toHaveValue("English");
    expect(screen.getByLabelText("Date format")).toHaveValue("MM/DD/YYYY");
    expect(screen.getByLabelText("Week starts on")).toHaveValue("Monday");
    expect(screen.getByLabelText("Default reporting period")).toHaveValue("Last 30 days");
    expect(screen.getByLabelText("Default revenue view")).toHaveValue("Gross Revenue");
    expect(screen.getByLabelText("Default chart granularity")).toHaveValue("Weekly");
    expect(screen.getByText("24 months")).toBeVisible();
    expect(screen.getByText("Jul 14, 2026 at 10:42")).toBeVisible();

    expect(screen.getByRole("switch", { name: "Compare with previous period" })).toBeChecked();
    expect(
      screen.getByRole("switch", { name: "Include trial accounts in customer totals" }),
    ).toBeChecked();
    expect(screen.getByRole("switch", { name: "Weekly performance summary" })).toBeChecked();
    expect(screen.getByRole("switch", { name: "Churn alerts" })).toBeChecked();
    expect(screen.getByRole("switch", { name: "Failed payment alerts" })).toBeChecked();
    expect(screen.getByRole("switch", { name: "Trial expiration reminders" })).toBeChecked();
    expect(screen.getByRole("switch", { name: "Large MRR change alerts" })).not.toBeChecked();
    expect(screen.getByRole("button", { name: "Save changes" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Discard changes" })).toBeDisabled();
  });

  it("tracks text, select and toggle changes and discards them consistently", async () => {
    const user = userEvent.setup();
    renderSettings();

    await user.clear(screen.getByLabelText("Workspace name"));
    await user.type(screen.getByLabelText("Workspace name"), "Acme Studio");
    await user.selectOptions(screen.getByLabelText("Time zone"), "UTC");
    await user.click(screen.getByRole("switch", { name: "Compare with previous period" }));

    expect(screen.getByRole("button", { name: "Save changes" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Discard changes" })).toBeEnabled();
    expect(screen.getByLabelText("Workspace name")).toHaveValue("Acme Studio");
    expect(screen.getByLabelText("Time zone")).toHaveValue("UTC");
    expect(screen.getByRole("switch", { name: "Compare with previous period" })).not.toBeChecked();

    await user.click(screen.getByRole("button", { name: "Discard changes" }));
    expect(screen.getByLabelText("Workspace name")).toHaveValue("Acme Cloud");
    expect(screen.getByLabelText("Time zone")).toHaveValue("Europe/Berlin");
    expect(screen.getByRole("switch", { name: "Compare with previous period" })).toBeChecked();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Unsaved settings changes were discarded.",
    );
    expect(screen.getByRole("button", { name: "Save changes" })).toBeDisabled();
  });

  it("saves only to the current baseline and discards back to the last demo save", async () => {
    const user = userEvent.setup();
    renderSettings();
    const companyName = screen.getByLabelText("Company name");

    await user.clear(companyName);
    await user.type(companyName, "Acme Cloud Labs");
    await user.click(screen.getByRole("button", { name: "Save changes" }));
    expect(screen.getByRole("status")).toHaveTextContent(
      "Settings saved for this in-memory demo session.",
    );
    expect(screen.getByRole("button", { name: "Save changes" })).toBeDisabled();

    await user.clear(companyName);
    await user.type(companyName, "Temporary Company");
    await user.click(screen.getByRole("button", { name: "Discard changes" }));
    expect(companyName).toHaveValue("Acme Cloud Labs");
  });

  it("validates required identity fields accessibly before saving", async () => {
    const user = userEvent.setup();
    renderSettings();
    const workspaceName = screen.getByLabelText("Workspace name");

    await user.clear(workspaceName);
    await user.clear(screen.getByLabelText("Workspace ID or slug"));
    await user.type(screen.getByLabelText("Workspace ID or slug"), "Not URL Safe");
    await user.clear(screen.getByLabelText("Support email"));
    await user.type(screen.getByLabelText("Support email"), "not-an-email");
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(screen.getByText("Enter a workspace name.")).toBeVisible();
    expect(screen.getByText(/Use lowercase letters, numbers and single hyphens/)).toBeVisible();
    expect(screen.getByText("Enter a valid support email address.")).toBeVisible();
    expect(workspaceName).toHaveAttribute("aria-invalid", "true");
    expect(workspaceName).toHaveFocus();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Settings were not saved. Correct the highlighted fields and try again.",
    );
  });

  it("validates every required select against the approved option sets", () => {
    const invalidSettings = cloneSettingsData(SETTINGS_DATA);
    const errors = validateSettings({
      ...invalidSettings,
      regionalPreferences: {
        currency: "Unsupported currency",
        dateFormat: "Unsupported date format",
        language: "Unsupported language",
        timeZone: "Unsupported time zone",
        weekStartsOn: "Unsupported day",
      },
      reportingDefaults: {
        ...invalidSettings.reportingDefaults,
        defaultChartGranularity: "Unsupported granularity",
        defaultReportingPeriod: "Unsupported period",
        defaultRevenueView: "Unsupported view",
      },
    });

    expect(errors).toMatchObject({
      currency: expect.any(String),
      dateFormat: expect.any(String),
      defaultChartGranularity: expect.any(String),
      defaultReportingPeriod: expect.any(String),
      defaultRevenueView: expect.any(String),
      language: expect.any(String),
      timeZone: expect.any(String),
      weekStartsOn: expect.any(String),
    });
  });

  it("supports automatic keyboard tab activation without fabricating unseen settings", async () => {
    const user = userEvent.setup();
    renderSettings();
    const generalTab = screen.getByRole("tab", { name: "General" });

    generalTab.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Reporting" })).toHaveFocus();
    expect(screen.getByRole("tab", { name: "Reporting" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel", { name: "Reporting" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Reporting settings" })).toBeVisible();
    expect(screen.getByText(/not configured in the frontend demo/)).toBeVisible();

    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "Integrations" })).toHaveFocus();
    expect(screen.getByRole("tabpanel", { name: "Integrations" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Return to General" }));
    expect(screen.getByRole("tabpanel", { name: "General" })).toBeVisible();
  });

  it("builds deterministic workspace JSON and downloads both approved exports", async () => {
    const firstJson = buildWorkspaceSettingsJson(SETTINGS_DATA);
    const secondJson = buildWorkspaceSettingsJson(SETTINGS_DATA);
    expect(firstJson).toBe(secondJson);
    expect(JSON.parse(firstJson)).toMatchObject({
      exportDate: "2026-07-14",
      product: "Subtera",
      workspace: "Acme Cloud",
    });

    const downloads = prepareDownloads();
    const user = userEvent.setup();
    renderSettings();

    await user.click(screen.getByRole("button", { name: "Export workspace data" }));
    expect(downloads).toContain(WORKSPACE_SETTINGS_EXPORT_FILE_NAME);
    expect(screen.getByRole("status")).toHaveTextContent(
      `Downloaded ${WORKSPACE_SETTINGS_EXPORT_FILE_NAME}.`,
    );

    await user.click(screen.getByRole("button", { name: "Download customer data" }));
    expect(downloads).toContain("subtera-customers-2026-07-14.csv");
    expect(screen.getByRole("status")).toHaveTextContent(
      "Downloaded subtera-customers-2026-07-14.csv with 8 loaded customer records.",
    );
  });

  it("previews a selected logo locally and restores it on discard", async () => {
    const user = userEvent.setup();
    renderSettings();
    const logoFile = new File(["local-logo"], "acme-logo.png", { type: "image/png" });

    await user.upload(screen.getByLabelText("Choose workspace logo file"), logoFile);
    expect(await screen.findByRole("img", { name: "Workspace logo preview" })).toBeVisible();
    expect(screen.getByText("Local preview: acme-logo.png")).toBeVisible();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Selected acme-logo.png as a local workspace logo preview. Nothing was uploaded.",
    );
    expect(screen.getByRole("button", { name: "Save changes" })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: "Discard changes" }));
    expect(screen.queryByRole("img", { name: "Workspace logo preview" })).toBeNull();
    expect(screen.getByText("A")).toBeVisible();
  });

  it("cancels and confirms the non-destructive delete flow with focus restoration", async () => {
    const user = userEvent.setup();
    renderSettings();
    const trigger = screen.getByRole("button", { name: "Delete workspace" });

    await user.click(trigger);
    let dialog = screen.getByRole("alertdialog", { name: "Delete Acme Cloud?" });
    const cancel = within(dialog).getByRole("button", { name: "Cancel" });
    await waitFor(() => expect(cancel).toHaveFocus());
    await user.keyboard("{Tab}");
    expect(within(dialog).getByRole("button", { name: "Confirm demo deletion" })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(dialog).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();

    await user.click(trigger);
    dialog = screen.getByRole("alertdialog", { name: "Delete Acme Cloud?" });
    await user.click(within(dialog).getByRole("button", { name: "Cancel" }));
    expect(dialog).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();

    await user.click(trigger);
    dialog = screen.getByRole("alertdialog", { name: "Delete Acme Cloud?" });
    await user.click(within(dialog).getByRole("button", { name: "Confirm demo deletion" }));
    expect(dialog).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Delete workspace was confirmed as a demo action. No workspace data was deleted.",
    );
    expect(screen.getByLabelText("Workspace name")).toHaveValue("Acme Cloud");
  });
});
