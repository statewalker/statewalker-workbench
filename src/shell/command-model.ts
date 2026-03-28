import { ViewModel } from "../core/view-model.js";

export class CommandModel extends ViewModel {
  label: string;
  icon: string | undefined;
  keybinding: string | undefined;
  execute: () => void;
  isEnabled: () => boolean;

  constructor(options: {
    key: string;
    label: string;
    icon?: string;
    keybinding?: string;
    execute: () => void;
    isEnabled?: () => boolean;
  }) {
    super({ key: options.key });
    this.label = options.label;
    this.icon = options.icon;
    this.keybinding = options.keybinding;
    this.execute = options.execute;
    this.isEnabled = options.isEnabled ?? (() => true);
  }
}
