import { Disclosure, DisclosurePanel, DisclosureTitle, Flex } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/shared-react/hooks";
import type { AccordionView } from "@statewalker/shared-views";
import { RenderModel } from "../_shared/render-slot.js";

export function AccordionRenderer({ model }: { model: AccordionView }) {
  useUpdates(model.onUpdate);
  return (
    <Flex direction="column" gap="size-0">
      {model.items.map((item) => (
        <Disclosure
          key={item.key}
          isExpanded={model.isExpanded(item.key)}
          isDisabled={item.disabled}
          onExpandedChange={() => model.toggle(item.key)}
        >
          <DisclosureTitle>{item.title}</DisclosureTitle>
          <DisclosurePanel>
            <RenderModel model={item.content} />
          </DisclosurePanel>
        </Disclosure>
      ))}
    </Flex>
  );
}
