import {
  Disclosure,
  DisclosurePanel,
  DisclosureTitle,
} from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/shared-react/hooks";
import type { CollapsibleView } from "@statewalker/shared-views";
import { RenderModel } from "../_shared/render-slot.js";

export function CollapsibleRenderer({ model }: { model: CollapsibleView }) {
  useUpdates(model.onUpdate);
  return (
    <Disclosure
      isExpanded={model.isOpen}
      onExpandedChange={() => model.toggle()}
    >
      <DisclosureTitle>{model.trigger.label}</DisclosureTitle>
      <DisclosurePanel>
        {model.children.map((child) => (
          <RenderModel key={child.key} model={child} />
        ))}
      </DisclosurePanel>
    </Disclosure>
  );
}
