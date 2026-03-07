import { createContext, useContext } from "react";

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
  ): void {
    this.factories.set(modelType, component);
  }

  resolve<T extends object>(model: T): ReactComponentType<T> | undefined {
    return this.factories.get(model.constructor as Constructor) as
      | ReactComponentType<T>
      | undefined;
  }
}

export const ComponentRegistryContext = createContext<ReactComponentRegistry>(
  new ReactComponentRegistry(),
);

export function useComponentRegistry(): ReactComponentRegistry {
  return useContext(ComponentRegistryContext);
}
