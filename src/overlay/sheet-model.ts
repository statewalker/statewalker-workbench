import type { ActionModel } from "../action-model.js";
import { ViewModel } from "../view-model.js";

export type SheetSide = "left" | "right" | "top" | "bottom";

export class SheetModel extends ViewModel {
  header: string | undefined;
  icon: string | undefined;
  content: ViewModel | undefined;
  side: SheetSide;
  actions: ActionModel[];
  open: boolean;

  constructor(options: {
    header?: string;
    icon?: string;
    content?: ViewModel;
    side?: SheetSide;
    actions?: ActionModel[];
    open?: boolean;
    key?: string;
  }) {
    super({ key: options.key });
    this.header = options.header;
    this.icon = options.icon;
    this.content = options.content;
    this.side = options.side ?? "right";
    this.actions = options.actions ?? [];
    this.open = options.open ?? false;
  }

  setOpen(open: boolean) {
    this.open = open;
    this.notify();
  }

  toggle() {
    this.open = !this.open;
    this.notify();
  }

  setContent(content: ViewModel | undefined) {
    this.content = content;
    this.notify();
  }
}
