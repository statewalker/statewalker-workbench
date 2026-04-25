import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { KbdView } from "@statewalker/workbench-views";

export function KbdRenderer({ model }: { model: KbdView }) {
  useUpdates(model.onUpdate);

  return (
    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground">
      {model.keys}
    </kbd>
  );
}
