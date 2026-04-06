import { useComponentRegistry } from "@repo/shared-react/component-registry";
import type { ViewModel } from "@repo/shared-views";

export function RenderSlot({ value }: { value: string | ViewModel }) {
  const registry = useComponentRegistry();
  if (typeof value === "string") {
    return <span>{value}</span>;
  }
  const Component = registry.resolve(value);
  if (!Component) {
    return <span className="text-sm text-muted-foreground">No renderer</span>;
  }
  return <Component model={value} />;
}

export function RenderModel({ model }: { model: ViewModel }) {
  const registry = useComponentRegistry();
  const Component = registry.resolve(model);
  if (!Component) {
    return <span className="text-sm text-muted-foreground">No renderer</span>;
  }
  return <Component model={model} />;
}
