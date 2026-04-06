export { AppShell, getComponentRegistry } from "./app-shell.js";
export { initViews as initShadcnViews } from "../init-views.js";
export type {
  DockNode,
  DockPanel,
  DockSplit,
  DockTab,
  DropPosition,
} from "./dock-context.js";
export { DockProvider, panelsToTree, useDockLayout } from "./dock-context.js";
export { DockLayout } from "./dock-layout.js";
export { DropConfirmationGrid } from "./drop-confirmation-grid.js";
export { useModelItems } from "./use-model-items.js";
export type { PanelDndOptions, PanelDndState } from "./use-panel-dnd.js";
export { usePanelDnd } from "./use-panel-dnd.js";
