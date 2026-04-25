import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { ContextualHelpView } from "@statewalker/workbench-views";
import { HelpCircle, Info } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../../components/index.js";
import { RenderSlot } from "../_shared/render-slot.js";

/**
 * Spectrum has a dedicated `ContextualHelp` primitive; on this side we
 * mimic it with a small icon button that opens a floating popover
 * positioned beneath itself. Click anywhere outside to dismiss.
 */
export function ContextualHelpRenderer({ model }: { model: ContextualHelpView }) {
  useUpdates(model.onUpdate);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);

  const Icon = model.variant === "info" ? Info : HelpCircle;

  return (
    <span ref={wrapRef} className="relative inline-block">
      <Button
        variant="ghost"
        size="icon"
        className="size-6"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={model.title ?? (model.variant === "info" ? "Information" : "Help")}
      >
        <Icon className="size-4" aria-hidden="true" />
      </Button>
      {open && (
        <div className="absolute left-0 z-50 mt-1 w-64 rounded-md border border-border bg-popover p-3 text-sm text-popover-foreground shadow-md">
          {model.title && <div className="mb-1 font-semibold">{model.title}</div>}
          <RenderSlot value={model.content} />
        </div>
      )}
    </span>
  );
}
