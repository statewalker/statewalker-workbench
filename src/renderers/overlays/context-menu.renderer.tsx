import { useUpdates } from "@repo/shared-react/hooks";
import type { ContextMenuView as ContextMenuViewType } from "@repo/shared-views";
import { useCallback, useEffect, useState } from "react";
import { RenderModel } from "../_shared/render-slot.js";

export function ContextMenuRenderer({ model }: { model: ContextMenuViewType }) {
  useUpdates(model.onUpdate);
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!menuPos) return;
    const handler = () => setMenuPos(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [menuPos]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setMenuPos({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <div role="group" onContextMenu={handleContextMenu}>
      <RenderModel model={model.target} />
      {menuPos && (
        <div
          className="fixed z-50 min-w-[160px] rounded-md border border-border bg-popover p-1 shadow-md"
          style={{ left: menuPos.x, top: menuPos.y }}
        >
          {model.items.map((item) => (
            <button
              key={item.actionKey}
              type="button"
              className="w-full rounded-sm px-3 py-1.5 text-sm text-left hover:bg-muted cursor-pointer"
              onClick={() => {
                item.submit();
                setMenuPos(null);
              }}
            >
              {item.label ?? item.actionKey}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
