import { Flex, Heading, View } from "@adobe/react-spectrum";
import { useUpdates } from "@repo/shared-react/hooks";
import type { CardView } from "@repo/shared-views";
import { RenderModel, RenderSlot } from "../_shared/render-slot.js";

export function CardRenderer({ model }: { model: CardView }) {
  useUpdates(model.onUpdate);
  return (
    <View
      borderWidth="thin"
      borderColor="dark"
      borderRadius="medium"
      padding="size-200"
    >
      {model.preview && (
        <View marginBottom="size-200">
          <RenderModel model={model.preview} />
        </View>
      )}
      {model.header && (
        <Heading level={3}>
          <RenderSlot value={model.header} />
        </Heading>
      )}
      <Flex direction="column" gap="size-100">
        {model.children.map((child) => (
          <RenderModel key={child.key} model={child} />
        ))}
      </Flex>
      {model.footer && (
        <View marginTop="size-200">
          <RenderSlot value={model.footer} />
        </View>
      )}
    </View>
  );
}
