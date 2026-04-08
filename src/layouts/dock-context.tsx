import {
  addTabToPanel,
  type DockNode,
  type DockPanel,
  type DockTab,
  type DropPosition,
  findAndRemoveTab,
  findPanel,
  updatePanelActiveTab,
  updateSplitSizes,
} from "@repo/shared-react/dock";
import type { DockPanelView } from "@repo/shared-views";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// Re-export types for consumers that import from this file
export type { DockNode, DockPanel, DockTab, DropPosition };
export type { DockSplit } from "@repo/shared-react/dock";
export { isPanel, isSplit } from "@repo/shared-react/dock";

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
  setDropTarget: (
    target: { panelId: string; position: DropPosition } | null,
  ) => void;
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
  const context = useContext(DockCtx);
  if (!context) {
    throw new Error("useDockLayout must be used within a DockProvider");
  }
  return context;
}

/**
 * Convert a flat list of DockPanelViews (with area hints) into a DockNode tree.
 * Re-exported from @repo/shared-react/dock with DockPanelView typing.
 */
export { panelsToTree } from "@repo/shared-react/dock";

// Adapter: convert DockPanelView[] to PanelDescriptor[] for panelsToTree
import { panelsToTree as _panelsToTree } from "@repo/shared-react/dock";

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

interface DockProviderProps {
  children: ReactNode;
  initialLayout: DockNode;
}

export function DockProvider({ children, initialLayout }: DockProviderProps) {
  const [root, setRoot] = useState<DockNode>(initialLayout);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [, setDropTargetState] = useState<{
    panelId: string;
    position: DropPosition;
  } | null>(null);
  const [pendingDrop, setPendingDropState] = useState<PendingDrop | null>(null);

  useEffect(() => {
    setRoot(initialLayout);
  }, [initialLayout]);

  const startDrag = useCallback((tabId: string, sourcePanelId: string) => {
    setDragState({ tabId, sourcePanelId });
  }, []);

  const endDrag = useCallback(() => {
    setDragState(null);
    setDropTargetState(null);
  }, []);

  const setDropTarget = useCallback(
    (target: { panelId: string; position: DropPosition } | null) => {
      setDropTargetState(target);
    },
    [],
  );

  const requestDrop = useCallback(
    (
      targetPanelId: string,
      suggestedPosition: DropPosition,
      dropCoords: { x: number; y: number },
    ) => {
      const drag = dragState;
      setDragState(null);
      setDropTargetState(null);

      if (!drag) return;

      if (drag.sourcePanelId === targetPanelId) {
        const panel = findPanel(root, drag.sourcePanelId);
        if (!panel || panel.tabs.length <= 1) {
          return;
        }
      }

      setPendingDropState({
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
    (
      tabId: string,
      sourcePanelId: string,
      targetPanelId: string,
      position: DropPosition,
    ) => {
      setRoot((currentRoot) => {
        if (sourcePanelId === targetPanelId && position === "center") {
          return currentRoot;
        }

        if (sourcePanelId === targetPanelId && position !== "center") {
          const panel = findPanel(currentRoot, sourcePanelId);
          if (panel && panel.tabs.length <= 1) {
            return currentRoot;
          }
        }

        const { node: nodeAfterRemoval, tab } = findAndRemoveTab(
          currentRoot,
          sourcePanelId,
          tabId,
        );

        if (!tab || !nodeAfterRemoval) {
          return currentRoot;
        }

        return addTabToPanel(nodeAfterRemoval, targetPanelId, tab, position);
      });
    },
    [],
  );

  const confirmDrop = useCallback(
    (position: DropPosition) => {
      if (pendingDrop) {
        moveTab(
          pendingDrop.tabId,
          pendingDrop.sourcePanelId,
          pendingDrop.targetPanelId,
          position,
        );
        setPendingDropState(null);
      }
    },
    [pendingDrop, moveTab],
  );

  const cancelDrop = useCallback(() => {
    setPendingDropState(null);
  }, []);

  const closeTab = useCallback((panelId: string, tabId: string) => {
    let closedTab: { panelModel: unknown } | null = null;
    setRoot((currentRoot) => {
      const { node, tab } = findAndRemoveTab(currentRoot, panelId, tabId);
      closedTab = tab;
      return node || currentRoot;
    });
    // Notify after setRoot completes — avoids state updates inside the updater
    if (closedTab) {
      const model = closedTab.panelModel as
        | { onClose?: () => void }
        | undefined;
      model?.onClose?.();
    }
  }, []);

  const setActiveTab = useCallback((panelId: string, tabId: string) => {
    setRoot((currentRoot) => updatePanelActiveTab(currentRoot, panelId, tabId));
  }, []);

  const handleUpdateSizes = useCallback((splitId: string, sizes: number[]) => {
    setRoot((currentRoot) => updateSplitSizes(currentRoot, splitId, sizes));
  }, []);

  return (
    <DockCtx.Provider
      value={{
        root,
        dragState,
        pendingDrop,
        startDrag,
        endDrag,
        setDropTarget,
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
