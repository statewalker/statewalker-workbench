import {
  BaseClass,
  onChange,
  onChangeNotifier,
} from "@statewalker/shared-baseclass";

export type ActionViewVariant =
  | "primary"
  | "secondary"
  | "neutral"
  | "danger"
  | "info";

export interface ActionViewConfig {
  key: string;
  label?: string;
  icon?: string;
  tooltip?: string;
  disabled?: boolean;
  variant?: ActionViewVariant;
  execute?: () => void;
  children?: ActionViewConfig[];
}

export class ActionView<T = unknown> extends BaseClass {
  readonly actionKey: string;

  #label: string | undefined = undefined;
  set label(value: string | undefined) {
    this.#label = value;
    this.notify();
  }
  get label(): string | undefined {
    return this.#label;
  }

  #icon: string | undefined = undefined;
  set icon(value: string | undefined) {
    this.#icon = value;
    this.notify();
  }
  get icon(): string | undefined {
    return this.#icon;
  }

  #tooltip: string | undefined = undefined;
  set tooltip(value: string | undefined) {
    this.#tooltip = value;
    this.notify();
  }
  get tooltip(): string | undefined {
    return this.#tooltip;
  }

  #disabled = false;
  set disabled(value: boolean) {
    this.#disabled = value;
    this.notify();
  }
  get disabled(): boolean {
    return this.#disabled;
  }

  #variant: ActionViewVariant = "neutral";
  set variant(value: ActionViewVariant) {
    this.#variant = value;
    this.notify();
  }
  get variant(): ActionViewVariant {
    return this.#variant;
  }

  children: ActionView[];

  #payload: T | undefined = undefined;
  #submitCounter = 0;

  constructor(config: ActionViewConfig) {
    super();
    this.actionKey = config.key;
    this.#label = config.label;
    this.#icon = config.icon;
    this.#tooltip = config.tooltip;
    this.#disabled = config.disabled ?? false;
    this.#variant = config.variant ?? "neutral";
    this.children = (config.children ?? []).map(
      (child) => new ActionView(child),
    );
    if (config.execute) {
      this.onSubmit(config.execute);
    }
  }

  get payload(): T | undefined {
    return this.#payload;
  }

  submit = (payload?: T): void => {
    if (this.disabled) return;
    if (payload !== undefined) {
      this.#payload = payload;
    }
    this.#submitCounter++;
    this.notify();
  };

  onSubmit = onChangeNotifier(this.onUpdate, () => this.#submitCounter);

  getChild(key: string): ActionView | undefined {
    return this.children.find((c) => c.actionKey === key);
  }

  reset(): void {
    this.#payload = undefined;
    this.#disabled = false;
    this.#label = undefined;
    this.#icon = undefined;
    this.#tooltip = undefined;
    this.notify();
  }
}
