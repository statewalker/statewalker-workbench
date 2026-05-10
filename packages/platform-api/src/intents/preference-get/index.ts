import { defineCommand } from "@statewalker/shared-commands";

export const PREFERENCE_GET_INTENT_KEY = "platform:preference-get";

export interface PreferenceGetPayload {
  key: string;
}

export interface PreferenceGetResult {
  value: unknown | undefined;
}

export const PreferenceGetCommand = defineCommand<PreferenceGetPayload,
  PreferenceGetResult>(PREFERENCE_GET_INTENT_KEY, () => {});
