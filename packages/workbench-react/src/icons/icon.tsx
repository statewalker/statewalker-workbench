import { DynamicIcon, type IconName } from "lucide-react/dynamic";

interface IconProps {
  name: string;
  className?: string;
}

/**
 * Renders a Lucide icon by kebab-case name (e.g. "file-text",
 * "check-circle"). Backed by `lucide-react/dynamic`'s `DynamicIcon`
 * which lazy-loads the icon, so any name from the Lucide set works
 * without prior registration.
 */
export function Icon({ name, className }: IconProps): React.ReactElement | null {
  return <DynamicIcon name={name as IconName} className={className} />;
}
