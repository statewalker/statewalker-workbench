import type { UIModelRegistry } from "@statewalker/workbench-views";
import { useEffect, useState } from "react";

export function useModelItems<T>(model: UIModelRegistry<T>): T[] {
  const [items, setItems] = useState<T[]>(model.getAll());
  useEffect(() => {
    setItems(model.getAll());
    return model.onUpdate(() => setItems(model.getAll()));
  }, [model]);
  return items;
}
