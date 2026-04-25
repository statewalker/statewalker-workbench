import { Avatar } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { AvatarView } from "@statewalker/workbench-views";

export function AvatarRenderer({ model }: { model: AvatarView }) {
  useUpdates(model.onUpdate);
  return <Avatar src={model.src} alt={model.alt} size={model.size} isDisabled={model.isDisabled} />;
}
