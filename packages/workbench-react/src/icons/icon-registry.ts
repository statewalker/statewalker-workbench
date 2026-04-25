import { createContext, useContext } from "react";

export type IconComponent = React.ComponentType<{ className?: string }>;

/**
 * Maps icon names (kebab-case lucide names like "file-text", "check-circle")
 * to React components. Populated by the UI layer (shared-react.shadcn or
 * shared-react.spectrum) at startup.
 */
export class IconRegistry {
  private icons = new Map<string, IconComponent>();

  register(name: string, component: IconComponent): void {
    this.icons.set(name, component);
  }

  registerAll(icons: Record<string, IconComponent>): void {
    for (const [name, component] of Object.entries(icons)) {
      this.icons.set(name, component);
    }
  }

  resolve(name: string): IconComponent | undefined {
    return this.icons.get(name);
  }
}

const IconRegistryContext = createContext<IconRegistry | null>(null);
export const IconRegistryProvider = IconRegistryContext.Provider;

export function useIconRegistry(): IconRegistry | null {
  return useContext(IconRegistryContext);
}
