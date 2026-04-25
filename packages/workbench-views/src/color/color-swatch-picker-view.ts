import { ViewModel } from "../core/index.js";

export type ColorSwatchPickerSize = "XS" | "S" | "M" | "L";
export type ColorSwatchPickerRounding = "none" | "regular" | "full";

export class ColorSwatchPickerView extends ViewModel {
  #colors: string[] = [];
  set colors(value: string[]) {
    this.#colors = value;
    this.notify();
  }
  get colors(): string[] {
    return this.#colors;
  }

  #selectedColor: string | undefined;
  set selectedColor(value: string | undefined) {
    this.#selectedColor = value;
    this.notify();
  }
  get selectedColor(): string | undefined {
    return this.#selectedColor;
  }

  #size: ColorSwatchPickerSize = "M";
  set size(value: ColorSwatchPickerSize) {
    this.#size = value;
    this.notify();
  }
  get size(): ColorSwatchPickerSize {
    return this.#size;
  }

  #rounding: ColorSwatchPickerRounding = "regular";
  set rounding(value: ColorSwatchPickerRounding) {
    this.#rounding = value;
    this.notify();
  }
  get rounding(): ColorSwatchPickerRounding {
    return this.#rounding;
  }

  constructor(options?: {
    colors?: string[];
    selectedColor?: string;
    size?: ColorSwatchPickerSize;
    rounding?: ColorSwatchPickerRounding;
    key?: string;
  }) {
    super({ key: options?.key });
    this.#colors = options?.colors ?? [];
    this.#selectedColor = options?.selectedColor;
    this.#size = options?.size ?? "M";
    this.#rounding = options?.rounding ?? "regular";
  }

  setSelectedColor(color: string | undefined): void {
    this.selectedColor = color;
  }
}
