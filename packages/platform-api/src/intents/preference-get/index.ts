import { newIntent } from "@statewalker/shared-intents";

export const PREFERENCE_GET_INTENT_KEY = "platform:preference-get";

export interface PreferenceGetPayload {
  key: string;
}

export interface PreferenceGetResult {
  value: unknown | undefined;
}

export const [runPreferenceGet, handlePreferenceGet] = newIntent<
  PreferenceGetPayload,
  PreferenceGetResult
>(PREFERENCE_GET_INTENT_KEY);
