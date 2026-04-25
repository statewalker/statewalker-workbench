import { handlePreferenceSet } from "@statewalker/platform-api";
import type { Intents } from "@statewalker/shared-intents";

const PREFIX = "workbench:";

/**
 * Browser default for `platform:preference-set`. Writes JSON to `localStorage`
 * under the `workbench:` key prefix.
 */
export function registerPreferenceSetBrowser(intents: Intents): () => void {
  return handlePreferenceSet(intents, (intent) => {
    try {
      localStorage.setItem(PREFIX + intent.payload.key, JSON.stringify(intent.payload.value));
      intent.resolve(undefined);
    } catch (error) {
      intent.reject(error);
    }
    return true;
  });
}
