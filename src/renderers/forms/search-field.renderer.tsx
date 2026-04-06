import { useUpdates } from "@repo/shared-react/hooks";
import type { SearchFieldView } from "@repo/shared-views";

export function SearchFieldRenderer({ model }: { model: SearchFieldView }) {
  useUpdates(model.onUpdate);

  return (
    <div className="flex flex-col gap-1.5">
      {model.label && (
        <label className="text-sm font-medium">{model.label}</label>
      )}
      <div className="relative">
        <input
          type="search"
          value={model.value}
          placeholder={model.placeholder}
          disabled={model.isDisabled}
          onChange={(e) => model.setValue(e.target.value)}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-8 text-sm shadow-sm transition-colors
            placeholder:text-muted-foreground
            focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
            disabled:cursor-not-allowed disabled:opacity-50"
        />
        <svg
          className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
        {model.value && (
          <button
            type="button"
            onClick={() => model.clear()}
            className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
          >
            &#x2715;
          </button>
        )}
      </div>
    </div>
  );
}
