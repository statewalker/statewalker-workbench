import { ViewModel } from "../core/index.js";

export class LabeledValueModel extends ViewModel {
  readonly label: string;
  readonly value: string | number;

  #formatOptions: Intl.NumberFormatOptions | undefined;
  set formatOptions(value: Intl.NumberFormatOptions | undefined) {
    this.#formatOptions = value;
    this.notify();
  }
  get formatOptions(): Intl.NumberFormatOptions | undefined {
    return this.#formatOptions;
  }

  constructor(options: {
    label: string;
    value: string | number;
    formatOptions?: Intl.NumberFormatOptions;
    key?: string;
  }) {
    super({ key: options.key });
    this.label = options.label;
    this.value = options.value;
    this.#formatOptions = options.formatOptions;
  }
}
