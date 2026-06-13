import { JSONUIProvider, Renderer } from "@json-render/react";
import type { ReactElement } from "react";

export interface SpecRendererProps {
  /** json-render spec, held opaquely (`unknown`) by the SpecStore. */
  spec: unknown;
  /** json-render registry, held opaquely by the catalogs slot. */
  registry: unknown;
}

/**
 * Renders a json-render `spec` against a `registry`. The single place
 * the workbench substrate crosses into `@json-render/react`:
 * `<JSONUIProvider>` sets up the visibility / validation / state
 * contexts that `<Renderer>`'s internals read from.
 *
 * Spec and registry are typed `unknown` because the SpecStore and the
 * `json:catalogs` slot deliberately hold them opaquely; the concrete
 * json-render types live only at this boundary.
 */
export function SpecRenderer({ spec, registry }: SpecRendererProps): ReactElement {
  // biome-ignore lint/suspicious/noExplicitAny: json-render's Spec/Registry types live behind `unknown` in our stores
  const Renderer$ = Renderer as any;
  // biome-ignore lint/suspicious/noExplicitAny: ditto for the registry shape
  const registry$ = registry as any;
  return (
    <JSONUIProvider registry={registry$}>
      <Renderer$ spec={spec} registry={registry$} />
    </JSONUIProvider>
  );
}
