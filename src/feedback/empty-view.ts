import type { ActionView } from "../actions/action-view.js";
import { ViewModel } from "../core/view-model.js";

export class EmptyView extends ViewModel {
  icon: string | undefined;
  title: string;
  description: string | undefined;
  action: ActionView | undefined;

  constructor(options: {
    icon?: string;
    title: string;
    description?: string;
    action?: ActionView;
    key?: string;
  }) {
    super({ key: options.key });
    this.icon = options.icon;
    this.title = options.title;
    this.description = options.description;
    this.action = options.action;
  }
}
