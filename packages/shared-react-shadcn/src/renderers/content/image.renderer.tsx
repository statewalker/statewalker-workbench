import { useUpdates } from "@statewalker/shared-react/hooks";
import type { ImageView } from "@statewalker/shared-views";

export function ImageRenderer({ model }: { model: ImageView }) {
  useUpdates(model.onUpdate);

  return (
    <img
      src={model.src}
      alt={model.alt}
      style={{
        objectFit: model.objectFit,
        width: model.width,
        height: model.height,
      }}
    />
  );
}
