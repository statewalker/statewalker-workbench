import { BaseClass, onChange } from "@repo/shared/models";

export type ActionVariant =
  | "primary"
  | "secondary"
  | "neutral"
  | "danger"
  | "info";

export interface ActionConfig {
  key: string;
  label?: string;
  icon?: string;
  tooltip?: string;
  disabled?: boolean;
  variant?: ActionVariant;
  execute?: () => void;
  children?: ActionConfig[];
}

export class ActionModel extends BaseClass {
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

  #variant: ActionVariant = "neutral";
  set variant(value: ActionVariant) {
    this.#variant = value;
    this.notify();
  }
  get variant(): ActionVariant {
    return this.#variant;
  }

  children: ActionModel[];

  #payload: unknown = undefined;
  #submitCounter = 0;

  constructor(config: ActionConfig) {
    super();
    this.actionKey = config.key;
    this.#label = config.label;
    this.#icon = config.icon;
    this.#tooltip = config.tooltip;
    this.#disabled = config.disabled ?? false;
    this.#variant = config.variant ?? "neutral";
    this.children = (config.children ?? []).map(
      (child) => new ActionModel(child),
    );
    if (config.execute) {
      this.onSubmit(config.execute);
    }
  }

  get payload(): unknown {
    return this.#payload;
  }

  submit = (payload?: unknown): void => {
    if (this.disabled) return;
    if (payload !== undefined) {
      this.#payload = payload;
    }
    this.#submitCounter++;
    this.notify();
  };

  onSubmit = (cb: () => void): (() => void) => {
    return onChange(
      (cb) => this.onUpdate(cb),
      cb,
      () => this.#submitCounter,
    );
  };

  getChild(key: string): ActionModel | undefined {
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
