import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Layers,
  X,
} from "lucide-react";
import { cn } from "../lib/utils.js";
import type { DropPosition } from "./dock-context.js";

const POSITIONS: {
  position: DropPosition;
  icon: React.ReactNode;
  gridArea: string;
}[] = [
  {
    position: "top",
    icon: <ArrowUp className="w-4 h-4" />,
    gridArea: "1 / 2 / 2 / 3",
  },
  {
    position: "left",
    icon: <ArrowLeft className="w-4 h-4" />,
    gridArea: "2 / 1 / 3 / 2",
  },
  {
    position: "center",
    icon: <Layers className="w-4 h-4" />,
    gridArea: "2 / 2 / 3 / 3",
  },
  {
    position: "right",
    icon: <ArrowRight className="w-4 h-4" />,
    gridArea: "2 / 3 / 3 / 4",
  },
  {
    position: "bottom",
    icon: <ArrowDown className="w-4 h-4" />,
    gridArea: "3 / 2 / 4 / 3",
  },
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
  if (!containerRect) return null;

  const gridWidth = 140;
  const gridHeight = 120;

  let left = dropCoords.x - containerRect.left - gridWidth / 2;
  let top = dropCoords.y - containerRect.top - gridHeight / 2;

  left = Math.max(8, Math.min(left, containerRect.width - gridWidth - 8));
  top = Math.max(8, Math.min(top, containerRect.height - gridHeight - 8));

  return (
    <div
      role="dialog"
      className="absolute z-50"
      style={{ left, top }}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <div className="bg-popover/95 border border-border rounded-xl shadow-2xl p-3 backdrop-blur-md">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onCancel();
          }}
          className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-lg hover:scale-110 transition-transform z-10"
          title="Cancel"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div
          className="grid gap-1.5"
          style={{
            gridTemplateColumns: "repeat(3, 36px)",
            gridTemplateRows: "repeat(3, 32px)",
          }}
        >
          {POSITIONS.map(({ position, icon, gridArea }) => (
            <button
              type="button"
              key={position}
              style={{ gridArea }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onConfirm(position);
              }}
              onMouseEnter={() => onSelectPosition(position)}
              className={cn(
                "flex items-center justify-center rounded-lg transition-all duration-150",
                "border-2 font-medium",
                selectedPosition === position
                  ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                  : "bg-muted/80 text-muted-foreground border-transparent hover:bg-muted hover:border-border/50",
              )}
              title={position === "center" ? "Add as tab" : `Split ${position}`}
            >
              {icon}
            </button>
          ))}
        </div>

        <div className="mt-2 text-center text-xs font-medium text-muted-foreground">
          {selectedPosition === "center"
            ? "Add as Tab"
            : `Split ${selectedPosition}`}
        </div>
      </div>
    </div>
  );
}
