import { newRegistry } from "@statewalker/shared-registry";
import type { UrlState, UrlStateView } from "@statewalker/shared-views";

/**
 * Parse a URL hash string into a UrlState.
 * Format: `#/path?key=val&key2=val2`
 */
export function parseHash(hash: string): UrlState {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  const qIndex = raw.indexOf("?");
  const path = qIndex >= 0 ? raw.slice(0, qIndex) : raw;
  const query: Record<string, string> = {};
  if (qIndex >= 0) {
    const params = new URLSearchParams(raw.slice(qIndex + 1));
    for (const [k, v] of params) {
      query[k] = v;
    }
  }
  return { path, query };
}

/**
 * Serialize a UrlState into a hash string.
 * Format: `#/path?key=val&key2=val2`
 */
export function buildHash(state: UrlState): string {
  const params = new URLSearchParams(state.query);
  const qs = params.toString();
  return qs ? `#${state.path}?${qs}` : `#${state.path}`;
}

/**
 * Binds a UrlStateView model to the browser's `location.hash` and
 * `hashchange` events.
 *
 * - When the model triggers sync (via `notify()`), serialized state is
 *   written to `location.hash`.
 * - When the hash changes externally (browser back/forward, manual edit),
 *   the parsed state is fed to `model.applyUrl()`.
 *
 * Returns a cleanup function.
 */
export function bindUrlState(_ctx: Record<string, unknown>, model: UrlStateView): () => void {
  const [register, cleanup] = newRegistry();

  // Model → URL: when model notifies (sync was called), write hash
  register(
    model.onUpdate(() => {
      const state = model.buildState();
      const hash = buildHash(state);
      if (location.hash !== hash) {
        location.hash = hash;
      }
    }),
  );

  // URL → Model: when hash changes externally, apply to model
  function onHashChange(): void {
    const state = parseHash(location.hash);
    model.applyUrl(state);
  }
  window.addEventListener("hashchange", onHashChange);
  register(() => window.removeEventListener("hashchange", onHashChange));

  // Initialize: read current hash into model on bind
  if (location.hash) {
    const state = parseHash(location.hash);
    model.applyUrl(state);
  }

  return cleanup;
}
