import { Image } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { ImageView } from "@statewalker/workbench-views";

export function ImageRenderer({ model }: { model: ImageView }) {
  useUpdates(model.onUpdate);
  return (
    <Image
      src={model.src}
      alt={model.alt}
      objectFit={model.objectFit}
      width={model.width}
      height={model.height}
    />
  );
}
