import { useIconRegistry } from "./icon-registry.js";

interface IconProps {
  name: string;
  className?: string;
}

/**
 * Renders a named icon from the IconRegistry.
 * Icon names follow lucide kebab-case convention (e.g. "file-text", "check-circle").
 * Returns null if the icon is not registered.
 */
export function Icon({ name, className }: IconProps): React.ReactElement | null {
  const registry = useIconRegistry();
  if (!registry) return null;
  const Component = registry.resolve(name);
  if (!Component) return null;
  return <Component className={className} />;
}
