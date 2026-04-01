import { ContentPanelView } from "../core/content-panel-view.js";
import type { ActionView, ViewModel } from "../core/index.js";

export class CardView extends ContentPanelView {
  #actions: ActionView[];
  #preview: ViewModel | undefined;

  constructor(options?: {
    key?: string;
    children?: ViewModel[];
    header?: string | ViewModel;
    footer?: string | ViewModel;
    actions?: ActionView[];
    preview?: ViewModel;
  }) {
    super(options);
    this.#actions = options?.actions ?? [];
    this.#preview = options?.preview;
  }

  get actions(): ActionView[] {
    return this.#actions;
  }
  set actions(value: ActionView[]) {
    this.#actions = value;
    this.notify();
  }

  get preview(): ViewModel | undefined {
    return this.#preview;
  }
  set preview(value: ViewModel | undefined) {
    this.#preview = value;
    this.notify();
  }
}
