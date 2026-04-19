import { BaseClass } from "@statewalker/shared-baseclass";

export class UIModelRegistry<T> extends BaseClass {
  private _items: T[] = [];

  add(item: T): () => void {
    this._items = [...this._items, item];
    this.notify();
    return () => this.remove(item);
  }

  remove(item: T): void {
    const idx = this._items.indexOf(item);
    if (idx >= 0) {
      this._items = this._items.filter((i) => i !== item);
      this.notify();
    }
  }

  getAll(): T[] {
    return this._items;
  }

  get length(): number {
    return this._items.length;
  }
}

type Context = Record<string, unknown>;

export function createModelPoint<T>(
  getModel: (ctx: Context) => UIModelRegistry<T>,
) {
  function publish(context: Context, item: T): () => void {
    return getModel(context).add(item);
  }

  function listen(
    context: Context,
    callback: (items: T[]) => void,
  ): () => void {
    const model = getModel(context);
    const items = model.getAll();
    if (items.length > 0) {
      callback(items);
    }
    return model.onUpdate(() => callback(model.getAll()));
  }

  return [publish, listen] as const;
}
