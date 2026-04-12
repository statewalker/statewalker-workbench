import { newAdapter } from "@repo/shared/adapters";
import { ViewModel } from "../core/view-model.js";

export interface IconResult {
  icon: string;
  color?: string;
}

export type IconHandler = (uri: string, mimeType: string) => IconResult;
export type OpenerHandler = (uri: string, mimeType: string) => void;
export type VisualizerHandler = (
  uri: string,
  mimeType: string,
) => ViewModel | null;

/**
 * Internal handler map with extension-first lookup and MIME fallback.
 * Mirrors the ExtractorRegistry pattern with longest-suffix matching.
 */
class HandlerMap<T> {
  readonly patterns = new Map<string, T>();
  readonly mimes = new Map<string, T>();

  register(pattern: string, handler: T): () => void {
    this.patterns.set(pattern, handler);
    return () => {
      this.patterns.delete(pattern);
    };
  }

  registerByMime(mimeType: string, handler: T): () => void {
    this.mimes.set(mimeType, handler);
    return () => {
      this.mimes.delete(mimeType);
    };
  }

  /**
   * Resolve by filename suffix (longest match wins), then MIME fallback.
   */
  get(uri: string, mimeType?: string): T | undefined {
    const filename = extractFilename(uri);
    const lower = filename.toLowerCase();

    let best: T | undefined;
    let bestLen = 0;
    for (const [pattern, handler] of this.patterns) {
      const suffix = pattern.startsWith("*") ? pattern.slice(1) : pattern;
      if (lower.endsWith(suffix) && suffix.length > bestLen) {
        best = handler;
        bestLen = suffix.length;
      }
    }
    if (best) return best;
    if (mimeType) return this.mimes.get(mimeType);
    return undefined;
  }
}

function extractFilename(uri: string): string {
  // Handle collectionId:path format
  const colonIdx = uri.indexOf(":");
  const path = colonIdx >= 0 ? uri.slice(colonIdx + 1) : uri;
  const slashIdx = path.lastIndexOf("/");
  return slashIdx >= 0 ? path.slice(slashIdx + 1) : path;
}

/**
 * Extensible registry that maps file extensions and MIME types to handlers
 * for icons, openers, and visualizers. Fragments register handlers at init;
 * UI code looks up handlers by URI.
 */
export class ResourceHandlerRegistry extends ViewModel {
  readonly #icons = new HandlerMap<IconHandler>();
  readonly #openers = new HandlerMap<OpenerHandler>();
  readonly #visualizers = new HandlerMap<VisualizerHandler>();

  // ── Registration ───────────────────────────────────────────

  registerIcon(pattern: string, handler: IconHandler): () => void {
    const dispose = this.#icons.register(pattern, handler);
    this.notify();
    return () => {
      dispose();
      this.notify();
    };
  }

  registerIconByMime(mimeType: string, handler: IconHandler): () => void {
    const dispose = this.#icons.registerByMime(mimeType, handler);
    this.notify();
    return () => {
      dispose();
      this.notify();
    };
  }

  registerOpener(pattern: string, handler: OpenerHandler): () => void {
    const dispose = this.#openers.register(pattern, handler);
    this.notify();
    return () => {
      dispose();
      this.notify();
    };
  }

  registerOpenerByMime(mimeType: string, handler: OpenerHandler): () => void {
    const dispose = this.#openers.registerByMime(mimeType, handler);
    this.notify();
    return () => {
      dispose();
      this.notify();
    };
  }

  registerVisualizer(pattern: string, handler: VisualizerHandler): () => void {
    const dispose = this.#visualizers.register(pattern, handler);
    this.notify();
    return () => {
      dispose();
      this.notify();
    };
  }

  registerVisualizerByMime(
    mimeType: string,
    handler: VisualizerHandler,
  ): () => void {
    const dispose = this.#visualizers.registerByMime(mimeType, handler);
    this.notify();
    return () => {
      dispose();
      this.notify();
    };
  }

  // ── Lookup ─────────────────────────────────────────────────

  getIcon(uri: string, mimeType?: string): IconResult | undefined {
    return this.#icons.get(uri, mimeType)?.(uri, mimeType ?? "");
  }

  getOpener(uri: string, mimeType?: string): OpenerHandler | undefined {
    return this.#openers.get(uri, mimeType);
  }

  getVisualizer(uri: string, mimeType?: string): VisualizerHandler | undefined {
    return this.#visualizers.get(uri, mimeType);
  }
}

export const [
  getResourceHandlerRegistry,
  setResourceHandlerRegistry,
  removeResourceHandlerRegistry,
] = newAdapter<ResourceHandlerRegistry>(
  "model:resource-handler-registry",
  () => new ResourceHandlerRegistry(),
);
