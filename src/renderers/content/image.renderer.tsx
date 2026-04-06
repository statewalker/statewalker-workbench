import { useUpdates } from "@repo/shared-react/hooks";
import type { ImageView } from "@repo/shared-views";

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
