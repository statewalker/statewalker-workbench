import { ViewModel } from "../view-model.js";

export class ProgressModel extends ViewModel {
  value: number;
  max: number;
  label: string | undefined;
  indeterminate: boolean;

  constructor(options: {
    value?: number;
    max?: number;
    label?: string;
    indeterminate?: boolean;
    key?: string;
  }) {
    super({ key: options.key });
    this.value = options.value ?? 0;
    this.max = options.max ?? 100;
    this.label = options.label;
    this.indeterminate = options.indeterminate ?? false;
  }

  setValue(value: number) {
    this.value = Math.min(Math.max(0, value), this.max);
    this.indeterminate = false;
    this.notify();
  }

  setIndeterminate(indeterminate: boolean) {
    this.indeterminate = indeterminate;
    this.notify();
  }

  get percentage(): number {
    return this.max > 0 ? (this.value / this.max) * 100 : 0;
  }
}
