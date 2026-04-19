import { Flex, View } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/shared-react/hooks";
import type { ContentPanelView } from "@statewalker/shared-views";
import { RenderModel, RenderSlot } from "../_shared/render-slot.js";

export function ContentPanelRenderer({ model }: { model: ContentPanelView }) {
  useUpdates(model.onUpdate);
  return (
    <Flex direction="column" gap="size-200">
      {model.header && (
        <View>
          <RenderSlot value={model.header} />
        </View>
      )}
      {model.children.map((child) => (
        <RenderModel key={child.key} model={child} />
      ))}
      {model.footer && (
        <View>
          <RenderSlot value={model.footer} />
        </View>
      )}
    </Flex>
  );
}
