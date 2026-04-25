import { useComponentRegistry } from "@statewalker/workbench-react/component-registry";
import type { ViewModel } from "@statewalker/workbench-views";

export function RenderSlot({ value }: { value: string | ViewModel }) {
  const registry = useComponentRegistry();
  if (typeof value === "string") {
    return <span>{value}</span>;
  }
  const Component = registry.resolve(value);
  if (!Component) {
    return <span>No renderer</span>;
  }
  return <Component model={value} />;
}

export function RenderModel({ model }: { model: ViewModel }) {
  const registry = useComponentRegistry();
  const Component = registry.resolve(model);
  if (!Component) {
    return <span>No renderer</span>;
  }
  return <Component model={model} />;
}
