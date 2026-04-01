import type { ActionView } from "../actions/action-view.js";
import { ViewModel } from "../core/view-model.js";

// DialogAction is now just ActionView (which has tooltip + children).
export { ActionView as DialogAction } from "../actions/action-view.js";

export class DialogView extends ViewModel {
  header: string;
  icon: string | undefined;
  content: ViewModel;
  actions: ActionView[];

  constructor(options: {
    header: string;
    icon?: string;
    content: ViewModel;
    actions: ActionView[];
    key?: string;
  }) {
    super({ key: options.key });
    this.header = options.header;
    this.icon = options.icon;
    this.content = options.content;
    this.actions = options.actions;
  }
}
