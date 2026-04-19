import { useUpdates } from "@statewalker/shared-react/hooks";
import type { StatusLightView } from "@statewalker/shared-views";

const variantColors: Record<string, string> = {
  positive: "bg-green-500",
  negative: "bg-red-500",
  notice: "bg-yellow-500",
  info: "bg-blue-500",
  neutral: "bg-gray-400",
  celery: "bg-lime-500",
  chartreuse: "bg-lime-400",
  yellow: "bg-yellow-400",
  magenta: "bg-pink-500",
  fuchsia: "bg-fuchsia-500",
  purple: "bg-purple-500",
  indigo: "bg-indigo-500",
  seafoam: "bg-teal-400",
};

const sizeMap = {
  S: "w-2 h-2",
  M: "w-2.5 h-2.5",
  L: "w-3 h-3",
};

export function StatusLightRenderer({ model }: { model: StatusLightView }) {
  useUpdates(model.onUpdate);

  const dotColor = variantColors[model.variant] ?? "bg-gray-400";
  const dotSize = sizeMap[model.size] ?? sizeMap.M;

  return (
    <div className="inline-flex items-center gap-2">
      <span className={`${dotSize} rounded-full ${dotColor} flex-shrink-0`} />
      <span className="text-sm">{model.label}</span>
    </div>
  );
}
