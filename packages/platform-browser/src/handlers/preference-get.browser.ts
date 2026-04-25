import { handlePreferenceGet } from "@statewalker/platform-api";
import type { Intents } from "@statewalker/shared-intents";

const PREFIX = "workbench:";

/**
 * Browser default for `platform:preference-get`. Reads JSON from `localStorage`
 * under the `workbench:` key prefix. Returns `{ value: undefined }` when the
 * key is absent or parsing fails (the latter is logged but not thrown — the
 * caller gets the "missing value" signal and can re-seed).
 */
export function registerPreferenceGetBrowser(intents: Intents): () => void {
  return handlePreferenceGet(intents, (intent) => {
    try {
      const raw = localStorage.getItem(PREFIX + intent.payload.key);
      if (raw === null) {
        intent.resolve({ value: undefined });
        return true;
      }
      try {
        intent.resolve({ value: JSON.parse(raw) as unknown });
      } catch {
        // Corrupt entry — surface as missing; leave the raw value for manual recovery.
        intent.resolve({ value: undefined });
      }
    } catch (error) {
      intent.reject(error);
    }
    return true;
  });
}
