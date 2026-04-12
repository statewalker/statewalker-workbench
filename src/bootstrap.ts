import { accessSync, readFileSync, realpathSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resolve as resolveImport } from "import-meta-resolve";
import {
  ModuleResolver,
  formatModulesMap,
} from "@repo/backbone-common";
import { getLogger } from "@repo/shared/logger";
import { newRegistry } from "@repo/shared/registry";

// --- Node-specific resolution callbacks ---

function toFilePath(url: string): string {
  return url.startsWith("file://") ? fileURLToPath(url) : url;
}

function findPackageJsonUp(dir: string): string {
  let current = resolve(dir);
  for (;;) {
    const candidate = join(current, "package.json");
    try {
      accessSync(candidate);
      return candidate;
    } catch {
      const parent = dirname(current);
      if (parent === current) break;
      current = parent;
    }
  }
  throw new Error(`No package.json found above ${dir}`);
}

/**
 * Fallback for packages whose root export is not defined (ERR_PACKAGE_PATH_NOT_EXPORTED).
 * Walks node_modules to locate the package directory and returns its package.json path.
 */
function resolvePackageJsonFallback(
  packageName: string,
  fromDir: string,
): string {
  let dir = resolve(fromDir);
  const root = resolve("/");
  while (dir !== root) {
    const candidate = join(dir, "node_modules", packageName, "package.json");
    try {
      accessSync(candidate);
      return realpathSync(candidate);
    } catch {
      dir = dirname(dir);
    }
  }
  throw new Error(`Cannot find package '${packageName}' from ${fromDir}`);
}

function createNodeResolver(): ModuleResolver {
  return new ModuleResolver({
    async resolve(baseUrl: string, moduleId: string): Promise<string> {
      try {
        return resolveImport(moduleId, baseUrl);
      } catch (error: unknown) {
        if (
          error instanceof Error &&
          (error as NodeJS.ErrnoException).code ===
            "ERR_PACKAGE_PATH_NOT_EXPORTED"
        ) {
          // Package exists but has no root export (e.g. only subpath exports).
          // Fall back to locating its directory via node_modules.
          const baseDir = dirname(toFilePath(baseUrl));
          const pkgJsonPath = resolvePackageJsonFallback(moduleId, baseDir);
          return pathToFileURL(dirname(pkgJsonPath)).href;
        }
        throw error;
      }
    },

    async findPackageJson(moduleUrl: string): Promise<string> {
      const filePath = toFilePath(moduleUrl);
      const packageJsonPath = findPackageJsonUp(dirname(filePath));
      return pathToFileURL(packageJsonPath).href;
    },

    async loadPackageJson(
      packageJsonUrl: string,
    ): Promise<Record<string, unknown>> {
      const raw = readFileSync(toFilePath(packageJsonUrl), "utf-8");
      return JSON.parse(raw) as Record<string, unknown>;
    },
  });
}

// --- Bootstrap ---

export async function bootstrap(
  moduleNames: string[],
): Promise<() => Promise<void>> {
  const [register, cleanup] = newRegistry();
  try {
    const context: Record<string, unknown> = {};

    // Logger
    {
      const logger = getLogger(context);
      register(() => logger.info("[backbone] Shutting down..."));
    }

    // Resolve modules in dependency order
    const resolver = createNodeResolver();
    const baseUrl = pathToFileURL(join(process.cwd(), "package.json")).href;
    const ordered = await resolver.resolveModules(baseUrl, moduleNames);

    // Load and initialise modules
    const modulesMap: Record<string, string> = {};
    for (const mod of ordered) {
      const logger = getLogger(context);

      let imported: Record<string, unknown>;
      try {
        imported = await import(mod.url);
      } catch {
        continue;
      }
      const init = imported.default;
      if (typeof init !== "function") continue;

      logger.info(`[backbone] Loading module: ${mod.name}`);
      modulesMap[mod.name] = mod.url;
      const teardown: unknown = await init(context);
      if (typeof teardown === "function") {
        register(teardown as () => Promise<void>);
      }
    }

    const logger = getLogger(context);
    logger.info(
      `[backbone] Started with ${ordered.length} module(s)`,
      formatModulesMap(modulesMap),
    );

    // Master cleanup (reverse order)
    return cleanup;
  } catch (error) {
    await cleanup();
    throw error;
  }
}
