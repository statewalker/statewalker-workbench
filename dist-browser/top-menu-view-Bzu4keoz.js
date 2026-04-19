var b = Object.defineProperty;
var f = (t, s, e) => s in t ? b(t, s, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[s] = e;
var a = (t, s, e) => f(t, typeof s != "symbol" ? s + "" : s, e);
import { newAdapter as o } from "@statewalker/shared-adapters";
import { BaseClass as u } from "@statewalker/shared-baseclass";
const g = /* @__PURE__ */ new Map();
function w(t) {
  const s = (g.get(t) ?? 0) + 1;
  return g.set(t, s), `${t}-${s}`;
}
class d extends u {
  constructor(e) {
    super();
    a(this, "key");
    this.key = (e == null ? void 0 : e.key) ?? w(this.constructor.name);
  }
}
class r extends u {
  constructor() {
    super(...arguments);
    a(this, "_items", []);
  }
  add(e) {
    return this._items = [...this._items, e], this.notify(), () => this.remove(e);
  }
  remove(e) {
    this._items.indexOf(e) >= 0 && (this._items = this._items.filter((n) => n !== e), this.notify());
  }
  getAll() {
    return this._items;
  }
  get length() {
    return this._items.length;
  }
}
function h(t) {
  function s(i, n) {
    return t(i).add(n);
  }
  function e(i, n) {
    const l = t(i), c = l.getAll();
    return c.length > 0 && n(c), l.onUpdate(() => n(l.getAll()));
  }
  return [s, e];
}
class y extends d {
  constructor() {
    super(...arguments);
    a(this, "activePanelKey", null);
  }
  setActivePanel(e) {
    this.activePanelKey !== e && (this.activePanelKey = e, this.notify());
  }
}
const [m] = o(
  "model:activePanel",
  () => new y()
);
function R(t, s) {
  m(t).setActivePanel(s);
}
class p extends r {
}
const [x] = o(
  "aspect:context-menu",
  () => new p()
), [B, U] = h(x);
class V extends r {
  getTopmost() {
    const s = this.getAll();
    return s.length > 0 ? s[s.length - 1] : null;
  }
}
const [_] = o(
  "aspect:dialogs",
  () => new V()
), [O, S] = h(_);
class P extends u {
  constructor() {
    super(...arguments);
    a(this, "_bindings", /* @__PURE__ */ new Map());
  }
  /**
   * Register a key binding. Returns a cleanup function that removes it.
   */
  bind(e) {
    const { key: i } = e;
    let n = this._bindings.get(i);
    return n || (n = [], this._bindings.set(i, n)), n.push(e), this.notify(), () => {
      const l = this._bindings.get(i);
      if (l) {
        const c = l.indexOf(e);
        c >= 0 && l.splice(c, 1), l.length === 0 && this._bindings.delete(i);
      }
      this.notify();
    };
  }
  /**
   * Register multiple bindings at once. Returns a single cleanup function.
   */
  bindAll(e) {
    const i = e.map((n) => this.bind(n));
    return () => {
      for (const n of i) n();
    };
  }
  /**
   * Get all bindings for a key. Returns empty array if none.
   */
  getBindings(e) {
    return this._bindings.get(e) ?? [];
  }
  /**
   * Whether any bindings are registered.
   */
  get hasBindings() {
    return this._bindings.size > 0;
  }
}
const [$] = o(
  "model:keyboard",
  () => new P()
);
class j extends d {
  constructor(e) {
    super({ key: e.key });
    a(this, "label");
    a(this, "icon");
    a(this, "content");
    a(this, "area");
    a(this, "closable");
    this.label = e.label, this.icon = e.icon, this.content = e.content, this.area = e.area ?? "center", this.closable = e.closable ?? !1;
  }
}
const [A] = o(
  "aspect:panel-registry",
  () => new r()
), [q, z] = h(A);
class M extends r {
}
const [v] = o(
  "aspect:toolbar",
  () => new M()
), [I, E] = h(v);
class k extends r {
}
const [T] = o(
  "aspect:top-menu",
  () => new k()
), [F, G] = h(T);
export {
  y as A,
  p as C,
  V as D,
  P as K,
  M as T,
  r as U,
  d as V,
  j as a,
  k as b,
  R as c,
  x as d,
  _ as e,
  $ as f,
  m as g,
  v as h,
  T as i,
  S as j,
  G as k,
  U as l,
  z as m,
  E as n,
  O as o,
  B as p,
  F as q,
  q as r,
  I as s,
  h as t
};
