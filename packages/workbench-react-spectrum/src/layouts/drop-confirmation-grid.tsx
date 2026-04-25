import type { DropPosition } from "@statewalker/workbench-react/dock";
import { useColorScheme } from "./app-shell.js";

const POSITIONS: {
  position: DropPosition;
  label: string;
  icon: string;
  gridArea: string;
}[] = [
  { position: "top", label: "Split top", icon: "↑", gridArea: "1 / 2 / 2 / 3" },
  { position: "left", label: "Split left", icon: "←", gridArea: "2 / 1 / 3 / 2" },
  { position: "center", label: "Add as Tab", icon: "⊞", gridArea: "2 / 2 / 3 / 3" },
  { position: "right", label: "Split right", icon: "→", gridArea: "2 / 3 / 3 / 4" },
  { position: "bottom", label: "Split bottom", icon: "↓", gridArea: "3 / 2 / 4 / 3" },
];

export function DropConfirmationGrid({
  selectedPosition,
  onSelectPosition,
  onConfirm,
  onCancel,
  dropCoords,
  containerRect,
}: {
  selectedPosition: DropPosition;
  onSelectPosition: (position: DropPosition) => void;
  onConfirm: (position: DropPosition) => void;
  onCancel: () => void;
  dropCoords: { x: number; y: number };
  containerRect: DOMRect | null;
}) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  if (!containerRect) return null;

  const gridWidth = 140;
  const gridHeight = 130;

  let left = dropCoords.x - containerRect.left - gridWidth / 2;
  let top = dropCoords.y - containerRect.top - gridHeight / 2;
  left = Math.max(8, Math.min(left, containerRect.width - gridWidth - 8));
  top = Math.max(8, Math.min(top, containerRect.height - gridHeight - 8));

  return (
    <div
      role="dialog"
      style={{ position: "absolute", left, top, zIndex: 50 }}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <div
        style={{
          background: isDark ? "#1e1e1e" : "#fff",
          border: `1px solid ${isDark ? "#555" : "#ccc"}`,
          borderRadius: 12,
          padding: 12,
          boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.5)" : "0 8px 32px rgba(0,0,0,0.15)",
          position: "relative",
        }}
      >
        {/* Cancel button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onCancel();
          }}
          style={{
            position: "absolute",
            top: -8,
            right: -8,
            width: 22,
            height: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            border: "none",
            background: "var(--spectrum-global-color-red-500, #e34850)",
            color: "white",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: "bold",
            lineHeight: 1,
            zIndex: 10,
          }}
          title="Cancel"
        >
          ✕
        </button>

        {/* Position grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 36px)",
            gridTemplateRows: "repeat(3, 32px)",
            gap: 6,
          }}
        >
          {POSITIONS.map(({ position, icon, gridArea }) => {
            const isSelected = selectedPosition === position;
            return (
              <button
                type="button"
                key={position}
                style={{
                  gridArea,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 8,
                  border: isSelected
                    ? "2px solid var(--spectrum-global-color-blue-500, #1473e6)"
                    : "2px solid transparent",
                  background: isSelected ? "#1473e6" : isDark ? "#333" : "#e8e8e8",
                  color: isSelected ? "white" : isDark ? "#ccc" : "#444",
                  cursor: "pointer",
                  fontSize: 16,
                  transition: "all 0.15s",
                  transform: isSelected ? "scale(1.05)" : "scale(1)",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onConfirm(position);
                }}
                onMouseEnter={() => onSelectPosition(position)}
                title={position === "center" ? "Add as tab" : `Split ${position}`}
              >
                {icon}
              </button>
            );
          })}
        </div>

        {/* Label */}
        <div
          style={{
            marginTop: 8,
            textAlign: "center",
            fontSize: 11,
            fontWeight: 500,
            color: isDark ? "#999" : "#666",
          }}
        >
          {selectedPosition === "center" ? "Add as Tab" : `Split ${selectedPosition}`}
        </div>
      </div>
    </div>
  );
}
