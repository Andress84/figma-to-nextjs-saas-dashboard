import { Download, FileJson } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CUSTOMERS } from "@/data/mock/customers";
import {
  buildCustomerCsv,
  CUSTOMER_EXPORT_FILE_NAME,
} from "@/components/dashboard/customers/customer-export";
import { downloadCsv } from "@/lib/csv";
import { SettingsSection } from "./settings-section";
import {
  buildWorkspaceSettingsJson,
  downloadSettingsJson,
  WORKSPACE_SETTINGS_EXPORT_FILE_NAME,
} from "./settings-export";
import { useSettings } from "./settings-context";
import { formatSettingsSyncDate } from "./settings-utils";

export function DataPrivacy() {
  const { announce, draft } = useSettings();

  function exportWorkspaceSettings() {
    downloadSettingsJson(buildWorkspaceSettingsJson(draft), WORKSPACE_SETTINGS_EXPORT_FILE_NAME);
    announce(`Downloaded ${WORKSPACE_SETTINGS_EXPORT_FILE_NAME}.`);
  }

  function exportCustomers() {
    downloadCsv(buildCustomerCsv(CUSTOMERS), CUSTOMER_EXPORT_FILE_NAME);
    announce(
      `Downloaded ${CUSTOMER_EXPORT_FILE_NAME} with ${CUSTOMERS.length} loaded customer records.`,
    );
  }

  return (
    <SettingsSection
      id="data-and-privacy"
      className="settings-data-privacy"
      title="Data and Privacy"
      description="Workspace exports, retention and synchronization status."
    >
      <div className="settings-privacy-actions">
        <Button
          variant="secondary"
          leadingIcon={<FileJson aria-hidden="true" />}
          onClick={exportWorkspaceSettings}
        >
          Export workspace data
        </Button>
        <Button
          variant="secondary"
          leadingIcon={<Download aria-hidden="true" />}
          onClick={exportCustomers}
        >
          Download customer data
        </Button>
      </div>
      <dl className="settings-privacy-meta">
        <div>
          <dt>Data retention</dt>
          <dd>{draft.dataAndPrivacy.dataRetention}</dd>
        </div>
        <div>
          <dt>Last successful data sync</dt>
          <dd>{formatSettingsSyncDate(draft.dataAndPrivacy.lastSuccessfulSync)}</dd>
        </div>
      </dl>
    </SettingsSection>
  );
}
