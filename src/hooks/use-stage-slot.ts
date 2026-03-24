import type { BaseClass } from "@repo/shared/models";
import type { Stage, StageListen } from "@repo/shared/stage";
import { useEffect, useState } from "react";

/**
 * Subscribes to a Stage slot and returns its current models as React state.
 * Re-renders when models are published or unpublished.
 */
export function useStageSlot<T extends BaseClass>(
  stage: Stage,
  listen: StageListen<T>,
): T[] {
  const [models, setModels] = useState<T[]>([]);
  useEffect(
    () => listen(stage, (vals) => setModels(vals) ?? (() => {})),
    [stage, listen],
  );
  return models;
}
