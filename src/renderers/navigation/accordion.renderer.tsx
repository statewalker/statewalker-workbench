import { useUpdates } from "@repo/shared-react/hooks";
import type { AccordionView as AccordionViewType } from "@repo/shared-views";
import { RenderModel } from "../_shared/render-slot.js";

export function AccordionRenderer({ model }: { model: AccordionViewType }) {
  useUpdates(model.onUpdate);

  return (
    <div className="w-full divide-y divide-border border rounded-md">
      {model.items.map((item) => {
        const expanded = model.isExpanded(item.key);
        return (
          <div key={item.key}>
            <button
              type="button"
              className={`flex w-full items-center justify-between px-4 py-3 text-sm font-medium transition-colors hover:bg-muted/50 ${
                item.disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              onClick={() => model.toggle(item.key)}
              disabled={item.disabled}
              aria-expanded={expanded}
            >
              <span>{item.title}</span>
              <svg
                className={`h-4 w-4 shrink-0 transition-transform ${
                  expanded ? "rotate-180" : ""
                }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {expanded && (
              <div className="px-4 pb-3">
                <RenderModel model={item.content} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
