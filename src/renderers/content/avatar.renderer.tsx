import { useUpdates } from "@repo/shared-react/hooks";
import type { AvatarView } from "@repo/shared-views";

const sizeMap: Record<string, string> = {
  "50": "w-6 h-6",
  "75": "w-8 h-8",
  "100": "w-10 h-10",
  "200": "w-14 h-14",
  "300": "w-18 h-18",
  "400": "w-22 h-22",
  "500": "w-26 h-26",
  "600": "w-30 h-30",
  "700": "w-36 h-36",
};

export function AvatarRenderer({ model }: { model: AvatarView }) {
  useUpdates(model.onUpdate);

  return (
    <img
      src={model.src}
      alt={model.alt}
      className={`rounded-full object-cover ${sizeMap[model.size] ?? "w-10 h-10"} ${model.isDisabled ? "opacity-50" : ""}`}
    />
  );
}
