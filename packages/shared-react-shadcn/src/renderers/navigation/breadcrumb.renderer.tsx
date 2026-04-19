import { useUpdates } from "@statewalker/shared-react/hooks";
import type { BreadcrumbView as BreadcrumbViewType } from "@statewalker/shared-views";

export function BreadcrumbRenderer({ model }: { model: BreadcrumbViewType }) {
  useUpdates(model.onUpdate);

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-sm">
      {model.items.map((item, index) => {
        const isLast = index === model.items.length - 1;
        return (
          <span key={index} className="flex items-center">
            {index > 0 && (
              <svg
                className="mx-2 h-4 w-4 text-muted-foreground"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            )}
            {isLast ? (
              <span className="text-foreground font-medium">{item.label}</span>
            ) : item.action ? (
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                onClick={() => {
                  item.action?.submit();
                  model.popTo(index);
                }}
              >
                {item.label}
              </button>
            ) : (
              <span
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                onClick={() => model.popTo(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") model.popTo(index);
                }}
                role="button"
                tabIndex={0}
              >
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
