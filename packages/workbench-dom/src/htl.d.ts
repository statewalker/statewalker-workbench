declare module "htl" {
  /** Tagged template that creates a DOM element from an HTML string. */
  export function html(strings: TemplateStringsArray, ...values: unknown[]): Element;

  /** Tagged template that creates an SVG element from an SVG string. */
  export function svg(strings: TemplateStringsArray, ...values: unknown[]): SVGElement;
}
