import { ViewModel } from "../core/index.js";

export type RadioOption = {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
};

export class RadioGroupView extends ViewModel {
  #label: string;
  set label(value: string) {
    this.#label = value;
    this.notify();
  }
  get label(): string {
    return this.#label;
  }

  #options: RadioOption[] = [];
  set options(value: RadioOption[]) {
    this.#options = value;
    this.notify();
  }
  get options(): RadioOption[] {
    return this.#options;
  }

  #value: string | undefined = undefined;
  set value(value: string | undefined) {
    this.#value = value;
    this.notify();
  }
  get value(): string | undefined {
    return this.#value;
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

  #isReadOnly = false;
  set isReadOnly(value: boolean) {
    this.#isReadOnly = value;
    this.notify();
  }
  get isReadOnly(): boolean {
    return this.#isReadOnly;
  }

  #errorMessage: string | undefined = undefined;
  set errorMessage(value: string | undefined) {
    this.#errorMessage = value;
    this.notify();
  }
  get errorMessage(): string | undefined {
    return this.#errorMessage;
  }

  constructor(options: {
    key?: string;
    label: string;
    options?: RadioOption[];
    value?: string;
    orientation?: "horizontal" | "vertical";
    isRequired?: boolean;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    errorMessage?: string;
  }) {
    super({ key: options?.key });
    this.#label = options.label;
    this.#options = options.options ?? [];
    this.#value = options.value;
    this.#orientation = options.orientation ?? "vertical";
    this.#isRequired = options.isRequired ?? false;
    this.#isDisabled = options.isDisabled ?? false;
    this.#isReadOnly = options.isReadOnly ?? false;
    this.#errorMessage = options.errorMessage;
  }

  setValue(value: string | undefined): void {
    this.value = value;
  }
}
