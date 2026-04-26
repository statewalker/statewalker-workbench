import { useUpdates } from "@statewalker/workbench-react/hooks";
import { Icon } from "@statewalker/workbench-react/icons";
import type {
  BreadcrumbItem,
  BreadcrumbView as BreadcrumbViewType,
} from "@statewalker/workbench-views";

function ItemContent({ item }: { item: BreadcrumbItem }) {
  return (
    <span className="inline-flex items-center gap-1">
      {item.icon && <Icon name={item.icon} className="size-4" />}
      {item.label && <span>{item.label}</span>}
    </span>
  );
}

export function BreadcrumbRenderer({ model }: { model: BreadcrumbViewType }) {
  useUpdates(model.onUpdate);

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-sm px-3 py-2">
      {model.items.map((item, index) => {
        const isLast = index === model.items.length - 1;
        return (
          <span key={index} className="flex items-center">
            {index > 0 && (
              <svg
                aria-hidden="true"
                className="mx-2 h-4 w-4 text-muted-foreground"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <title>Separator</title>
                <path d="m9 18 6-6-6-6" />
              </svg>
            )}
            {isLast ? (
              <span className="text-foreground font-medium">
                <ItemContent item={item} />
              </span>
            ) : item.action ? (
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                onClick={() => {
                  item.action?.submit();
                  model.popTo(index);
                }}
              >
                <ItemContent item={item} />
              </button>
            ) : (
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                onClick={() => model.popTo(index)}
              >
                <ItemContent item={item} />
              </button>
            )}
          </span>
        );
      })}
    </nav>
  );
}
