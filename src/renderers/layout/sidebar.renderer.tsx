import { Flex, View } from "@adobe/react-spectrum";
import { useUpdates } from "@repo/shared-react/hooks";
import type { SidebarView } from "@repo/shared-views";
import { RenderModel } from "../_shared/render-slot.js";

export function SidebarRenderer({ model }: { model: SidebarView }) {
  useUpdates(model.onUpdate);
  const width = model.isOpen ? model.expandedWidth : model.collapsedWidth;
  return (
    <Flex direction={model.side === "right" ? "row-reverse" : "row"}>
      <View
        UNSAFE_style={{
          width,
          transition: "width 0.2s ease",
          overflow: "hidden",
        }}
      >
        {model.children.map((child) => (
          <RenderModel key={child.key} model={child} />
        ))}
      </View>
    </Flex>
  );
}
