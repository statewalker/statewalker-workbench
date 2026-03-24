import { type Action, onChange } from "@repo/shared/models";
import { ViewModel } from "./view-model.js";

export type FieldType =
  | "text"
  | "number"
  | "textarea"
  | "checkbox"
  | "switch"
  | "select"
  | "combobox"
  | "radio"
  | "slider"
  | "date"
  | "toggle"
  | "toggle-group";

export type MessageSeverity = "error" | "warning" | "info";

export interface FieldMessage {
  text: string;
  severity: MessageSeverity;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface FieldConfig {
  key: string;
  label: string;
  type?: FieldType;
  placeholder?: string;
  required?: boolean;
  group?: string;
  options?: SelectOption[];
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

export class FormModel extends ViewModel {
  fields: FieldConfig[];
  values: Record<string, string | number | boolean>;
  messages: Record<string, FieldMessage>;
  actions: Action<void>[];

  #valuesVersion = 0;

  constructor(options: {
    fields: FieldConfig[];
    actions: Action<void>[];
    key?: string;
  }) {
    super({ key: options.key });
    this.fields = options.fields;
    this.values = {};
    this.messages = {};
    this.actions = options.actions;
  }

  setValue(fieldKey: string, value: string | number | boolean) {
    this.values = { ...this.values, [fieldKey]: value };
    this.#valuesVersion++;
    this.notify();
  }

  getValue(fieldKey: string): string | number | boolean | undefined {
    return this.values[fieldKey];
  }

  getValues(): Record<string, string | number | boolean> {
    return { ...this.values };
  }

  setMessage(fieldKey: string, message: FieldMessage | undefined) {
    if (message) {
      this.messages = { ...this.messages, [fieldKey]: message };
    } else {
      const { [fieldKey]: _, ...rest } = this.messages;
      this.messages = rest;
    }
    this.notify();
  }

  setMessages(messages: Record<string, FieldMessage>) {
    this.messages = messages;
    this.notify();
  }

  getMessage(fieldKey: string): FieldMessage | undefined {
    return this.messages[fieldKey];
  }

  hasErrors(): boolean {
    return Object.values(this.messages).some((m) => m.severity === "error");
  }

  reset() {
    this.values = {};
    this.messages = {};
    this.#valuesVersion++;
    this.notify();
  }

  getFieldsByGroup(): Map<string | undefined, FieldConfig[]> {
    const groups = new Map<string | undefined, FieldConfig[]>();
    for (const field of this.fields) {
      const group = field.group;
      const list = groups.get(group);
      if (list) {
        list.push(field);
      } else {
        groups.set(group, [field]);
      }
    }
    return groups;
  }

  onFieldsUpdate(cb: () => void): () => void {
    return onChange(
      (cb) => this.onUpdate(cb),
      cb,
      () => this.#valuesVersion,
    );
  }
}
