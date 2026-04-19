var i = Object.defineProperty;
var c = (r, t, e) => t in r ? i(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var o = (r, t, e) => c(r, typeof t != "symbol" ? t + "" : t, e);
import { newAdapter as g } from "@repo/shared-adapters";
import { createContext as u, createElement as a, useContext as f } from "react";
class s {
  constructor() {
    // biome-ignore lint/suspicious/noExplicitAny: factory map must be heterogeneous
    o(this, "factories", /* @__PURE__ */ new Map());
  }
  register(t, e) {
    return this.factories.set(t, e), () => {
      this.factories.get(t) === e && this.factories.delete(t);
    };
  }
  resolve(t) {
    let e = t.constructor;
    for (; e && e !== Object; ) {
      const n = this.factories.get(e);
      if (n) return n;
      e = Object.getPrototypeOf(e);
    }
  }
  render(t) {
    const e = this.resolve(t);
    return e ? a(e, { model: t }) : null;
  }
}
const p = u(
  new s()
);
function C() {
  return f(p);
}
const [m] = g(
  "reactComponentRegistry",
  () => new s()
);
function h(r, t, e) {
  return m(r).register(t, e);
}
function w({
  model: r
}) {
  return C().render(r);
}
export {
  p as ComponentRegistryContext,
  s as ReactComponentRegistry,
  w as RenderSlot,
  m as getReactComponentRegistry,
  h as registerComponent,
  C as useComponentRegistry
};
