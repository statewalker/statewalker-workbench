import { ContainerModel } from "../core/index.js";
import type { CheckboxModel } from "./checkbox-model.js";

export class CheckboxGroupModel extends ContainerModel<CheckboxModel> {
  #label: string;
  set label(value: string) {
    this.#label = value;
    this.notify();
  }
  get label(): string {
    return this.#label;
  }

  #orientation: "horizontal" | "vertical" = "vertical";
  set orientation(value: "horizontal" | "vertical") {
    this.#orientation = value;
    this.notify();
  }
  get orientation(): "horizontal" | "vertical" {
    return this.#orientation;
  }

  #isRequired = false;
  set isRequired(value: boolean) {
    this.#isRequired = value;
    this.notify();
  }
  get isRequired(): boolean {
    return this.#isRequired;
  }

  #isDisabled = false;
  set isDisabled(value: boolean) {
    this.#isDisabled = value;
    this.notify();
  }
  get isDisabled(): boolean {
    return this.#isDisabled;
  }

  #errorMessage: string | undefined = undefined;
  set errorMessage(value: string | undefined) {
    this.#errorMessage = value;
    this.notify();
  }
  get errorMessage(): string | undefined {
    return this.#errorMessage;
  }

  #value: string[] = [];
  set value(value: string[]) {
    this.#value = value;
    this.notify();
  }
  get value(): string[] {
    return this.#value;
  }

  constructor(options: {
    key?: string;
    label: string;
    children?: CheckboxModel[];
    orientation?: "horizontal" | "vertical";
    isRequired?: boolean;
    isDisabled?: boolean;
    errorMessage?: string;
    value?: string[];
  }) {
    super({ key: options?.key, children: options?.children });
    this.#label = options.label;
    this.#orientation = options.orientation ?? "vertical";
    this.#isRequired = options.isRequired ?? false;
    this.#isDisabled = options.isDisabled ?? false;
    this.#errorMessage = options.errorMessage;
    this.#value = options.value ?? [];
  }

  setValue(value: string[]): void {
    this.value = value;
  }
}
