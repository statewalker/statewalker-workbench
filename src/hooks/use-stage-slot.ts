import { useState, useEffect } from "react";
import type { BaseClass } from "@repo/shared/models";
import type { Stage, StageListen } from "@repo/shared/stage";

/**
 * Subscribes to a Stage slot and returns its current models as React state.
 * Re-renders when models are published or unpublished.
 */
export function useStageSlot<T extends BaseClass>(
  stage: Stage,
  listen: StageListen<T>,
): T[] {
  const [models, setModels] = useState<T[]>([]);
  useEffect(() => listen(stage, setModels), [stage, listen]);
  return models;
}
