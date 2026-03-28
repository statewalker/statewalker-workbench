import { ViewModel } from "../core/index.js";

export class ColorAreaModel extends ViewModel {
  #value = "#ff0000";
  set value(value: string) {
    this.#value = value;
    this.notify();
  }
  get value(): string {
    return this.#value;
  }

  #xChannel = "saturation";
  set xChannel(value: string) {
    this.#xChannel = value;
    this.notify();
  }
  get xChannel(): string {
    return this.#xChannel;
  }

  #yChannel = "brightness";
  set yChannel(value: string) {
    this.#yChannel = value;
    this.notify();
  }
  get yChannel(): string {
    return this.#yChannel;
  }

  #isDisabled = false;
  set isDisabled(value: boolean) {
    this.#isDisabled = value;
    this.notify();
  }
  get isDisabled(): boolean {
    return this.#isDisabled;
  }

  constructor(options?: {
    value?: string;
    xChannel?: string;
    yChannel?: string;
    isDisabled?: boolean;
    key?: string;
  }) {
    super({ key: options?.key });
    this.#value = options?.value ?? "#ff0000";
    this.#xChannel = options?.xChannel ?? "saturation";
    this.#yChannel = options?.yChannel ?? "brightness";
    this.#isDisabled = options?.isDisabled ?? false;
  }

  setValue(value: string): void {
    this.value = value;
  }
}
