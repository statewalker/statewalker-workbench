import { Intents } from "@statewalker/shared-intents";
import { getWorkspace } from "@statewalker/workspace-api";

/**
 * Resolve the workspace-scoped `Intents` bus for the given context bag.
 * Delegates to `workspace.requireAdapter(Intents)`, which auto-instantiates
 * a single shared bus on first lookup so every fragment composed under the
 * same workspace dispatches through the same instance.
 */
export function getIntents(ctx: Record<string, unknown>): Intents {
  return getWorkspace(ctx).requireAdapter(Intents);
}

/**
 * @deprecated The intents bus is now workspace-scoped and auto-instantiated;
 * explicit registration is a no-op. Kept for one release so legacy bootstrap
 * code keeps compiling. Will be removed in a follow-up phase.
 */
export function setIntents(_ctx: Record<string, unknown>, _intents: Intents): void {
  console.warn(
    "[platform-api] setIntents is deprecated and a no-op: the Intents bus is now workspace-bound and auto-instantiated via workspace.requireAdapter(Intents).",
  );
}

/**
 * @deprecated The intents bus is now workspace-scoped and lifecycle-managed by
 * the workspace; explicit removal is a no-op. Kept for one release so legacy
 * teardown code keeps compiling. Will be removed in a follow-up phase.
 */
export function removeIntents(_ctx: Record<string, unknown>): void {
  console.warn(
    "[platform-api] removeIntents is deprecated and a no-op: the Intents bus lifecycle is owned by workspace.close().",
  );
}
