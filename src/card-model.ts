import type { ActionModel } from "./action-model.js";
import { ViewModel } from "./view-model.js";

export class CardModel extends ViewModel {
  header: string | ViewModel;
  icon: string | undefined;
  content: string | ViewModel;
  footer: string | ViewModel | undefined;
  actions: ActionModel[];

  constructor(options: {
    header: string | ViewModel;
    icon?: string;
    content: string | ViewModel;
    footer?: string | ViewModel;
    actions?: ActionModel[];
    key?: string;
  }) {
    super({ key: options.key });
    this.header = options.header;
    this.icon = options.icon;
    this.content = options.content;
    this.footer = options.footer;
    this.actions = options.actions ?? [];
  }
}
