import { useUpdates } from "@statewalker/workbench-react/hooks";
import { Icon } from "@statewalker/workbench-react/icons";
import type { BadgeView } from "@statewalker/workbench-views";

const variantClasses: Record<string, string> = {
  positive: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  negative: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  neutral: "bg-secondary text-secondary-foreground",
  informative: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
};

const sizeClasses: Record<string, string> = {
  S: "text-xs px-1.5 py-0.5",
  M: "text-xs px-2.5 py-0.5",
  L: "text-sm px-3 py-1",
};

const iconSizeClasses: Record<string, string> = {
  S: "size-3 mr-0.5",
  M: "size-3.5 mr-1",
  L: "size-4 mr-1",
};

export function BadgeRenderer({ model }: { model: BadgeView }) {
  useUpdates(model.onUpdate);

  const variantClass = variantClasses[model.variant] ?? variantClasses.neutral;
  const sizeClass = sizeClasses[model.size] ?? sizeClasses.M;
  const iconSizeClass = iconSizeClasses[model.size] ?? iconSizeClasses.M;

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${variantClass} ${sizeClass}`}
    >
      {model.icon && <Icon name={model.icon} className={iconSizeClass} />}
      {model.label}
    </span>
  );
}
