import {
  type DockNode,
  type DockPanel,
  type DockSplit,
  type DockTab,
  type DropPosition,
  isPanel,
  isSplit,
  type PanelManagerView,
} from "@statewalker/shared-views";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

// Re-export dock types/helpers for UI consumers.  Tree operations
// (findAndRemoveTab, addTabToPanel, …) are NOT re-exported — they
// live exclusively in @repo/shared-views and must only be invoked
// via PanelManagerView methods.
export type { DockNode, DockPanel, DockSplit, DockTab, DropPosition };
export { isPanel, isSplit };

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

interface DockProviderProps {
  children: ReactNode;
  panelManager: PanelManagerView;
}

/**
 * DockProvider — thin React adapter over PanelManagerView.
 *
 * Holds ONLY UI-local state: drag-in-progress and drop-confirmation.
 * All tree state and mutations live in PanelManagerView. The React layer
 * must never invoke dock tree operations directly — it reads the tree
 * via getTree() and mutates it via PM methods.
 */
export function DockProvider({ children, panelManager }: DockProviderProps) {
  // Subscribe to the model — re-render whenever PM mutates.
  const subscribe = useCallback(
    (onStoreChange: () => void) => panelManager.onUpdate(onStoreChange),
    [panelManager],
  );
  const getSnapshot = useCallback(() => panelManager.getTree(), [panelManager]);
  const root = useSyncExternalStore(subscribe, getSnapshot);

  // UI-only ephemeral state — NOT persisted in the model.
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [pendingDrop, setPendingDrop] = useState<PendingDrop | null>(null);

  const startDrag = useCallback((tabId: string, sourcePanelId: string) => {
    setDragState({ tabId, sourcePanelId });
  }, []);

  const endDrag = useCallback(() => {
    setDragState(null);
  }, []);

  const setDropTarget = useCallback(
    (_target: { panelId: string; position: DropPosition } | null) => {
      // Currently unused by callers — kept for API compatibility
    },
    [],
  );

  const requestDrop = useCallback(
    (
      targetPanelId: string,
      suggestedPosition: DropPosition,
      dropCoords: { x: number; y: number },
    ) => {
      setDragState((drag) => {
        if (!drag) return null;
        // Ask the model if this drop is valid.  All tree inspection
        // happens in PanelManagerView, not here.
        if (
          !panelManager.canMoveTab(
            drag.sourcePanelId,
            targetPanelId,
            suggestedPosition,
          )
        ) {
          return null;
        }
        setPendingDrop({
          tabId: drag.tabId,
          sourcePanelId: drag.sourcePanelId,
          targetPanelId,
          suggestedPosition,
          dropCoords,
        });
        return null;
      });
    },
    [panelManager],
  );

  const moveTab = useCallback(
    (
      tabId: string,
      sourcePanelId: string,
      targetPanelId: string,
      position: DropPosition,
    ) => {
      panelManager.moveTab(tabId, sourcePanelId, targetPanelId, position);
    },
    [panelManager],
  );

  const confirmDrop = useCallback(
    (position: DropPosition) => {
      setPendingDrop((pd) => {
        if (pd) {
          panelManager.moveTab(
            pd.tabId,
            pd.sourcePanelId,
            pd.targetPanelId,
            position,
          );
        }
        return null;
      });
    },
    [panelManager],
  );

  const cancelDrop = useCallback(() => {
    setPendingDrop(null);
  }, []);

  const closeTab = useCallback(
    (_panelId: string, tabId: string) => {
      const pv = panelManager.getPanel(tabId);
      pv?.onClose?.();
      panelManager.removePanel(tabId);
    },
    [panelManager],
  );

  const setActiveTab = useCallback(
    (panelId: string, tabId: string) => {
      panelManager.setActiveTab(panelId, tabId);
    },
    [panelManager],
  );

  const updateSizes = useCallback(
    (splitId: string, sizes: number[]) => {
      panelManager.updateSplitSizes(splitId, sizes);
    },
    [panelManager],
  );

  const value = useMemo<DockContextType>(
    () => ({
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
      updateSizes,
    }),
    [
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
      updateSizes,
    ],
  );

  return <DockCtx.Provider value={value}>{children}</DockCtx.Provider>;
}
