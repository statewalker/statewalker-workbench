import { newAdapter } from "@statewalker/shared-adapters";
import { createIntents, type Intents } from "@statewalker/shared-intents";

/**
 * The single `Intents` bus shared by every fragment in a composed app. Declared
 * here (not in `shared-intents`) so every fragment imports it from one place —
 * `@statewalker/platform.api` is the common vocabulary. The factory auto-creates
 * an `Intents` instance on first access, so no explicit bootstrap step is required.
 */
export const [getIntents, setIntents, removeIntents] = newAdapter<Intents>("intents", () =>
  createIntents(),
);
