import { useUpdates } from "@statewalker/workbench-react/hooks";
import { Icon } from "@statewalker/workbench-react/icons";
import type { IconView } from "@statewalker/workbench-views";

const sizeClasses: Record<string, string> = {
  S: "size-3.5",
  M: "size-4",
  L: "size-5",
  XL: "size-6",
};

export function IconRenderer({ model }: { model: IconView }) {
  useUpdates(model.onUpdate);
  const sizeClass = sizeClasses[model.size] ?? sizeClasses.M;
  return <Icon name={model.name} className={sizeClass} aria-label={model.label} />;
}
