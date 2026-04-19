import { useUpdates } from "@statewalker/shared-react/hooks";
import type { BadgeView } from "@statewalker/shared-views";

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

export function BadgeRenderer({ model }: { model: BadgeView }) {
  useUpdates(model.onUpdate);

  const variantClass = variantClasses[model.variant] ?? variantClasses.neutral;
  const sizeClass = sizeClasses[model.size] ?? sizeClasses.M;

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${variantClass} ${sizeClass}`}
    >
      {model.label}
    </span>
  );
}
