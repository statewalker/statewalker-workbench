import { newAdapter } from "@repo/shared/adapters";
import { createContext, createElement, useContext } from "react";

/** A constructor type used as the registry map key. */
// biome-ignore lint/suspicious/noExplicitAny: Constructor must accept any args for generic model matching
type Constructor<T = unknown> = new (...args: any[]) => T;

/** A React component that renders a model of type T. */
export type ReactComponentType<T = unknown> = React.ComponentType<{
  model: T;
}>;

/**
 * Maps model constructors to React component types.
 *
 * This is the React equivalent of `ComponentRegistry<Element>` —
 * instead of factory functions returning `[Element, cleanup]`,
 * it stores React component types that accept `{ model }` props.
 */
export class ReactComponentRegistry {
  // biome-ignore lint/suspicious/noExplicitAny: factory map must be heterogeneous
  private factories = new Map<Constructor, ReactComponentType<any>>();

  register<T>(
    modelType: Constructor<T>,
    component: ReactComponentType<T>,
  ): () => void {
    this.factories.set(modelType, component);
    return () => {
      if (this.factories.get(modelType) === component) {
        this.factories.delete(modelType);
      }
    };
  }

  resolve<T extends object>(model: T): ReactComponentType<T> | undefined {
    let ctor = model.constructor as Constructor;
    while (ctor && ctor !== Object) {
      const component = this.factories.get(ctor);
      if (component) return component as ReactComponentType<T>;
      ctor = Object.getPrototypeOf(ctor);
    }
    return undefined;
  }

  render<T extends object>(model: T): React.ReactElement | null {
    const Component = this.resolve<T>(model);
    return Component ? createElement(Component, { model }) : null;
  }
}

export const ComponentRegistryContext = createContext<ReactComponentRegistry>(
  new ReactComponentRegistry(),
);

export function useComponentRegistry(): ReactComponentRegistry {
  return useContext(ComponentRegistryContext);
}

export const [getReactComponentRegistry] = newAdapter<ReactComponentRegistry>(
  "reactComponentRegistry",
  () => new ReactComponentRegistry(),
);

export function registerComponent<V>(
  appContext: Record<string, unknown>,
  viewType: Constructor<V>,
  component: ReactComponentType<V>,
): () => void {
  const registry = getReactComponentRegistry(appContext);
  return registry.register(viewType, component);
}

export function RenderSlot<T extends object>({
  model,
}: {
  model: T;
}): React.ReactElement | null {
  const registry = useComponentRegistry();
  return registry.render(model);
}
