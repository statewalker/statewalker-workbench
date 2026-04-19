import { Flex } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/shared-react/hooks";
import type { FlexView } from "@statewalker/shared-views";
import { RenderModel } from "../_shared/render-slot.js";

export function FlexRenderer({ model }: { model: FlexView }) {
  useUpdates(model.onUpdate);
  return (
    <Flex
      direction={model.direction}
      gap={model.gap}
      wrap={model.wrap}
      alignItems={
        model.alignItems as
          | "start"
          | "center"
          | "end"
          | "stretch"
          | "baseline"
          | "self-start"
          | "self-end"
          | undefined
      }
      justifyContent={
        model.justifyContent as
          | "start"
          | "center"
          | "end"
          | "space-between"
          | "space-around"
          | "space-evenly"
          | "left"
          | "right"
          | undefined
      }
    >
      {model.children.map((child) => (
        <RenderModel key={child.key} model={child} />
      ))}
    </Flex>
  );
}
