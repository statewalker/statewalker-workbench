import { defineCommand } from "@statewalker/shared-commands";

export interface OpenSettingsPayload {
  /** Optional initial tab id. When omitted, the dialog opens to
   * the previously-active tab (or the first tab if none). */
  tabId?: string;
}

/**
 * Open the settings dialog. Default handler lives in
 * `SettingsManager`; consumers fire the intent without importing
 * the adapter directly.
 */
export const OpenSettingsCommand = defineCommand<OpenSettingsPayload, void>("settings:open", () => {});

/** Close the settings dialog. */
export const CloseSettingsCommand = defineCommand<void, void>("settings:close", () => {});
