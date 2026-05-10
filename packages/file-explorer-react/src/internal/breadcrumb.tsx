import type { ReactElement } from "react";

interface BreadcrumbProps {
  path: string;
  onNavigate: (path: string) => void;
}

/** Path breadcrumb. Each segment is a clickable link except the last. */
export function Breadcrumb({ path, onNavigate }: BreadcrumbProps): ReactElement {
  const segments = path.split("/").filter(Boolean);
  const crumbs: { label: string; path: string }[] = [{ label: "/", path: "/" }];
  for (let i = 0; i < segments.length; i++) {
    crumbs.push({
      label: segments[i] ?? "",
      path: `/${segments.slice(0, i + 1).join("/")}`,
    });
  }

  return (
    <div className="flex items-center gap-0.5 text-xs font-mono px-2 py-0.5 flex-wrap">
      {crumbs.map((crumb, i) => (
        <span key={crumb.path}>
          {i > 0 && <span className="text-muted-foreground">/</span>}
          {i === crumbs.length - 1 ? (
            <span className="font-semibold">{crumb.label}</span>
          ) : (
            <button
              type="button"
              className="hover:underline text-primary cursor-pointer bg-transparent border-none p-0 font-mono text-xs"
              onClick={() => onNavigate(crumb.path)}
            >
              {crumb.label}
            </button>
          )}
        </span>
      ))}
    </div>
  );
}
