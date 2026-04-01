import { Flex } from "@adobe/react-spectrum";
import { useUpdates } from "@repo/shared-react/hooks";
import type { FlexView } from "@repo/shared-views";
import { RenderModel } from "../_shared/render-slot.js";

export function FlexRenderer({ model }: { model: FlexView }) {
  useUpdates(model.onUpdate);
  return (
    <Flex
      direction={model.direction}
      gap={model.gap}
      wrap={model.wrap}
      alignItems={model.alignItems}
      justifyContent={model.justifyContent}
    >
      {model.children.map((child) => (
        <RenderModel key={child.key} model={child} />
      ))}
    </Flex>
  );
}
