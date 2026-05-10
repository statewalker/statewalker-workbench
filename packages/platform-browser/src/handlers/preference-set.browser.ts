import { PreferenceSetCommand } from "@statewalker/platform-api";
import type { Commands } from "@statewalker/shared-commands";

const PREFIX = "workbench:";

/**
 * Browser default for `platform:preference-set`. Writes JSON to `localStorage`
 * under the `workbench:` key prefix.
 */
export function registerPreferenceSetBrowser(intents: Commands): () => void {
  return intents.listen(PreferenceSetCommand, (intent) => {
    try {
      localStorage.setItem(PREFIX + intent.payload.key, JSON.stringify(intent.payload.value));
      intent.resolve(undefined);
    } catch (error) {
      intent.reject(error);
    }
    return true;
  });
}
