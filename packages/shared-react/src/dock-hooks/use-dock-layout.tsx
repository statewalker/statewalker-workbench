import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { DockNode, DropPosition } from "../dock/index.js";
import {
  addTabToPanel,
  findAndRemoveTab,
  findPanel,
  updatePanelActiveTab,
  updateSplitSizes,
} from "../dock/tree.js";

export interface DragState {
  tabId: string;
  sourcePanelId: string;
}

export interface PendingDrop {
  tabId: string;
  sourcePanelId: string;
  targetPanelId: string;
  suggestedPosition: DropPosition;
  dropCoords: { x: number; y: number };
}

export interface DockContextType {
  root: DockNode;
  dragState: DragState | null;
  pendingDrop: PendingDrop | null;
  startDrag: (tabId: string, sourcePanelId: string) => void;
  endDrag: () => void;
  setDropTarget: (
    target: { panelId: string; position: DropPosition } | null,
  ) => void;
  /** Controller method: validates the drop and shows confirmation or cancels. */
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

export function useDockLayout(): DockContextType {
  const context = useContext(DockCtx);
  if (!context) {
    throw new Error("useDockLayout must be used within a DockProvider");
  }
  return context;
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

  // Update layout when initialLayout changes (panels added/removed)
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

      // Model check: can this tab be split-dropped onto the target?
      if (drag.sourcePanelId === targetPanelId) {
        const panel = findPanel(root, drag.sourcePanelId);
        if (!panel || panel.tabs.length <= 1) {
          return; // Cancel — single-tab self-drop
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

        // Self-drop split on a single-tab panel would lose the tab
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
    setRoot((currentRoot) => {
      const { node } = findAndRemoveTab(currentRoot, panelId, tabId);
      return node || currentRoot;
    });
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
