import { ViewModel } from "../core/view-model.js";

export type AlertVariant =
  | "default"
  | "destructive"
  | "info"
  | "warning"
  | "success";

export class AlertModel extends ViewModel {
  variant: AlertVariant;
  title: string;
  description: string | ViewModel | undefined;
  icon: string | undefined;

  constructor(options: {
    variant?: AlertVariant;
    title: string;
    description?: string | ViewModel;
    icon?: string;
    key?: string;
  }) {
    super({ key: options.key });
    this.variant = options.variant ?? "default";
    this.title = options.title;
    this.description = options.description;
    this.icon = options.icon;
  }

  setTitle(title: string) {
    this.title = title;
    this.notify();
  }

  setDescription(description: string | ViewModel | undefined) {
    this.description = description;
    this.notify();
  }

  setVariant(variant: AlertVariant) {
    this.variant = variant;
    this.notify();
  }
}
