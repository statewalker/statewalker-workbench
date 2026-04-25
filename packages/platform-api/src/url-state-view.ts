import { BaseClass } from "@statewalker/shared-baseclass";

/**
 * Serialized URL state — what gets written to / read from the URL hash.
 */
export interface UrlState {
  path: string;
  query: Record<string, string>;
}

/**
 * A reversible mapping between application state and the URL.
 * `serialize` builds an outgoing URL state from the in-memory model;
 * `deserialize` applies an incoming URL state back onto the model.
 */
export interface UrlSerializer {
  serialize(state: UrlState): UrlState;
  deserialize(state: UrlState): void;
}

/**
 * Bidirectional URL ↔ model state synchronisation.
 *
 * Models register `UrlSerializer`s; the browser binding (provided by
 * `@statewalker/platform.browser`) flushes the serialized state to
 * `location.hash` whenever `sync()` notifies, and feeds incoming
 * `hashchange` events back to all deserializers via `applyUrl()`.
 *
 * A directional lock prevents feedback loops: at any moment sync flows
 * in only one direction.
 */
export class UrlStateView extends BaseClass {
  #serializers: Set<UrlSerializer> = new Set();
  #syncing = false;

  register(serializer: UrlSerializer): () => void {
    this.#serializers.add(serializer);
    return () => {
      this.#serializers.delete(serializer);
    };
  }

  /**
   * Run all serializers (model → URL) and notify listeners. The URL
   * binding writes the result to `location.hash`. The syncing flag
   * prevents the resulting `hashchange` event from re-entering.
   */
  sync(): void {
    if (this.#syncing) return;
    this.#syncing = true;
    try {
      this.notify();
    } finally {
      this.#syncing = false;
    }
  }

  buildState(): UrlState {
    let state: UrlState = { path: "", query: {} };
    for (const s of this.#serializers) {
      state = s.serialize(state);
    }
    return state;
  }

  /**
   * Apply an incoming URL state (URL → model) by running all
   * registered deserializers. No-ops if a `sync()` is in progress.
   */
  applyUrl(state: UrlState): void {
    if (this.#syncing) return;
    this.#syncing = true;
    try {
      for (const s of this.#serializers) {
        s.deserialize(state);
      }
    } finally {
      this.#syncing = false;
    }
  }

  /** True when a sync/apply cycle is in progress (for testing). */
  get isSyncing(): boolean {
    return this.#syncing;
  }
}
