/** A constructor type used as the registry map key. */
// biome-ignore lint/suspicious/noExplicitAny: Constructor must accept any args for generic model matching
export type Constructor<T = unknown> = new (...args: any[]) => T;

/** Factory function that creates a component from a model instance. */
export type ComponentFactory<T = unknown, C = unknown> = (params: {
  model: T;
  components: ComponentRegistry<C>;
}) => [component: C, remove: () => void];

/**
 * Component registry — maps model constructors to renderer factories.
 */
export class ComponentRegistry<C = unknown> {
  private factories = new Map<Constructor, ComponentFactory<unknown, C>>();

  register<T>(modelType: Constructor<T>, factory: ComponentFactory<T, C>): void {
    this.factories.set(modelType, factory as ComponentFactory<unknown, C>);
  }

  resolve<T extends object>(model: T): ComponentFactory<T, C> | undefined {
    return this.factories.get(model.constructor as Constructor) as
      | ComponentFactory<T, C>
      | undefined;
  }
}
