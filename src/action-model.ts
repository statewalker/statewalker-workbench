import { Action, type ActionVariant } from "@repo/shared/models";

export interface ActionConfig {
  key: string;
  label: string;
  icon?: string;
  tooltip?: string;
  active?: boolean;
  variant?: ActionVariant;
  execute?: () => void;
  children?: ActionConfig[];
}

export class ActionModel extends Action<void> {
  tooltip?: string;
  children: ActionModel[];

  constructor(config: ActionConfig) {
    super(config.key, {
      label: config.label,
      icon: config.icon,
      active: config.active,
      variant: config.variant,
    });
    this.tooltip = config.tooltip;
    this.children = (config.children ?? []).map(
      (child) => new ActionModel(child),
    );
    if (config.execute) {
      this.onSubmit(config.execute);
    }
  }

  getChild(key: string): ActionModel | undefined {
    return this.children.find((c) => c.actionKey === key);
  }
}
