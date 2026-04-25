import { generateId } from "./tree.js";
import type { DockNode, DockPanel, DockTab } from "./types.js";

export interface PanelDescriptor {
  key: string;
  label: string;
  icon?: string;
  area?: string;
  closable?: boolean;
  content: unknown; // The view model
}

export function panelsToTree(panels: PanelDescriptor[]): DockNode {
  const areas = new Map<string, PanelDescriptor[]>();
  for (const panel of panels) {
    const area = panel.area || "center";
    const list = areas.get(area) ?? [];
    list.push(panel);
    areas.set(area, list);
  }

  function toTab(p: PanelDescriptor): DockTab {
    return {
      id: p.key,
      title: p.label,
      icon: p.icon,
      panelModel: p.content,
      closable: p.closable,
    };
  }

  function areaToPanel(areaKey: string, models: PanelDescriptor[]): DockPanel {
    const tabs = models.map(toTab);
    return {
      id: `area-${areaKey}`,
      tabs,
      activeTabId: tabs[0]?.id ?? null,
    };
  }

  const centerModels = areas.get("center") ?? [];
  const centerPanel = areaToPanel("center", centerModels);

  // If only center panels exist (or no panels at all), return center directly
  if (areas.size <= 1 && (areas.has("center") || areas.size === 0)) {
    return centerPanel;
  }

  let mainNode: DockNode = centerPanel;

  const rightModels = areas.get("right");
  if (rightModels) {
    mainNode = {
      id: generateId(),
      direction: "horizontal",
      children: [mainNode, areaToPanel("right", rightModels)],
      sizes: [70, 30],
    };
  }

  const leftModels = areas.get("left");
  if (leftModels) {
    mainNode = {
      id: generateId(),
      direction: "horizontal",
      children: [areaToPanel("left", leftModels), mainNode],
      sizes: [25, 75],
    };
  }

  const topModels = areas.get("top");
  if (topModels) {
    mainNode = {
      id: generateId(),
      direction: "vertical",
      children: [areaToPanel("top", topModels), mainNode],
      sizes: [30, 70],
    };
  }

  const bottomModels = areas.get("bottom");
  if (bottomModels) {
    mainNode = {
      id: generateId(),
      direction: "vertical",
      children: [mainNode, areaToPanel("bottom", bottomModels)],
      sizes: [70, 30],
    };
  }

  return mainNode;
}
