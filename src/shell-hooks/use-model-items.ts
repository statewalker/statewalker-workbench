import { useEffect, useState } from "react";

interface ModelRegistry<T> {
  getAll(): T[];
  onUpdate(cb: () => void): () => void;
}

export function useModelItems<T>(model: ModelRegistry<T>): T[] {
  const [items, setItems] = useState<T[]>(() => model.getAll());
  useEffect(() => {
    setItems(model.getAll());
    return model.onUpdate(() => setItems(model.getAll()));
  }, [model]);
  return items;
}
