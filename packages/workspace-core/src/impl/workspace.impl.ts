import { BaseClass } from "@statewalker/shared-baseclass";
import type { FilesApi } from "@statewalker/webrun-files";
import type {
  AdapterCtor,
  AdapterFactory,
  ConcreteAdapterCtor,
  WorkspaceAdapter,
  Workspace as WorkspaceInterface,
} from "@statewalker/workspace-api";

/**
 * Concrete `Workspace` implementation. Starts closed, publishes its live state
 * only after `open()` resolves, and cascades `close()` across instantiated
 * adapters in reverse instantiation order.
 */
// biome-ignore lint/suspicious/noExplicitAny: registry keys are heterogeneous
type AnyKey = AdapterCtor<any>;
// biome-ignore lint/suspicious/noExplicitAny: concrete ctor values are heterogeneous
type AnyCtor = ConcreteAdapterCtor<any>;
// biome-ignore lint/suspicious/noExplicitAny: factory matches any adapter
type AnyFactory = AdapterFactory<any>;

export class Workspace extends BaseClass implements WorkspaceInterface {
  private _isOpened = false;
  private _files: FilesApi | null = null;
  private _label = "";

  private readonly _registrations = new Map<AnyKey, AnyCtor | AnyFactory>();
  private readonly _instances = new Map<AnyKey, WorkspaceAdapter>();
  private readonly _instantiatedInOrder: WorkspaceAdapter[] = [];
  private readonly _instantiating = new Set<AnyKey>();

  private readonly _onLoadListeners = new Set<() => void>();
  private readonly _onUnloadListeners = new Set<() => void>();

  get isOpened(): boolean {
    return this._isOpened;
  }

  get label(): string {
    return this._label;
  }

  get files(): FilesApi {
    if (!this._files) {
      throw new Error("Workspace has no file system installed — call setFileSystem() first");
    }
    return this._files;
  }

  setFileSystem(files: FilesApi, label?: string): this {
    if (this._isOpened) {
      throw new Error("Workspace.setFileSystem is only legal while closed — call close() first");
    }
    this._files = files;
    if (label !== undefined) this._label = label;
    this.notify();
    return this;
  }

  setAdapter<T extends WorkspaceAdapter>(type: ConcreteAdapterCtor<T>): this;
  setAdapter<T extends WorkspaceAdapter, C extends T>(
    type: AdapterCtor<T>,
    impl: ConcreteAdapterCtor<C> | AdapterFactory<C>,
  ): this;
  setAdapter(type: AnyKey, impl?: AnyCtor | AnyFactory): this {
    const implementation = impl ?? (type as unknown as AnyCtor);
    const existing = this._instances.get(type);
    if (existing) {
      void this._closeInstance(existing);
      this._instances.delete(type);
      const idx = this._instantiatedInOrder.indexOf(existing);
      if (idx !== -1) this._instantiatedInOrder.splice(idx, 1);
    }
    this._registrations.set(type, implementation);
    return this;
  }

  getAdapter<T extends WorkspaceAdapter>(type: AdapterCtor<T>): T | null {
    const cached = this._instances.get(type);
    if (cached) return cached as T;
    const registered = this._registrations.get(type);
    if (!registered) return null;
    if (this._instantiating.has(type)) {
      throw new Error(`Adapter cycle detected while constructing ${describe(type)}`);
    }
    this._instantiating.add(type);
    try {
      const instance = isClass(registered) ? new registered(this) : registered(this);
      this._instances.set(type, instance);
      this._instantiatedInOrder.push(instance);
      return instance as T;
    } finally {
      this._instantiating.delete(type);
    }
  }

  requireAdapter<T extends WorkspaceAdapter>(type: AdapterCtor<T>): T {
    const instance = this.getAdapter(type);
    if (!instance) {
      throw new Error(`No adapter registered for ${describe(type)}`);
    }
    return instance;
  }

  onLoad(cb: () => void): () => void {
    if (this._isOpened) {
      try {
        cb();
      } catch (err) {
        logListenerError("onLoad", err);
      }
    }
    this._onLoadListeners.add(cb);
    return () => {
      this._onLoadListeners.delete(cb);
    };
  }

  onUnload(cb: () => void): () => void {
    this._onUnloadListeners.add(cb);
    return () => {
      this._onUnloadListeners.delete(cb);
    };
  }

  async open(): Promise<this> {
    if (this._isOpened) return this;
    if (!this._files) {
      throw new Error("Workspace.open requires a file system — call setFileSystem() first");
    }
    this._isOpened = true;
    this.notify();
    for (const listener of this._onLoadListeners) {
      try {
        listener();
      } catch (err) {
        logListenerError("onLoad", err);
      }
    }
    return this;
  }

  async close(): Promise<void> {
    if (!this._isOpened) return;
    for (const listener of this._onUnloadListeners) {
      try {
        listener();
      } catch (err) {
        logListenerError("onUnload", err);
      }
    }
    const errors: unknown[] = [];
    for (let i = this._instantiatedInOrder.length - 1; i >= 0; i--) {
      const adapter = this._instantiatedInOrder[i];
      if (!adapter) continue;
      try {
        await adapter.close?.();
      } catch (err) {
        errors.push(err);
      }
    }
    this._instances.clear();
    this._instantiatedInOrder.length = 0;
    this._isOpened = false;
    this.notify();
    if (errors.length > 0) {
      throw new AggregateError(errors, "One or more workspace adapters threw during close()");
    }
  }

  private async _closeInstance(adapter: WorkspaceAdapter): Promise<void> {
    try {
      await adapter.close?.();
    } catch (err) {
      logListenerError("adapter.close (re-register)", err);
    }
  }
}

function isClass(value: AnyCtor | AnyFactory): value is AnyCtor {
  return (
    typeof value === "function" && typeof value.prototype === "object" && value.prototype !== null
  );
}

function describe(type: AdapterCtor<WorkspaceAdapter>): string {
  return type.name || "<anonymous adapter>";
}

function logListenerError(scope: string, err: unknown): void {
  console.error(`[workspace] ${scope} listener threw:`, err);
}
