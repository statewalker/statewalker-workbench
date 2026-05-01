import { useUpdates } from "@statewalker/workbench-react/hooks";
import { Icon } from "@statewalker/workbench-react/icons";
import type { IconView } from "@statewalker/workbench-views";

const sizeClasses: Record<string, string> = {
  S: "w-[14px] h-[14px]",
  M: "w-[16px] h-[16px]",
  L: "w-[20px] h-[20px]",
  XL: "w-[24px] h-[24px]",
};

export function IconRenderer({ model }: { model: IconView }) {
  useUpdates(model.onUpdate);
  const sizeClass = sizeClasses[model.size] ?? sizeClasses.M;
  return <Icon name={model.name} className={sizeClass} aria-label={model.label} />;
}
