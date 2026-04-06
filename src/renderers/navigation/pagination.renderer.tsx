import { useUpdates } from "@repo/shared-react/hooks";
import type { PaginationView as PaginationViewType } from "@repo/shared-views";
import { Button } from "../../components/index.js";

export function PaginationRenderer({ model }: { model: PaginationViewType }) {
  useUpdates(model.onUpdate);

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">
        Page {model.page} of {model.totalPages}
      </span>
      <div className="flex gap-1">
        <Button
          variant="outline"
          onClick={() => model.setPage(1)}
          disabled={!model.hasPrevious}
        >
          First
        </Button>
        <Button
          variant="outline"
          onClick={() => model.previous()}
          disabled={!model.hasPrevious}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => model.next()}
          disabled={!model.hasNext}
        >
          Next
        </Button>
        <Button
          variant="outline"
          onClick={() => model.setPage(model.totalPages)}
          disabled={!model.hasNext}
        >
          Last
        </Button>
      </div>
    </div>
  );
}
