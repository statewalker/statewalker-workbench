import { ViewModel } from "../core/index.js";

export class TextAreaModel extends ViewModel {
  #label: string | undefined = undefined;
  set label(value: string | undefined) {
    this.#label = value;
    this.notify();
  }
  get label(): string | undefined {
    return this.#label;
  }

  #value = "";
  set value(value: string) {
    this.#value = value;
    this.notify();
  }
  get value(): string {
    return this.#value;
  }

  #placeholder: string | undefined = undefined;
  set placeholder(value: string | undefined) {
    this.#placeholder = value;
    this.notify();
  }
  get placeholder(): string | undefined {
    return this.#placeholder;
  }

  #description: string | undefined = undefined;
  set description(value: string | undefined) {
    this.#description = value;
    this.notify();
  }
  get description(): string | undefined {
    return this.#description;
  }

  #errorMessage: string | undefined = undefined;
  set errorMessage(value: string | undefined) {
    this.#errorMessage = value;
    this.notify();
  }
  get errorMessage(): string | undefined {
    return this.#errorMessage;
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

  #isQuiet = false;
  set isQuiet(value: boolean) {
    this.#isQuiet = value;
    this.notify();
  }
  get isQuiet(): boolean {
    return this.#isQuiet;
  }

  #maxLength: number | undefined = undefined;
  set maxLength(value: number | undefined) {
    this.#maxLength = value;
    this.notify();
  }
  get maxLength(): number | undefined {
    return this.#maxLength;
  }

  #labelPosition: "top" | "side" = "top";
  set labelPosition(value: "top" | "side") {
    this.#labelPosition = value;
    this.notify();
  }
  get labelPosition(): "top" | "side" {
    return this.#labelPosition;
  }

  constructor(options?: {
    key?: string;
    label?: string;
    value?: string;
    placeholder?: string;
    description?: string;
    errorMessage?: string;
    isRequired?: boolean;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    isQuiet?: boolean;
    maxLength?: number;
    labelPosition?: "top" | "side";
  }) {
    super({ key: options?.key });
    this.#label = options?.label;
    this.#value = options?.value ?? "";
    this.#placeholder = options?.placeholder;
    this.#description = options?.description;
    this.#errorMessage = options?.errorMessage;
    this.#isRequired = options?.isRequired ?? false;
    this.#isDisabled = options?.isDisabled ?? false;
    this.#isReadOnly = options?.isReadOnly ?? false;
    this.#isQuiet = options?.isQuiet ?? false;
    this.#maxLength = options?.maxLength;
    this.#labelPosition = options?.labelPosition ?? "top";
  }

  setValue(value: string): void {
    this.value = value;
  }
}
