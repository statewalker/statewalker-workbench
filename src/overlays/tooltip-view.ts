import { ViewModel } from "../core/index.js";

export type TooltipPlacement = "top" | "bottom" | "left" | "right";

export type TooltipVariant = "neutral" | "positive" | "negative" | "info";

export class TooltipView extends ViewModel {
  #content: string | ViewModel;
  set content(value: string | ViewModel) {
    this.#content = value;
    this.notify();
  }
  get content(): string | ViewModel {
    return this.#content;
  }

  #placement: TooltipPlacement;
  set placement(value: TooltipPlacement) {
    this.#placement = value;
    this.notify();
  }
  get placement(): TooltipPlacement {
    return this.#placement;
  }

  #delay: number;
  set delay(value: number) {
    this.#delay = value;
    this.notify();
  }
  get delay(): number {
    return this.#delay;
  }

  #variant: TooltipVariant;
  set variant(value: TooltipVariant) {
    this.#variant = value;
    this.notify();
  }
  get variant(): TooltipVariant {
    return this.#variant;
  }

  constructor(options: {
    key?: string;
    content: string | ViewModel;
    placement?: TooltipPlacement;
    delay?: number;
    variant?: TooltipVariant;
  }) {
    super({ key: options.key });
    this.#content = options.content;
    this.#placement = options.placement ?? "top";
    this.#delay = options.delay ?? 300;
    this.#variant = options.variant ?? "neutral";
  }
}
