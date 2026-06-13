// The sole `@json-render/react` boundary for the workbench substrate.
// `<SpecRenderer>` wraps the json-render Renderer; `defineRegistry` and
// `schema` are re-exported so renderer fragments build their registries
// and catalogs without importing `@json-render/react` directly.
export { defineRegistry, schema } from "@json-render/react";
export { SpecRenderer, type SpecRendererProps } from "./spec-renderer.js";
