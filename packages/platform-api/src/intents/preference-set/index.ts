import { newIntent } from "@statewalker/shared-intents";

export const PREFERENCE_SET_INTENT_KEY = "platform:preference-set";

export interface PreferenceSetPayload {
  key: string;
  value: unknown;
}

export const [runPreferenceSet, handlePreferenceSet] = newIntent<PreferenceSetPayload, void>(
  PREFERENCE_SET_INTENT_KEY,
);
