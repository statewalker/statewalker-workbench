import { Item, TabList, TabPanels, Tabs } from "@adobe/react-spectrum";
import { useUpdates } from "@repo/shared-react/hooks";
import type { TabsView } from "@repo/shared-views";
import { RenderModel } from "../_shared/render-slot.js";

export function TabsRenderer({ model }: { model: TabsView }) {
  useUpdates(model.onUpdate);
  return (
    <Tabs
      selectedKey={model.selectedKey}
      orientation={model.orientation}
      density={model.density}
      isQuiet={model.isQuiet}
      isEmphasized={model.isEmphasized}
      onSelectionChange={(key) => model.setSelectedKey(String(key))}
    >
      <TabList>
        {model.tabs.map((tab) => (
          <Item key={tab.key}>{tab.label}</Item>
        ))}
      </TabList>
      <TabPanels>
        {model.tabs.map((tab) => (
          <Item key={tab.key}>
            <RenderModel model={tab.content} />
          </Item>
        ))}
      </TabPanels>
    </Tabs>
  );
}
