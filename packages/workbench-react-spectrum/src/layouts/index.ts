export { initSpectrumViews } from "../init-views.js";
export {
  getComponentRegistry,
  SpectrumAppShell,
  useActivePanelView,
  useColorScheme,
  usePanelManagerView,
} from "./app-shell.js";
export type {
  DockNode,
  DockPanel,
  DockTab,
  DropPosition,
} from "./dock-context.js";
export { DockProvider, useDockLayout } from "./dock-context.js";
export { SpectrumDockLayout } from "./dock-layout.js";
export { SpectrumDockPanel } from "./dock-panel.js";
