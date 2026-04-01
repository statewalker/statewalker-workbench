import { Avatar } from "@adobe/react-spectrum";
import { useUpdates } from "@repo/shared-react/hooks";
import type { AvatarView } from "@repo/shared-views";

export function AvatarRenderer({ model }: { model: AvatarView }) {
  useUpdates(model.onUpdate);
  return (
    <Avatar
      src={model.src}
      alt={model.alt}
      size={model.size}
      isDisabled={model.isDisabled}
    />
  );
}
