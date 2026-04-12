/**
 * Shell configuration for backbone-web bootstrap.
 */
export interface ShellConfig {
  /** Root module names to activate (like backbone-server's CLI args). */
  roots: string[];
  /** Module registry: name → base URL (where package.json can be fetched). */
  modules: Record<string, string>;
}

/**
 * Load shell configuration from multiple sources, merged in priority order:
 * 1. URL parameters (highest priority)
 * 2. Fetched config JSON (from ?config=url)
 * 3. Embedded config (from <script type="application/json" id="shell-config">)
 * 4. Provided defaults (lowest priority)
 */
export async function loadShellConfig(
  defaults?: Partial<ShellConfig>,
): Promise<ShellConfig> {
  let config: ShellConfig = {
    roots: defaults?.roots ?? [],
    modules: { ...defaults?.modules },
  };

  // Try embedded config from HTML
  const embeddedEl = document.getElementById("shell-config");
  if (embeddedEl?.textContent) {
    try {
      const embedded = JSON.parse(embeddedEl.textContent) as Partial<ShellConfig>;
      config = mergeConfig(config, embedded);
    } catch {
      console.warn("[backbone-web] Failed to parse embedded shell-config");
    }
  }

  // Try fetched config from URL parameter
  const params = new URLSearchParams(location.search);
  const configUrl = params.get("config");
  if (configUrl) {
    try {
      const res = await fetch(configUrl);
      if (res.ok) {
        const fetched = (await res.json()) as Partial<ShellConfig>;
        config = mergeConfig(config, fetched);
      }
    } catch {
      console.warn(`[backbone-web] Failed to fetch config from ${configUrl}`);
    }
  }

  // URL parameter overrides
  const rootParams = params.getAll("root");
  if (rootParams.length > 0) {
    config.roots = rootParams;
  }

  for (const moduleParam of params.getAll("module")) {
    // Format: name:url (first colon is separator, rest is URL)
    const colonIdx = moduleParam.indexOf(":");
    if (colonIdx > 0) {
      const name = moduleParam.slice(0, colonIdx).trim();
      const url = moduleParam.slice(colonIdx + 1).trim();
      config.modules[name] = url;
    }
  }

  return config;
}

function mergeConfig(
  base: ShellConfig,
  override: Partial<ShellConfig>,
): ShellConfig {
  return {
    roots: override.roots ?? base.roots,
    modules: { ...base.modules, ...override.modules },
  };
}
