import { ViewModel } from "../core/index.js";

export type ColorSliderChannel =
  | "hue"
  | "saturation"
  | "brightness"
  | "red"
  | "green"
  | "blue"
  | "alpha";

export class ColorSliderView extends ViewModel {
  #value = "#ff0000";
  set value(value: string) {
    this.#value = value;
    this.notify();
  }
  get value(): string {
    return this.#value;
  }

  #channel: ColorSliderChannel = "hue";
  set channel(value: ColorSliderChannel) {
    this.#channel = value;
    this.notify();
  }
  get channel(): ColorSliderChannel {
    return this.#channel;
  }

  #label: string | undefined;
  set label(value: string | undefined) {
    this.#label = value;
    this.notify();
  }
  get label(): string | undefined {
    return this.#label;
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
    channel?: ColorSliderChannel;
    label?: string;
    isDisabled?: boolean;
    key?: string;
  }) {
    super({ key: options?.key });
    this.#value = options?.value ?? "#ff0000";
    this.#channel = options?.channel ?? "hue";
    this.#label = options?.label;
    this.#isDisabled = options?.isDisabled ?? false;
  }

  setValue(value: string): void {
    this.value = value;
  }
}
