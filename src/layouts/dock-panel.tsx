import { View } from "@adobe/react-spectrum";
import { useComponentRegistry } from "@repo/shared-react/component-registry";
import { calculateDropPosition } from "@repo/shared-react/dock";
import type { DropPosition } from "@repo/shared-react/dock";
import type { DockPanelView } from "@repo/shared-views";
import { useCallback, useEffect, useRef, useState } from "react";
import { useColorScheme } from "./app-shell.js";
import { type DockPanel, useDockLayout } from "./dock-context.js";
import { DropConfirmationGrid } from "./drop-confirmation-grid.js";

export function SpectrumDockPanel({ panel }: { panel: DockPanel }) {
  const {
    closeTab,
    setActiveTab,
    dragState,
    startDrag,
    endDrag,
    requestDrop,
    pendingDrop,
    confirmDrop,
    cancelDrop,
  } = useDockLayout();
  const registry = useComponentRegistry();
  const panelRef = useRef<HTMLDivElement>(null);

  const activeTab = panel.tabs.find((t) => t.id === panel.activeTabId);
  const panelView = activeTab?.panelModel as DockPanelView | undefined;
  const ActiveContent = panelView ? registry.resolve(panelView.content) : null;
  const isDragging = dragState !== null;
  const hasPendingDrop = pendingDrop?.targetPanelId === panel.id;
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  // Track selected position for the drop confirmation
  const [selectedPosition, setSelectedPosition] =
    useState<DropPosition>("center");
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (hasPendingDrop && pendingDrop?.suggestedPosition) {
      setSelectedPosition(pendingDrop.suggestedPosition);
    }
  }, [hasPendingDrop, pendingDrop?.suggestedPosition]);

  // Click outside to cancel
  useEffect(() => {
    if (!hasPendingDrop) return;
    const handle = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[role=dialog]")) cancelDrop();
    };
    const timeout = setTimeout(
      () => document.addEventListener("click", handle),
      100,
    );
    return () => {
      clearTimeout(timeout);
      document.removeEventListener("click", handle);
    };
  }, [hasPendingDrop, cancelDrop]);

  const handleContentDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const rect = panelRef.current?.getBoundingClientRect() ?? null;
      setContainerRect(rect);
      const position = calculateDropPosition(e.clientX, e.clientY, rect);
      setSelectedPosition(position);
      requestDrop(panel.id, position, { x: e.clientX, y: e.clientY });
    },
    [panel.id, requestDrop],
  );

  const handleTabBarDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (panelRef.current)
        setContainerRect(panelRef.current.getBoundingClientRect());
      setSelectedPosition("center");
      requestDrop(panel.id, "center", { x: e.clientX, y: e.clientY });
    },
    [panel.id, requestDrop],
  );

  // Drop preview highlight style
  const previewStyle = (pos: DropPosition): React.CSSProperties | undefined => {
    const bg = isDark ? "rgba(20, 115, 230, 0.15)" : "rgba(20, 115, 230, 0.08)";
    const base: React.CSSProperties = {
      position: "absolute",
      background: bg,
      boxShadow: "inset 0 0 0 2px #1473e6",
      borderRadius: 4,
      pointerEvents: "none",
      transition: "all 0.2s",
    };
    if (pos === "center" && hasPendingDrop && selectedPosition === "center")
      return { ...base, inset: 0 };
    if (selectedPosition !== pos) return undefined;
    if (pos === "left") return { ...base, left: 0, top: 0, width: "50%", height: "100%" };
    if (pos === "right") return { ...base, right: 0, top: 0, width: "50%", height: "100%" };
    if (pos === "top") return { ...base, left: 0, top: 0, width: "100%", height: "50%" };
    if (pos === "bottom") return { ...base, left: 0, bottom: 0, width: "100%", height: "50%" };
    return undefined;
  };

  return (
    <div
      ref={panelRef}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <View
        borderRadius="regular"
        borderWidth="thin"
        borderColor="dark"
        overflow="hidden"
        height="100%"
        UNSAFE_style={{ display: "flex", flexDirection: "column", position: "relative" }}
      >
        {/* Tab bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            minHeight: 36,
            overflowX: "auto",
            paddingInline: 4,
            borderBottom:
              "1px solid var(--spectrum-alias-border-color-mid, rgba(255,255,255,0.1))",
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
          }}
          onDrop={handleTabBarDrop}
        >
          {panel.tabs.map((tab) => {
            const isActive = tab.id === panel.activeTabId;
            return (
              <div
                key={tab.id}
                role="tab"
                tabIndex={0}
                aria-selected={isActive}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = "move";
                  e.dataTransfer.setData("text/plain", tab.id);
                  startDrag(tab.id, panel.id);
                }}
                onDragEnd={() => endDrag()}
                onClick={() => setActiveTab(panel.id, tab.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveTab(panel.id, tab.id);
                  }
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  fontSize: 13,
                  cursor: "grab",
                  userSelect: "none",
                  position: "relative",
                  color: isActive
                    ? "var(--spectrum-alias-text-color, inherit)"
                    : "var(--spectrum-alias-text-color-disabled, #999)",
                  borderBottom: isActive
                    ? "2px solid var(--spectrum-global-color-blue-500, #1473e6)"
                    : "2px solid transparent",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis" }}>
                  {tab.title}
                </span>
                {tab.closable !== false && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(panel.id, tab.id);
                    }}
                    style={{
                      marginLeft: 4,
                      padding: "0 4px",
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      color: "inherit",
                      opacity: 0.4,
                      fontSize: 14,
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}

          {isDragging && (
            <div
              style={{
                flex: 1,
                minWidth: 60,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontStyle: "italic",
                opacity: 0.4,
              }}
            >
              Drop here
            </div>
          )}
        </div>

        {/* Content + overlays wrapper — relative + overflow hidden to clip overlays */}
        <div
          style={{ flex: 1, position: "relative", overflow: "hidden" }}
        >
          {/* Scrollable content */}
          <div
            style={{ position: "absolute", inset: 0, overflow: "auto" }}
            onDragOver={(e) => {
              e.preventDefault();
              if (isDragging) e.dataTransfer.dropEffect = "move";
            }}
            onDrop={handleContentDrop}
          >
            {ActiveContent && panelView && (
              <div style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
                <ActiveContent model={panelView.content} />
              </div>
            )}
          </div>

          {/* Drop preview overlays — clipped by the overflow:hidden wrapper */}
          {hasPendingDrop && selectedPosition !== "center" && (
            <div style={previewStyle(selectedPosition)} />
          )}
          {hasPendingDrop && selectedPosition === "center" && (
            <div style={previewStyle("center")} />
          )}

          {/* Drop confirmation grid */}
          {hasPendingDrop && pendingDrop && (
            <div
              style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
            >
              <div style={{ pointerEvents: "auto" }}>
                <DropConfirmationGrid
                  selectedPosition={selectedPosition}
                  onSelectPosition={setSelectedPosition}
                  onConfirm={confirmDrop}
                  onCancel={cancelDrop}
                  dropCoords={pendingDrop.dropCoords}
                  containerRect={containerRect}
                />
              </div>
            </div>
          )}
        </div>
      </View>
    </div>
  );
}
