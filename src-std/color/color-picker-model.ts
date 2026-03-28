import { ViewModel } from "../core/index.js";

export class ColorPickerModel extends ViewModel {
  #value = "#000000";
  set value(value: string) {
    this.#value = value;
    this.notify();
  }
  get value(): string {
    return this.#value;
  }

  #channel: string | undefined;
  set channel(value: string | undefined) {
    this.#channel = value;
    this.notify();
  }
  get channel(): string | undefined {
    return this.#channel;
  }

  constructor(options?: {
    value?: string;
    channel?: string;
    key?: string;
  }) {
    super({ key: options?.key });
    this.#value = options?.value ?? "#000000";
    this.#channel = options?.channel;
  }

  setValue(value: string): void {
    this.value = value;
  }
}
