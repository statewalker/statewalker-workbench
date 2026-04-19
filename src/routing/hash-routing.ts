import { newRegistry } from "@repo/shared-registry";
import type { NavigationView } from "@repo/shared-views";

/**
 * Binds a NavigationView to the browser URL hash fragment.
 *
 * - On init: reads the hash and sets it as the route ID.
 * - On model changes: updates the URL hash (replaceState, no navigation).
 * - On hashchange: updates the model from the new URL hash.
 *
 * Returns a cleanup function.
 */
export function bindHashRouting(navigation: NavigationView): () => void {
  const [register, cleanup] = newRegistry();

  // Read initial route from URL hash
  const initial = readHash();
  if (initial) {
    navigation.setRouteId(initial);
  }

  // Model → URL hash
  register(
    navigation.onRouteIdChanged(() => {
      writeHash(navigation.routeId);
    }),
  );

  // URL hash → Model (browser back/forward, manual URL edit)
  const onHashChange = () => {
    navigation.setRouteId(readHash());
  };
  window.addEventListener("hashchange", onHashChange);
  register(() => window.removeEventListener("hashchange", onHashChange));

  return cleanup;
}

function readHash(): string {
  const hash = window.location.hash;
  return hash.startsWith("#") ? decodeURIComponent(hash.slice(1)) : "";
}

function writeHash(value: string): void {
  if (readHash() === value) return;
  if (value) {
    window.history.replaceState(null, "", `#${encodeURIComponent(value)}`);
  } else {
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search,
    );
  }
}
