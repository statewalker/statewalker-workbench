/**
 * Spectrum dock context — thin React adapter over `PanelManagerView`.
 * Mirrors the shadcn dock-context: holds only UI-local state
 * (drag-in-progress + drop-confirmation); reads the dock tree via
 * `panelManager.getTree()` and forwards every mutation to the
 * PanelManagerView methods. The tree is never mutated locally.
 */
import {
  type DockNode,
  type DockPanel,
  type DockSplit,
  type DockTab,
  type DropPosition,
  isPanel,
  isSplit,
  type PanelManagerView,
} from "@statewalker/workbench-views";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

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

export function DockProvider({
  children,
  panelManager,
}: {
  children: ReactNode;
  panelManager: PanelManagerView;
}) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => panelManager.onUpdate(onStoreChange),
    [panelManager],
  );
  const getSnapshot = useCallback(() => panelManager.getTree(), [panelManager]);
  const root = useSyncExternalStore(subscribe, getSnapshot);

  const [dragState, setDragState] = useState<DragState | null>(null);
  const [pendingDrop, setPendingDrop] = useState<PendingDrop | null>(null);

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
      setDragState((drag) => {
        if (!drag) return null;
        if (!panelManager.canMoveTab(drag.sourcePanelId, targetPanelId, suggestedPosition)) {
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
    (tabId: string, sourcePanelId: string, targetPanelId: string, position: DropPosition) =>
      panelManager.moveTab(tabId, sourcePanelId, targetPanelId, position),
    [panelManager],
  );

  const confirmDrop = useCallback(
    (position: DropPosition) => {
      setPendingDrop((pd) => {
        if (pd) {
          panelManager.moveTab(pd.tabId, pd.sourcePanelId, pd.targetPanelId, position);
        }
        return null;
      });
    },
    [panelManager],
  );

  const cancelDrop = useCallback(() => setPendingDrop(null), []);

  const closeTab = useCallback(
    (_panelId: string, tabId: string) => {
      const pv = panelManager.getPanel(tabId);
      pv?.onClose?.();
      panelManager.removePanel(tabId);
    },
    [panelManager],
  );

  const setActiveTab = useCallback(
    (panelId: string, tabId: string) => panelManager.setActiveTab(panelId, tabId),
    [panelManager],
  );

  const updateSizes = useCallback(
    (splitId: string, sizes: number[]) => panelManager.updateSplitSizes(splitId, sizes),
    [panelManager],
  );

  const value = useMemo<DockContextType>(
    () => ({
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
      updateSizes,
    }),
    [
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
      updateSizes,
    ],
  );

  return <DockCtx.Provider value={value}>{children}</DockCtx.Provider>;
}
