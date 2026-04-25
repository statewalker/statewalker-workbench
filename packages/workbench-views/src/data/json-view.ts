import { ViewModel } from "../core/view-model.js";

export class JsonView extends ViewModel {
  data: unknown;
  label: string | undefined;

  constructor(options: { data: unknown; label?: string; key?: string }) {
    super({ key: options.key });
    this.data = options.data;
    this.label = options.label;
  }

  setData(data: unknown) {
    this.data = data;
    this.notify();
  }
}
