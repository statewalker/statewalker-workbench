/**
 * Spectrum dock context — reuses shared dock tree logic,
 * provides DockProvider and panelsToTreeFromViews.
 * Identical to shadcn dock-context but without any UI dependencies.
 */
import {
  panelsToTree as _panelsToTree,
  addTabToPanel,
  type DockNode,
  type DockPanel,
  type DockTab,
  type DropPosition,
  findAndRemoveTab,
  findPanel,
  updatePanelActiveTab,
  updateSplitSizes,
} from "@statewalker/workbench-react/dock";
import type { DockPanelView } from "@statewalker/workbench-views";
import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react";

export type { DockNode, DockPanel, DockTab, DropPosition };
export type { DockSplit } from "@statewalker/workbench-react/dock";
export { isPanel, isSplit } from "@statewalker/workbench-react/dock";

interface DragState {
  tabId: string;
  sourcePanelId: string;
}

interface PendingDrop {
  tabId: string;
  sourcePanelId: string;
  targetPanelId: string;
  suggestedPosition: DropPosition;
  dropCoords: { x: number; y: number };
}

interface DockContextType {
  root: DockNode;
  dragState: DragState | null;
  pendingDrop: PendingDrop | null;
  startDrag: (tabId: string, sourcePanelId: string) => void;
  endDrag: () => void;
  requestDrop: (
    targetPanelId: string,
    suggestedPosition: DropPosition,
    dropCoords: { x: number; y: number },
  ) => void;
  confirmDrop: (position: DropPosition) => void;
  cancelDrop: () => void;
  moveTab: (
    tabId: string,
    sourcePanelId: string,
    targetPanelId: string,
    position: DropPosition,
  ) => void;
  closeTab: (panelId: string, tabId: string) => void;
  setActiveTab: (panelId: string, tabId: string) => void;
  updateSizes: (splitId: string, sizes: number[]) => void;
}

const DockCtx = createContext<DockContextType | null>(null);

export function useDockLayout() {
  const ctx = useContext(DockCtx);
  if (!ctx) throw new Error("useDockLayout must be used within DockProvider");
  return ctx;
}

export function panelsToTreeFromViews(panels: DockPanelView[]): DockNode {
  return _panelsToTree(
    panels.map((p) => ({
      key: p.key,
      label: p.label,
      icon: p.icon,
      area: p.area,
      closable: p.closable,
      content: p,
    })),
  );
}

export function DockProvider({
  children,
  initialLayout,
}: {
  children: ReactNode;
  initialLayout: DockNode;
}) {
  const [root, setRoot] = useState<DockNode>(initialLayout);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [pendingDrop, setPendingDrop] = useState<PendingDrop | null>(null);

  useEffect(() => setRoot(initialLayout), [initialLayout]);

  const startDrag = useCallback(
    (tabId: string, sourcePanelId: string) => setDragState({ tabId, sourcePanelId }),
    [],
  );
  const endDrag = useCallback(() => setDragState(null), []);

  const requestDrop = useCallback(
    (
      targetPanelId: string,
      suggestedPosition: DropPosition,
      dropCoords: { x: number; y: number },
    ) => {
      const drag = dragState;
      setDragState(null);
      if (!drag) return;
      if (drag.sourcePanelId === targetPanelId) {
        const panel = findPanel(root, drag.sourcePanelId);
        if (!panel || panel.tabs.length <= 1) return;
      }
      setPendingDrop({
        tabId: drag.tabId,
        sourcePanelId: drag.sourcePanelId,
        targetPanelId,
        suggestedPosition,
        dropCoords,
      });
    },
    [dragState, root],
  );

  const moveTab = useCallback(
    (tabId: string, sourcePanelId: string, targetPanelId: string, position: DropPosition) => {
      setRoot((cur) => {
        if (sourcePanelId === targetPanelId && position === "center") return cur;
        if (sourcePanelId === targetPanelId && position !== "center") {
          const panel = findPanel(cur, sourcePanelId);
          if (panel && panel.tabs.length <= 1) return cur;
        }
        const { node, tab } = findAndRemoveTab(cur, sourcePanelId, tabId);
        if (!tab || !node) return cur;
        return addTabToPanel(node, targetPanelId, tab, position);
      });
    },
    [],
  );

  const confirmDrop = useCallback(
    (position: DropPosition) => {
      if (pendingDrop) {
        moveTab(pendingDrop.tabId, pendingDrop.sourcePanelId, pendingDrop.targetPanelId, position);
        setPendingDrop(null);
      }
    },
    [pendingDrop, moveTab],
  );

  const cancelDrop = useCallback(() => setPendingDrop(null), []);

  const closeTab = useCallback((panelId: string, tabId: string) => {
    setRoot((cur) => {
      const { node } = findAndRemoveTab(cur, panelId, tabId);
      return node || cur;
    });
  }, []);

  const setActiveTab = useCallback((panelId: string, tabId: string) => {
    setRoot((cur) => updatePanelActiveTab(cur, panelId, tabId));
  }, []);

  const handleUpdateSizes = useCallback((splitId: string, sizes: number[]) => {
    setRoot((cur) => updateSplitSizes(cur, splitId, sizes));
  }, []);

  return (
    <DockCtx.Provider
      value={{
        root,
        dragState,
        pendingDrop,
        startDrag,
        endDrag,
        requestDrop,
        confirmDrop,
        cancelDrop,
        moveTab,
        closeTab,
        setActiveTab,
        updateSizes: handleUpdateSizes,
      }}
    >
      {children}
    </DockCtx.Provider>
  );
}
