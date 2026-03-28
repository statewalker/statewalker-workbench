import type { ActionModel, ViewModel } from "../core/index.js";
import { ContentPanelModel } from "./content-panel-model.js";

export class CardModel extends ContentPanelModel {
  #actions: ActionModel[];
  #preview: ViewModel | undefined;

  constructor(options?: {
    key?: string;
    children?: ViewModel[];
    header?: string | ViewModel;
    footer?: string | ViewModel;
    actions?: ActionModel[];
    preview?: ViewModel;
  }) {
    super(options);
    this.#actions = options?.actions ?? [];
    this.#preview = options?.preview;
  }

  get actions(): ActionModel[] {
    return this.#actions;
  }
  set actions(value: ActionModel[]) {
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
