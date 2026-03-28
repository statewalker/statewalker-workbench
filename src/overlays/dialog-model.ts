import type { ActionModel } from "../actions/action-model.js";
import { ViewModel } from "../core/view-model.js";

// DialogAction is now just ActionModel (which has tooltip + children).
export { ActionModel as DialogAction } from "../actions/action-model.js";

export class DialogModel extends ViewModel {
  header: string;
  icon: string | undefined;
  content: ViewModel;
  actions: ActionModel[];

  constructor(options: {
    header: string;
    icon?: string;
    content: ViewModel;
    actions: ActionModel[];
    key?: string;
  }) {
    super({ key: options.key });
    this.header = options.header;
    this.icon = options.icon;
    this.content = options.content;
    this.actions = options.actions;
  }
}
