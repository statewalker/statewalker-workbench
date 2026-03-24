import type { ActionModel } from "../action-model.js";
import { ViewModel } from "../view-model.js";

export class EmptyModel extends ViewModel {
  icon: string | undefined;
  title: string;
  description: string | undefined;
  action: ActionModel | undefined;

  constructor(options: {
    icon?: string;
    title: string;
    description?: string;
    action?: ActionModel;
    key?: string;
  }) {
    super({ key: options.key });
    this.icon = options.icon;
    this.title = options.title;
    this.description = options.description;
    this.action = options.action;
  }
}
