import "./index.css";

import type { ReactComponentRegistry } from "@statewalker/shared-react/component-registry";
import {
  AccordionView,
  BreadcrumbView,
  CardView,
  ContextMenuView,
  EmptyView,
  FlexView,
  GridView,
  JsonView,
  PaginationView,
  SheetView,
  TableView,
  TabsView,
  TreeView,
} from "@statewalker/shared-views";
import { JsonRenderer } from "./renderers/data/json.renderer.js";
import { TableRenderer } from "./renderers/data/table.renderer.js";
import { TreeRenderer } from "./renderers/data/tree.renderer.js";
import { EmptyRenderer } from "./renderers/feedback/empty.renderer.js";
import { CardRenderer } from "./renderers/layout/card.renderer.js";
import { FlexRenderer } from "./renderers/layout/flex.renderer.js";
import { GridRenderer } from "./renderers/layout/grid.renderer.js";
import { AccordionRenderer } from "./renderers/navigation/accordion.renderer.js";
import { BreadcrumbRenderer } from "./renderers/navigation/breadcrumb.renderer.js";
import { PaginationRenderer } from "./renderers/navigation/pagination.renderer.js";
import { TabsRenderer } from "./renderers/navigation/tabs.renderer.js";
import { ContextMenuRenderer } from "./renderers/overlays/context-menu.renderer.js";
import { SheetRenderer } from "./renderers/overlays/sheet.renderer.js";

export function initCommonViews(registry: ReactComponentRegistry): () => void {
  const cleanups = [
    // Layout
    registry.register(FlexView, FlexRenderer),
    registry.register(GridView, GridRenderer),
    registry.register(CardView, CardRenderer),

    // Feedback
    registry.register(EmptyView, EmptyRenderer),

    // Navigation
    registry.register(TabsView, TabsRenderer),
    registry.register(AccordionView, AccordionRenderer),
    registry.register(BreadcrumbView, BreadcrumbRenderer),
    registry.register(PaginationView, PaginationRenderer),

    // Overlay
    registry.register(SheetView, SheetRenderer),
    registry.register(ContextMenuView, ContextMenuRenderer),

    // Data Display
    registry.register(TableView, TableRenderer),
    registry.register(TreeView, TreeRenderer),
    registry.register(JsonView, JsonRenderer),
  ];
  return () => {
    for (const cleanup of cleanups) {
      cleanup();
    }
  };
}
