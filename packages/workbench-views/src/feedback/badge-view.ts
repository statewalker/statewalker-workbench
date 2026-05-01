import { ViewModel } from "../core/index.js";

export type BadgeVariant = "positive" | "negative" | "neutral" | "informative";

export type BadgeSize = "S" | "M" | "L";

export class BadgeView extends ViewModel {
  #label: string;
  set label(value: string) {
    this.#label = value;
    this.notify();
  }
  get label(): string {
    return this.#label;
  }

  #variant: BadgeVariant = "neutral";
  set variant(value: BadgeVariant) {
    this.#variant = value;
    this.notify();
  }
  get variant(): BadgeVariant {
    return this.#variant;
  }

  #size: BadgeSize = "M";
  set size(value: BadgeSize) {
    this.#size = value;
    this.notify();
  }
  get size(): BadgeSize {
    return this.#size;
  }

  #icon: string | undefined = undefined;
  set icon(value: string | undefined) {
    this.#icon = value;
    this.notify();
  }
  get icon(): string | undefined {
    return this.#icon;
  }

  constructor(options: {
    label: string;
    variant?: BadgeVariant;
    size?: BadgeSize;
    icon?: string;
    key?: string;
  }) {
    super({ key: options.key });
    this.#label = options.label;
    this.#variant = options.variant ?? "neutral";
    this.#size = options.size ?? "M";
    this.#icon = options.icon;
  }
}
