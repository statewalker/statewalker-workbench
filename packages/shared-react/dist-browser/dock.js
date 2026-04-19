import { g as s } from "./tree-DPPIyetn.js";
import { a as M, c as P, f as v, b as S, i as x, d as A, u as I, e as k } from "./tree-DPPIyetn.js";
function m(p) {
  const o = /* @__PURE__ */ new Map();
  for (const e of p) {
    const a = e.area || "center", n = o.get(a) ?? [];
    n.push(e), o.set(a, n);
  }
  function u(e) {
    return {
      id: e.key,
      title: e.label,
      icon: e.icon,
      panelModel: e.content,
      closable: e.closable
    };
  }
  function i(e, a) {
    var b;
    const n = a.map(u);
    return {
      id: `area-${e}`,
      tabs: n,
      activeTabId: ((b = n[0]) == null ? void 0 : b.id) ?? null
    };
  }
  const g = o.get("center") ?? [], r = i("center", g);
  if (o.size <= 1) return r;
  let t = r;
  const l = o.get("right");
  l && (t = {
    id: s(),
    direction: "horizontal",
    children: [t, i("right", l)],
    sizes: [70, 30]
  });
  const c = o.get("left");
  c && (t = {
    id: s(),
    direction: "horizontal",
    children: [i("left", c), t],
    sizes: [25, 75]
  });
  const d = o.get("top");
  d && (t = {
    id: s(),
    direction: "vertical",
    children: [i("top", d), t],
    sizes: [30, 70]
  });
  const f = o.get("bottom");
  return f && (t = {
    id: s(),
    direction: "vertical",
    children: [t, i("bottom", f)],
    sizes: [70, 30]
  }), t;
}
export {
  M as addTabToPanel,
  P as calculateDropPosition,
  v as findAndRemoveTab,
  S as findPanel,
  s as generateId,
  x as isPanel,
  A as isSplit,
  m as panelsToTree,
  I as updatePanelActiveTab,
  k as updateSplitSizes
};
