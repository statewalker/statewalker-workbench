import { View } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { ContextMenuView } from "@statewalker/workbench-views";
import { useCallback, useEffect, useState } from "react";
import { RenderModel } from "../_shared/render-slot.js";

/**
 * Spectrum context menu — captures right-click on the wrapped target,
 * shows a positioned menu with the model's actions, and closes on any
 * click. Matches the shadcn ContextMenu behaviour; uses `<View>` for
 * Spectrum-tokenised styling.
 */
export function ContextMenuRenderer({ model }: { model: ContextMenuView }) {
  useUpdates(model.onUpdate);
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!menuPos) return;
    const close = () => setMenuPos(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [menuPos]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setMenuPos({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <div role="group" onContextMenu={handleContextMenu}>
      <RenderModel model={model.target} />
      {menuPos && (
        <View
          position="fixed"
          UNSAFE_style={{
            left: menuPos.x,
            top: menuPos.y,
            zIndex: 50,
            minWidth: 160,
            boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
          }}
          borderColor="default"
          borderWidth="thin"
          borderRadius="medium"
          backgroundColor="gray-100"
          padding="size-50"
        >
          {model.items.map((item) => (
            <button
              key={item.actionKey}
              type="button"
              style={{
                width: "100%",
                padding: "6px 12px",
                fontSize: 14,
                textAlign: "left",
                background: "transparent",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                color: "inherit",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "var(--spectrum-alias-background-color-hover-overlay, rgba(255,255,255,0.05))";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
              onClick={() => {
                item.submit();
                setMenuPos(null);
              }}
            >
              {item.label ?? item.actionKey}
            </button>
          ))}
        </View>
      )}
    </div>
  );
}
