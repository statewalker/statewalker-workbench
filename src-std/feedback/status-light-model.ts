import { ViewModel } from "../core/index.js";

export type StatusLightVariant =
  | "positive"
  | "negative"
  | "notice"
  | "info"
  | "neutral"
  | "celery"
  | "chartreuse"
  | "yellow"
  | "magenta"
  | "fuchsia"
  | "purple"
  | "indigo"
  | "seafoam";

export type StatusLightSize = "S" | "M" | "L";

export class StatusLightModel extends ViewModel {
  #variant: StatusLightVariant = "neutral";
  set variant(value: StatusLightVariant) {
    this.#variant = value;
    this.notify();
  }
  get variant(): StatusLightVariant {
    return this.#variant;
  }

  #label: string;
  set label(value: string) {
    this.#label = value;
    this.notify();
  }
  get label(): string {
    return this.#label;
  }

  #size: StatusLightSize = "M";
  set size(value: StatusLightSize) {
    this.#size = value;
    this.notify();
  }
  get size(): StatusLightSize {
    return this.#size;
  }

  constructor(options: {
    label: string;
    variant?: StatusLightVariant;
    size?: StatusLightSize;
    key?: string;
  }) {
    super({ key: options.key });
    this.#label = options.label;
    this.#variant = options.variant ?? "neutral";
    this.#size = options.size ?? "M";
  }
}
