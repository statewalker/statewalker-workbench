import type { ResolvedModule } from "@repo/backbone-common";
import { newRegistry } from "@repo/shared/registry";
import { buildImportMap } from "./build-import-map.js";
import { createBrowserResolver } from "./create-browser-resolver.js";
import type { ShellConfig } from "./shell-config.js";
import { sourceHook } from "./source-hooks.js";

// es-module-shims global API (declared, not imported — loaded via <script>)
declare const importShim: {
  (specifier: string): Promise<Record<string, unknown>>;
  addImportMap(map: { imports: Record<string, string> }): void;
  getImportMap(): { imports: Record<string, string> };
};

/**
 * Browser-side module bootstrap. Mirrors backbone-server's bootstrap():
 * 1. Build module registry from config
 * 2. Resolve dependency graph via HTTP-fetched package.json
 * 3. Topologically sort
 * 4. Build import map from package.json exports
 * 5. Inject import map via importShim.addImportMap()
 * 6. Load each module in order, call default(ctx) if function
 */
export async function bootstrap(
  config: ShellConfig,
): Promise<() => void> {
  const [register, cleanup] = newRegistry();

  try {
    const context: Record<string, unknown> = {};

    // 1. Build module registry: name → base URL
    const registry = new Map(Object.entries(config.modules));

    // 2. Resolve dependency graph
    const resolver = createBrowserResolver(registry);
    const ordered = await resolver.resolveModules("", config.roots);

    // Attach packageJson to resolved modules for import map builder
    // The resolver already fetched them — store in a side map
    const resolvedWithPkg = ordered as Array<
      ResolvedModule & { packageJson?: Record<string, unknown> }
    >;

    // 3. Build and inject import map
    const importMap = buildImportMap(resolvedWithPkg, registry);

    // Also add leaf-node entries from registry that weren't resolved
    // (non-workspace deps like react, zod)
    for (const [name, url] of registry) {
      if (!importMap.imports[name] && !ordered.some((m) => m.name === name)) {
        importMap.imports[name] = url;
      }
    }

    importShim.addImportMap(importMap);

    console.log(
      `[backbone-web] Import map: ${Object.keys(importMap.imports).length} entries`,
    );

    // 4. Load modules in topo order
    for (const mod of ordered) {
      let imported: Record<string, unknown>;
      try {
        imported = await importShim(mod.name);
      } catch (err) {
        console.error(`[backbone-web] Failed to load ${mod.name}:`, err);
        continue;
      }
      const init = imported.default;
      if (typeof init !== "function") continue;

      console.log(`[backbone-web] Activating: ${mod.name}`);
      const teardown: unknown = await init(context);
      if (typeof teardown === "function") {
        register(teardown as () => void);
      }
    }

    console.log(
      `[backbone-web] Started with ${ordered.length} module(s)`,
    );

    return cleanup;
  } catch (error) {
    cleanup();
    throw error;
  }
}

/**
 * Configure es-module-shims options. Must be called BEFORE es-module-shims loads.
 * Typically set via <script type="esms-options"> in HTML, but this helper
 * can be used to set options programmatically.
 */
export function configureEsModuleShims(options?: {
  hotReload?: boolean;
}): void {
  (window as unknown as Record<string, unknown>).esmsInitOptions = {
    shimMode: true,
    mapOverrides: true,
    hotReload: options?.hotReload ?? false,
    source: sourceHook,
  };
}
