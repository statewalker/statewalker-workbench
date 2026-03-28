import { ViewModel } from "../core/view-model.js";

export type StackDirection = "vertical" | "horizontal";

export type StackAlign = "start" | "center" | "end" | "stretch";

export type StackJustify =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly";

export class StackModel extends ViewModel {
  direction: StackDirection;
  gap: string;
  padding: string;
  align: StackAlign;
  justify: StackJustify;
  items: ViewModel[];
  wrap: boolean;

  constructor(options: {
    direction?: StackDirection;
    gap?: string;
    padding?: string;
    align?: StackAlign;
    justify?: StackJustify;
    items?: ViewModel[];
    wrap?: boolean;
    key?: string;
  }) {
    super({ key: options.key });
    this.direction = options.direction ?? "vertical";
    this.gap = options.gap ?? "1rem";
    this.padding = options.padding ?? "0";
    this.align = options.align ?? "stretch";
    this.justify = options.justify ?? "start";
    this.items = options.items ?? [];
    this.wrap = options.wrap ?? false;
  }

  addItem(item: ViewModel) {
    this.items = [...this.items, item];
    this.notify();
  }

  removeItem(key: string) {
    this.items = this.items.filter((i) => i.key !== key);
    this.notify();
  }

  setItems(items: ViewModel[]) {
    this.items = items;
    this.notify();
  }
}
