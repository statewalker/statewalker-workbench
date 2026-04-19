import type { DropPosition } from "@statewalker/shared-react/dock";
import { calculateDropPosition } from "@statewalker/shared-react/dock";
import { useCallback, useEffect, useRef, useState } from "react";

export interface PanelDndOptions {
  panelId: string;
  isDragging: boolean;
  hasPendingDrop: boolean;
  pendingDropPosition?: DropPosition;
  /** Start a tab drag — called by the tab's onDragStart. */
  onDragStart: (tabId: string) => void;
  /** End drag without dropping (dragEnd on the source tab). */
  onDragEnd?: () => void;
  /** Request a drop at a computed position — controller validates and shows/cancels the confirmation grid. */
  onRequestDrop: (position: DropPosition, coords: { x: number; y: number }) => void;
  /** Confirm the drop at a chosen position. */
  onConfirmDrop: (position: DropPosition) => void;
  /** Cancel the pending drop. */
  onCancelDrop: () => void;
  /** Optional: guard that decides if a DragEvent is a tab drag. Defaults to always true when isDragging. */
  isDragEvent?: (e: React.DragEvent) => boolean;
}

export interface PanelDndState {
  panelRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  isHovering: boolean;
  selectedPosition: DropPosition;
  containerRect: DOMRect | null;
  handlers: {
    tabDragStart: (e: React.DragEvent, tabId: string) => void;
    tabDragEnd: () => void;
    contentDragOver: (e: React.DragEvent) => void;
    contentDragEnter: (e: React.DragEvent) => void;
    contentDragLeave: (e: React.DragEvent) => void;
    contentDrop: (e: React.DragEvent) => void;
    tabBarDragOver: (e: React.DragEvent) => void;
    tabBarDragEnter: (e: React.DragEvent) => void;
    tabBarDrop: (e: React.DragEvent) => void;
  };
  confirmation: {
    selectPosition: (pos: DropPosition) => void;
    confirm: (pos: DropPosition) => void;
    cancel: () => void;
  };
}

export function usePanelDnd(options: PanelDndOptions): PanelDndState {
  const {
    isDragging,
    hasPendingDrop,
    pendingDropPosition,
    onDragStart,
    onDragEnd,
    onRequestDrop,
    onConfirmDrop,
    onCancelDrop,
    isDragEvent,
  } = options;

  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<DropPosition>("center");

  const isTabDrag = useCallback(
    (e: React.DragEvent): boolean => {
      if (isDragEvent) return isDragEvent(e);
      return isDragging;
    },
    [isDragEvent, isDragging],
  );

  // ─── Handlers ───

  const tabDragStart = useCallback(
    (e: React.DragEvent, tabId: string) => {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", tabId);
      onDragStart(tabId);
    },
    [onDragStart],
  );

  const tabDragEnd = useCallback(() => {
    onDragEnd?.();
  }, [onDragEnd]);

  const contentDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (isTabDrag(e)) {
        e.dataTransfer.dropEffect = "move";
      }
    },
    [isTabDrag],
  );

  const contentDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!isTabDrag(e)) return;
      if (panelRef.current) {
        setContainerRect(panelRef.current.getBoundingClientRect());
      }
      setIsHovering(true);
    },
    [isTabDrag],
  );

  const contentDragLeave = useCallback(
    (e: React.DragEvent) => {
      if (!isTabDrag(e)) return;
      const rect = panelRef.current?.getBoundingClientRect();
      if (rect) {
        const { clientX, clientY } = e;
        if (
          clientX < rect.left ||
          clientX > rect.right ||
          clientY < rect.top ||
          clientY > rect.bottom
        ) {
          setIsHovering(false);
        }
      }
    },
    [isTabDrag],
  );

  const contentDrop = useCallback(
    (e: React.DragEvent) => {
      if (!isTabDrag(e)) return;
      e.preventDefault();
      e.stopPropagation();

      const suggested = calculateDropPosition(e.clientX, e.clientY, containerRect);
      setSelectedPosition(suggested);
      onRequestDrop(suggested, { x: e.clientX, y: e.clientY });

      if (panelRef.current) {
        setContainerRect(panelRef.current.getBoundingClientRect());
      }
      setIsHovering(false);
    },
    [isTabDrag, containerRect, onRequestDrop],
  );

  const tabBarDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const tabBarDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const tabBarDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setSelectedPosition("center");
      onRequestDrop("center", { x: e.clientX, y: e.clientY });
      if (panelRef.current) {
        setContainerRect(panelRef.current.getBoundingClientRect());
      }
      setIsHovering(false);
    },
    [onRequestDrop],
  );

  // ─── Effects ───

  // Sync selected position from pending drop
  useEffect(() => {
    if (hasPendingDrop && pendingDropPosition) {
      setSelectedPosition(pendingDropPosition);
    }
  }, [hasPendingDrop, pendingDropPosition]);

  // Click outside to cancel
  useEffect(() => {
    if (!hasPendingDrop) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-drop-confirmation]")) {
        onCancelDrop();
      }
    };
    const timeout = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 100);
    return () => {
      clearTimeout(timeout);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [hasPendingDrop, onCancelDrop]);

  // Reset hover when drag ends
  useEffect(() => {
    if (!isDragging) setIsHovering(false);
  }, [isDragging]);

  // Update rect on window resize
  useEffect(() => {
    const updateRect = () => {
      if (panelRef.current) {
        setContainerRect(panelRef.current.getBoundingClientRect());
      }
    };
    window.addEventListener("resize", updateRect);
    return () => window.removeEventListener("resize", updateRect);
  }, []);

  return {
    panelRef,
    contentRef,
    isHovering,
    selectedPosition,
    containerRect,
    handlers: {
      tabDragStart,
      tabDragEnd,
      contentDragOver,
      contentDragEnter,
      contentDragLeave,
      contentDrop,
      tabBarDragOver,
      tabBarDragEnter,
      tabBarDrop,
    },
    confirmation: {
      selectPosition: setSelectedPosition,
      confirm: onConfirmDrop,
      cancel: onCancelDrop,
    },
  };
}
