function p(t, r, n) {
  if (!n) return "center";
  const i = (t - n.left) / n.width, c = (r - n.top) / n.height, l = 0.3, s = i, b = 1 - i, f = c, e = 1 - c, u = Math.min(s, b, f, e);
  return u > l ? "center" : u === s ? "left" : u === b ? "right" : u === f ? "top" : "bottom";
}
function h(t) {
  return "tabs" in t;
}
function w(t) {
  return "direction" in t;
}
function o() {
  return Math.random().toString(36).substring(2, 11);
}
function T(t, r, n) {
  var f;
  if (h(t)) {
    if (t.id === r) {
      const e = t.tabs.findIndex((d) => d.id === n);
      if (e === -1) return { node: t, tab: null };
      const u = t.tabs[e], a = t.tabs.filter((d) => d.id !== n);
      if (a.length === 0)
        return { node: null, tab: u };
      const m = t.activeTabId === n ? ((f = a[Math.min(e, a.length - 1)]) == null ? void 0 : f.id) ?? null : t.activeTabId;
      return {
        node: { ...t, tabs: a, activeTabId: m },
        tab: u
      };
    }
    return { node: t, tab: null };
  }
  let i = null;
  const c = [], l = [];
  for (let e = 0; e < t.children.length; e++) {
    const u = t.children[e], a = T(u, r, n);
    a.tab && !i && (i = a.tab), a.node && (c.push(a.node), l.push(t.sizes[e]));
  }
  if (c.length === 0)
    return { node: null, tab: i };
  if (c.length === 1)
    return { node: c[0], tab: i };
  const s = l.reduce((e, u) => e + u, 0), b = l.map((e) => e / s * 100);
  return {
    node: { ...t, children: c, sizes: b },
    tab: i
  };
}
function g(t, r, n, i) {
  if (h(t)) {
    if (t.id === r) {
      if (i === "center")
        return {
          ...t,
          tabs: [...t.tabs, n],
          activeTabId: n.id
        };
      const c = {
        id: o(),
        tabs: [n],
        activeTabId: n.id
      }, l = i === "left" || i === "right" ? "horizontal" : "vertical", s = i === "left" || i === "top" ? [c, t] : [t, c];
      return {
        id: o(),
        direction: l,
        children: s,
        sizes: [50, 50]
      };
    }
    return t;
  }
  return {
    ...t,
    children: t.children.map(
      (c) => g(c, r, n, i)
    )
  };
}
function v(t, r) {
  if (h(t))
    return t.id === r ? t : null;
  for (const n of t.children) {
    const i = v(n, r);
    if (i) return i;
  }
  return null;
}
function z(t, r, n) {
  return h(t) ? t.id === r ? { ...t, activeTabId: n } : t : {
    ...t,
    children: t.children.map(
      (i) => z(i, r, n)
    )
  };
}
function S(t, r, n) {
  return h(t) ? t : t.id === r ? { ...t, sizes: n } : {
    ...t,
    children: t.children.map(
      (i) => S(i, r, n)
    )
  };
}
export {
  g as a,
  v as b,
  p as c,
  w as d,
  S as e,
  T as f,
  o as g,
  h as i,
  z as u
};
