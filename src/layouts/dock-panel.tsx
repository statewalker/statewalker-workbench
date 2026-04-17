import { useComponentRegistry } from "@repo/shared-react/component-registry";
import { Icon } from "@repo/shared-react/icons";
import type { DockPanelView } from "@repo/shared-views";
import { GripVertical, X } from "lucide-react";
import { useCallback, useSyncExternalStore } from "react";
import { cn } from "../lib/utils.js";
import { usePanelManagerView } from "./app-shell.js";
import {
  type DockPanel as DockPanelType,
  useDockLayout,
} from "./dock-context.js";
import { DropConfirmationGrid } from "./drop-confirmation-grid.js";
import { usePanelDnd } from "./use-panel-dnd.js";

function TabIcon({ name }: { name?: string }) {
  if (!name) return null;
  return (
    <Icon
      name={name}
      className="size-3.5 group-hover:opacity-0 transition-opacity"
    />
  );
}

/**
 * DockPanelComponent — renders the tab bar and active content for a
 * single tree panel. The panel's tabs come directly from the tree
 * (authored by PanelManagerView); no tree lookups happen here.
 */
export function DockPanelComponent({ panel }: { panel: DockPanelType }) {
  const {
    dragState,
    pendingDrop,
    startDrag,
    endDrag,
    requestDrop,
    confirmDrop,
    cancelDrop,
    setActiveTab,
  } = useDockLayout();

  const registry = useComponentRegistry();
  const panelManager = usePanelManagerView();

  // Focus is tracked on the model; subscribe to it so the ring reflects it.
  const focusedTabKey = useSyncExternalStore(
    useCallback(
      (cb) => panelManager?.onUpdate(cb) ?? (() => {}),
      [panelManager],
    ),
    useCallback(() => panelManager?.focusedTabKey ?? null, [panelManager]),
    () => null,
  );

  // Tabs & active tab come directly from the tree panel — PM is the
  // single source of truth, and DockProvider has already subscribed.
  const tabs = panel.tabs;
  const activeTabId = panel.activeTabId;

  const isDragging = dragState !== null;
  const hasPendingDrop = pendingDrop?.targetPanelId === panel.id;
  const isFocused = tabs.some((t) => t.id === focusedTabKey);
  const activeTab = tabs.find((t) => t.id === activeTabId);

  // ─── DnD hook ───

  const dnd = usePanelDnd({
    panelId: panel.id,
    isDragging,
    hasPendingDrop,
    pendingDropPosition: pendingDrop?.suggestedPosition,
    onDragStart: (tabId) => startDrag(tabId, panel.id),
    onDragEnd: endDrag,
    onRequestDrop: (position, coords) =>
      requestDrop(panel.id, position, coords),
    onConfirmDrop: confirmDrop,
    onCancelDrop: cancelDrop,
  });

  // Render active tab content via ComponentRegistry
  const panelView = activeTab?.panelModel as DockPanelView | undefined;
  const ActiveContent = panelView ? registry.resolve(panelView.content) : null;

  const handlePanelClick = useCallback(() => {
    if (activeTabId && panelManager) {
      panelManager.focus(activeTabId);
    }
  }, [activeTabId, panelManager]);

  return (
    <div
      ref={dnd.panelRef}
      onClickCapture={handlePanelClick}
      className={cn(
        "flex flex-col h-full bg-card overflow-hidden relative rounded-md border transition-colors",
        isFocused ? "border-primary/60 shadow-sm" : "border-border/50",
      )}
    >
      {/* Tab Bar */}
      <div
        className={cn(
          "flex items-center bg-muted/50 min-h-9 overflow-x-auto px-1",
          isDragging && dnd.isHovering && "ring-2 ring-inset ring-primary/50",
        )}
        onDragOver={dnd.handlers.tabBarDragOver}
        onDragEnter={dnd.handlers.tabBarDragEnter}
        onDrop={dnd.handlers.tabBarDrop}
      >
        {tabs.map((tab) => {
          const isActiveTab = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              role="tab"
              tabIndex={0}
              aria-selected={isActiveTab}
              draggable
              onDragStart={(e) => dnd.handlers.tabDragStart(e, tab.id)}
              onDragEnd={dnd.handlers.tabDragEnd}
              onClick={() => {
                setActiveTab(panel.id, tab.id);
                panelManager?.focus(tab.id);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveTab(panel.id, tab.id);
                  panelManager?.focus(tab.id);
                }
              }}
              className={cn(
                "group relative flex items-center gap-1.5 px-3 py-1.5 text-sm cursor-pointer select-none transition-colors outline-none focus-visible:ring-1 focus-visible:ring-ring",
                isActiveTab
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="relative flex items-center justify-center w-3.5 h-3.5 shrink-0">
                <TabIcon name={tab.icon} />
                <GripVertical className="absolute inset-0 w-3.5 h-3.5 opacity-0 group-hover:opacity-40 cursor-grab active:cursor-grabbing transition-opacity" />
              </span>
              <span className="truncate max-w-35">{tab.title}</span>
              {tab.closable !== false && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Remove from model (source of truth) — the onClose
                    // callback on the DockPanelView handles cleanup
                    const pv = panelManager?.getPanel(tab.id);
                    if (pv?.onClose) pv.onClose();
                    panelManager?.removePanel(tab.id);
                  }}
                  className="ml-1 p-0.5 rounded-sm hover:bg-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
              {isActiveTab && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />
              )}
            </div>
          );
        })}

        {isDragging && (
          <div className="flex-1 min-w-15 flex items-center justify-center text-xs text-muted-foreground/50 italic">
            Drop here
          </div>
        )}
      </div>

      {/* Content Area */}
      <div
        ref={dnd.contentRef}
        className={cn(
          "relative flex-1 overflow-auto",
          isDragging &&
            dnd.isHovering &&
            "ring-2 ring-inset ring-primary/30 bg-primary/5",
        )}
        onDragOver={dnd.handlers.contentDragOver}
        onDragEnter={dnd.handlers.contentDragEnter}
        onDragLeave={dnd.handlers.contentDragLeave}
        onDrop={dnd.handlers.contentDrop}
      >
        {ActiveContent && panelView && (
          <div className="absolute inset-0 flex flex-col">
            <ActiveContent model={panelView.content} />
          </div>
        )}

        {hasPendingDrop && dnd.selectedPosition !== "center" && (
          <div
            className={cn(
              "absolute bg-primary/15 border-2 border-dashed border-primary rounded transition-all duration-200 pointer-events-none",
              dnd.selectedPosition === "left" && "left-0 top-0 w-1/2 h-full",
              dnd.selectedPosition === "right" && "right-0 top-0 w-1/2 h-full",
              dnd.selectedPosition === "top" && "left-0 top-0 w-full h-1/2",
              dnd.selectedPosition === "bottom" &&
                "left-0 bottom-0 w-full h-1/2",
            )}
          />
        )}

        {hasPendingDrop && dnd.selectedPosition === "center" && (
          <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded pointer-events-none" />
        )}
      </div>

      {/* Drop confirmation grid */}
      {hasPendingDrop && pendingDrop && (
        <div
          data-drop-confirmation
          className="absolute inset-0 pointer-events-none"
        >
          <div className="pointer-events-auto">
            <DropConfirmationGrid
              selectedPosition={dnd.selectedPosition}
              onSelectPosition={dnd.confirmation.selectPosition}
              onConfirm={dnd.confirmation.confirm}
              onCancel={dnd.confirmation.cancel}
              dropCoords={pendingDrop.dropCoords}
              containerRect={dnd.containerRect}
            />
          </div>
        </div>
      )}
    </div>
  );
}
