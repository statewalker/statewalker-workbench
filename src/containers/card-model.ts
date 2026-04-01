import type { ActionView } from "../actions/action-view.js";
import { ViewModel } from "../core/view-model.js";

export class CardModel extends ViewModel {
  header: string | ViewModel;
  icon: string | undefined;
  content: string | ViewModel;
  footer: string | ViewModel | undefined;
  actions: ActionView[];

  constructor(options: {
    header: string | ViewModel;
    icon?: string;
    content: string | ViewModel;
    footer?: string | ViewModel;
    actions?: ActionView[];
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
