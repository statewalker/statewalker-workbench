import { useUpdates } from "@repo/shared-react/hooks";
import type { ToastView } from "@repo/shared-views";
import { ActionButton } from "../actions/action-button.renderer.js";

const variantClasses: Record<string, string> = {
  positive: "border-green-500",
  negative: "border-red-500",
  info: "border-blue-500",
  neutral: "border-border",
};

export function ToastRenderer({ model }: { model: ToastView }) {
  useUpdates(model.onUpdate);

  const variantClass = variantClasses[model.variant] ?? variantClasses.neutral;

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border bg-card p-4 shadow-lg ${variantClass}`}
      role="alert"
    >
      <span className="text-sm flex-1">{model.message}</span>
      {model.action && <ActionButton action={model.action} />}
    </div>
  );
}
