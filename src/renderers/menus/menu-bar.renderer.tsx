import { useUpdates } from "@repo/shared-react/hooks";
import type { MenuBarView } from "@repo/shared-views";
import { MenuTriggerRenderer } from "./menu-trigger.renderer.js";

export function MenuBarRenderer({ model }: { model: MenuBarView }) {
  useUpdates(model.onUpdate);

  return (
    <div
      className="flex items-center gap-1 border-b border-border bg-card px-2 py-1"
      role="menubar"
    >
      {model.children.map((trigger) => (
        <MenuTriggerRenderer key={trigger.key} model={trigger} />
      ))}
    </div>
  );
}
