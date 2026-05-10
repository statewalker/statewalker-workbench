import { defineCommand } from "@statewalker/shared-commands";

export const PREFERENCE_SET_INTENT_KEY = "platform:preference-set";

export interface PreferenceSetPayload {
  key: string;
  value: unknown;
}

export const PreferenceSetCommand = defineCommand<PreferenceSetPayload, void>(PREFERENCE_SET_INTENT_KEY, () => {});
