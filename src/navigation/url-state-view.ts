import { ViewModel } from "../core/view-model.js";

export interface UrlState {
  path: string;
  query: Record<string, string>;
}

export interface UrlSerializer {
  serialize(state: UrlState): UrlState;
  deserialize(state: UrlState): void;
}

/**
 * Manages bidirectional URL↔model state synchronization.
 *
 * Models register serializers (state→URL) and deserializers (URL→state).
 * A directional lock prevents feedback loops: at any moment sync flows
 * in only one direction.
 */
export class UrlStateView extends ViewModel {
  #serializers: Set<UrlSerializer> = new Set();
  #syncing = false;

  /**
   * Register a serializer/deserializer pair for URL↔state sync.
   * Returns a dispose function that removes it.
   */
  register(serializer: UrlSerializer): () => void {
    this.#serializers.add(serializer);
    return () => {
      this.#serializers.delete(serializer);
    };
  }

  /**
   * Run all serializers to build the current URL state from model state,
   * then notify listeners (the DOM binding writes the result to location.hash).
   * Sets the syncing flag to prevent deserializers from reacting to the
   * resulting hashchange event.
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

  /**
   * Build the serialized URL state by running all registered serializers.
   */
  buildState(): UrlState {
    let state: UrlState = { path: "", query: {} };
    for (const s of this.#serializers) {
      state = s.serialize(state);
    }
    return state;
  }

  /**
   * Apply an incoming URL state (from hashchange/popstate) to model state
   * by running all registered deserializers.
   * No-ops if a sync() is in progress (loop prevention).
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
