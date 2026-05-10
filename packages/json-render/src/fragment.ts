// Combined init: registers catalog-registry and spec-store side-by-side.
import { newRegistry } from "@statewalker/shared-registry";
import initCatalogRegistry from "./catalog-registry-public/init.js";
import initSpecStore from "./spec-store-public/init.js";

export default function init(ctx: Record<string, unknown>): () => Promise<void> {
  const [register, cleanup] = newRegistry();
  register(initCatalogRegistry(ctx));
  register(initSpecStore(ctx));
  return cleanup;
}
