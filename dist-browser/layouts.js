import { jsx as t, jsxs as C } from "react/jsx-runtime";
import { View as K, Flex as j, MenuTrigger as G, ActionButton as V, Text as N, Menu as J, Item as Z, DialogContainer as ee, Dialog as te, Heading as ne, Content as oe } from "@adobe/react-spectrum";
import { newAdapter as re } from "@repo/shared-adapters";
import { useComponentRegistry as ie, ReactComponentRegistry as le, ComponentRegistryContext as ae } from "@repo/shared-react/component-registry";
import { getDialogStackView as ce, getToolbarView as se, getTopMenuView as de, listenPanel as ue, getActivePanelView as ge, getKeyboardView as pe } from "@repo/shared-views";
import he, { createContext as F, useState as I, useEffect as R, useCallback as D, useContext as H, useRef as fe, useMemo as W } from "react";
import { findPanel as X, findAndRemoveTab as _, addTabToPanel as me, updatePanelActiveTab as be, updateSplitSizes as ve, panelsToTree as ye, calculateDropPosition as Se, isPanel as xe, isSplit as De } from "@repo/shared-react/dock";
import { Group as we, Panel as ke, Separator as Ce } from "react-resizable-panels";
const q = F(null);
function U() {
  const e = H(q);
  if (!e) throw new Error("useDockLayout must be used within DockProvider");
  return e;
}
function Te(e) {
  return ye(
    e.map((o) => ({
      key: o.key,
      label: o.label,
      icon: o.icon,
      area: o.area,
      closable: o.closable,
      content: o
    }))
  );
}
function Pe({
  children: e,
  initialLayout: o
}) {
  const [i, c] = I(o), [g, m] = I(null), [p, l] = I(null);
  R(() => c(o), [o]);
  const w = D(
    (f, d) => m({ tabId: f, sourcePanelId: d }),
    []
  ), S = D(() => m(null), []), T = D(
    (f, d, a) => {
      const r = g;
      if (m(null), !!r) {
        if (r.sourcePanelId === f) {
          const v = X(i, r.sourcePanelId);
          if (!v || v.tabs.length <= 1) return;
        }
        l({
          tabId: r.tabId,
          sourcePanelId: r.sourcePanelId,
          targetPanelId: f,
          suggestedPosition: d,
          dropCoords: a
        });
      }
    },
    [g, i]
  ), b = D(
    (f, d, a, r) => {
      c((v) => {
        if (d === a && r === "center")
          return v;
        if (d === a && r !== "center") {
          const z = X(v, d);
          if (z && z.tabs.length <= 1) return v;
        }
        const { node: y, tab: E } = _(v, d, f);
        return !E || !y ? v : me(y, a, E, r);
      });
    },
    []
  ), s = D(
    (f) => {
      p && (b(
        p.tabId,
        p.sourcePanelId,
        p.targetPanelId,
        f
      ), l(null));
    },
    [p, b]
  ), k = D(() => l(null), []), A = D((f, d) => {
    c((a) => {
      const { node: r } = _(a, f, d);
      return r || a;
    });
  }, []), x = D((f, d) => {
    c((a) => be(a, f, d));
  }, []), h = D((f, d) => {
    c((a) => ve(a, f, d));
  }, []);
  return /* @__PURE__ */ t(
    q.Provider,
    {
      value: {
        root: i,
        dragState: g,
        pendingDrop: p,
        startDrag: w,
        endDrag: S,
        requestDrop: T,
        confirmDrop: s,
        cancelDrop: k,
        moveTab: b,
        closeTab: A,
        setActiveTab: x,
        updateSizes: h
      },
      children: e
    }
  );
}
const Ae = [
  { position: "top", label: "Split top", icon: "↑", gridArea: "1 / 2 / 2 / 3" },
  { position: "left", label: "Split left", icon: "←", gridArea: "2 / 1 / 3 / 2" },
  { position: "center", label: "Add as Tab", icon: "⊞", gridArea: "2 / 2 / 3 / 3" },
  { position: "right", label: "Split right", icon: "→", gridArea: "2 / 3 / 3 / 4" },
  { position: "bottom", label: "Split bottom", icon: "↓", gridArea: "3 / 2 / 4 / 3" }
];
function Ie({
  selectedPosition: e,
  onSelectPosition: o,
  onConfirm: i,
  onCancel: c,
  dropCoords: g,
  containerRect: m
}) {
  const { colorScheme: p } = O(), l = p === "dark";
  if (!m) return null;
  const w = 140, S = 130;
  let T = g.x - m.left - w / 2, b = g.y - m.top - S / 2;
  return T = Math.max(8, Math.min(T, m.width - w - 8)), b = Math.max(8, Math.min(b, m.height - S - 8)), /* @__PURE__ */ t(
    "div",
    {
      role: "dialog",
      style: { position: "absolute", left: T, top: b, zIndex: 50 },
      onClick: (s) => s.stopPropagation(),
      onKeyDown: (s) => s.stopPropagation(),
      children: /* @__PURE__ */ C(
        "div",
        {
          style: {
            background: l ? "#1e1e1e" : "#fff",
            border: `1px solid ${l ? "#555" : "#ccc"}`,
            borderRadius: 12,
            padding: 12,
            boxShadow: l ? "0 8px 32px rgba(0,0,0,0.5)" : "0 8px 32px rgba(0,0,0,0.15)",
            position: "relative"
          },
          children: [
            /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                onClick: (s) => {
                  s.preventDefault(), s.stopPropagation(), c();
                },
                style: {
                  position: "absolute",
                  top: -8,
                  right: -8,
                  width: 22,
                  height: 22,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  border: "none",
                  background: "var(--spectrum-global-color-red-500, #e34850)",
                  color: "white",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: "bold",
                  lineHeight: 1,
                  zIndex: 10
                },
                title: "Cancel",
                children: "✕"
              }
            ),
            /* @__PURE__ */ t(
              "div",
              {
                style: {
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 36px)",
                  gridTemplateRows: "repeat(3, 32px)",
                  gap: 6
                },
                children: Ae.map(({ position: s, icon: k, gridArea: A }) => {
                  const x = e === s;
                  return /* @__PURE__ */ t(
                    "button",
                    {
                      type: "button",
                      style: {
                        gridArea: A,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 8,
                        border: x ? "2px solid var(--spectrum-global-color-blue-500, #1473e6)" : "2px solid transparent",
                        background: x ? "#1473e6" : l ? "#333" : "#e8e8e8",
                        color: x ? "white" : l ? "#ccc" : "#444",
                        cursor: "pointer",
                        fontSize: 16,
                        transition: "all 0.15s",
                        transform: x ? "scale(1.05)" : "scale(1)"
                      },
                      onClick: (h) => {
                        h.preventDefault(), h.stopPropagation(), i(s);
                      },
                      onMouseEnter: () => o(s),
                      title: s === "center" ? "Add as tab" : `Split ${s}`,
                      children: k
                    },
                    s
                  );
                })
              }
            ),
            /* @__PURE__ */ t(
              "div",
              {
                style: {
                  marginTop: 8,
                  textAlign: "center",
                  fontSize: 11,
                  fontWeight: 500,
                  color: l ? "#999" : "#666"
                },
                children: e === "center" ? "Add as Tab" : `Split ${e}`
              }
            )
          ]
        }
      )
    }
  );
}
function Ee({ panel: e }) {
  const {
    closeTab: o,
    setActiveTab: i,
    dragState: c,
    startDrag: g,
    endDrag: m,
    requestDrop: p,
    pendingDrop: l,
    confirmDrop: w,
    cancelDrop: S
  } = U(), T = ie(), b = fe(null), s = e.tabs.find((n) => n.id === e.activeTabId), k = s == null ? void 0 : s.panelModel, A = k ? T.resolve(k.content) : null, x = c !== null, h = (l == null ? void 0 : l.targetPanelId) === e.id, { colorScheme: f } = O(), d = f === "dark", [a, r] = I("center"), [v, y] = I(null);
  R(() => {
    h && (l != null && l.suggestedPosition) && r(l.suggestedPosition);
  }, [h, l == null ? void 0 : l.suggestedPosition]), R(() => {
    if (!h) return;
    const n = (u) => {
      u.target.closest("[role=dialog]") || S();
    }, P = setTimeout(
      () => document.addEventListener("click", n),
      100
    );
    return () => {
      clearTimeout(P), document.removeEventListener("click", n);
    };
  }, [h, S]);
  const E = D(
    (n) => {
      var B;
      n.preventDefault(), n.stopPropagation();
      const P = ((B = b.current) == null ? void 0 : B.getBoundingClientRect()) ?? null;
      y(P);
      const u = Se(n.clientX, n.clientY, P);
      r(u), p(e.id, u, { x: n.clientX, y: n.clientY });
    },
    [e.id, p]
  ), z = D(
    (n) => {
      n.preventDefault(), n.stopPropagation(), b.current && y(b.current.getBoundingClientRect()), r("center"), p(e.id, "center", { x: n.clientX, y: n.clientY });
    },
    [e.id, p]
  ), M = (n) => {
    const u = {
      position: "absolute",
      background: d ? "rgba(20, 115, 230, 0.15)" : "rgba(20, 115, 230, 0.08)",
      boxShadow: "inset 0 0 0 2px #1473e6",
      borderRadius: 4,
      pointerEvents: "none",
      transition: "all 0.2s"
    };
    if (n === "center" && h && a === "center")
      return { ...u, inset: 0 };
    if (a === n) {
      if (n === "left") return { ...u, left: 0, top: 0, width: "50%", height: "100%" };
      if (n === "right") return { ...u, right: 0, top: 0, width: "50%", height: "100%" };
      if (n === "top") return { ...u, left: 0, top: 0, width: "100%", height: "50%" };
      if (n === "bottom") return { ...u, left: 0, bottom: 0, width: "100%", height: "50%" };
    }
  };
  return /* @__PURE__ */ t(
    "div",
    {
      ref: b,
      style: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden"
      },
      children: /* @__PURE__ */ C(
        K,
        {
          borderRadius: "regular",
          borderWidth: "thin",
          borderColor: "dark",
          overflow: "hidden",
          height: "100%",
          UNSAFE_style: { display: "flex", flexDirection: "column", position: "relative" },
          children: [
            /* @__PURE__ */ C(
              "div",
              {
                style: {
                  display: "flex",
                  alignItems: "center",
                  minHeight: 36,
                  overflowX: "auto",
                  paddingInline: 4,
                  borderBottom: "1px solid var(--spectrum-alias-border-color-mid, rgba(255,255,255,0.1))"
                },
                onDragOver: (n) => {
                  n.preventDefault(), n.dataTransfer.dropEffect = "move";
                },
                onDrop: z,
                children: [
                  e.tabs.map((n) => {
                    const P = n.id === e.activeTabId;
                    return /* @__PURE__ */ C(
                      "div",
                      {
                        role: "tab",
                        tabIndex: 0,
                        "aria-selected": P,
                        draggable: !0,
                        onDragStart: (u) => {
                          u.dataTransfer.effectAllowed = "move", u.dataTransfer.setData("text/plain", n.id), g(n.id, e.id);
                        },
                        onDragEnd: () => m(),
                        onClick: () => i(e.id, n.id),
                        onKeyDown: (u) => {
                          (u.key === "Enter" || u.key === " ") && (u.preventDefault(), i(e.id, n.id));
                        },
                        style: {
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "6px 12px",
                          fontSize: 13,
                          cursor: "grab",
                          userSelect: "none",
                          position: "relative",
                          color: P ? "var(--spectrum-alias-text-color, inherit)" : "var(--spectrum-alias-text-color-disabled, #999)",
                          borderBottom: P ? "2px solid var(--spectrum-global-color-blue-500, #1473e6)" : "2px solid transparent",
                          whiteSpace: "nowrap"
                        },
                        children: [
                          /* @__PURE__ */ t("span", { style: { maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis" }, children: n.title }),
                          n.closable !== !1 && /* @__PURE__ */ t(
                            "button",
                            {
                              type: "button",
                              onClick: (u) => {
                                u.stopPropagation(), o(e.id, n.id);
                              },
                              style: {
                                marginLeft: 4,
                                padding: "0 4px",
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                                color: "inherit",
                                opacity: 0.4,
                                fontSize: 14,
                                lineHeight: 1
                              },
                              children: "×"
                            }
                          )
                        ]
                      },
                      n.id
                    );
                  }),
                  x && /* @__PURE__ */ t(
                    "div",
                    {
                      style: {
                        flex: 1,
                        minWidth: 60,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontStyle: "italic",
                        opacity: 0.4
                      },
                      children: "Drop here"
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ C(
              "div",
              {
                style: { flex: 1, position: "relative", overflow: "hidden" },
                children: [
                  /* @__PURE__ */ t(
                    "div",
                    {
                      style: { position: "absolute", inset: 0, overflow: "auto" },
                      onDragOver: (n) => {
                        n.preventDefault(), x && (n.dataTransfer.dropEffect = "move");
                      },
                      onDrop: E,
                      children: A && k && /* @__PURE__ */ t("div", { style: { display: "flex", flexDirection: "column", minHeight: "100%" }, children: /* @__PURE__ */ t(A, { model: k.content }) })
                    }
                  ),
                  h && a !== "center" && /* @__PURE__ */ t("div", { style: M(a) }),
                  h && a === "center" && /* @__PURE__ */ t("div", { style: M("center") }),
                  h && l && /* @__PURE__ */ t(
                    "div",
                    {
                      style: { position: "absolute", inset: 0, pointerEvents: "none" },
                      children: /* @__PURE__ */ t("div", { style: { pointerEvents: "auto" }, children: /* @__PURE__ */ t(
                        Ie,
                        {
                          selectedPosition: a,
                          onSelectPosition: r,
                          onConfirm: w,
                          onCancel: S,
                          dropCoords: l.dropCoords,
                          containerRect: v
                        }
                      ) })
                    }
                  )
                ]
              }
            )
          ]
        }
      )
    }
  );
}
function ze({ split: e }) {
  const { updateSizes: o } = U();
  return /* @__PURE__ */ t(
    we,
    {
      orientation: e.direction,
      onLayoutChange: (i) => {
        const c = e.children.map((g) => i[g.id] ?? 0);
        o(e.id, c);
      },
      style: { height: "100%", width: "100%" },
      children: e.children.map((i, c) => /* @__PURE__ */ C(he.Fragment, { children: [
        /* @__PURE__ */ t(
          ke,
          {
            id: i.id,
            defaultSize: e.sizes[c],
            minSize: 10,
            style: { position: "relative" },
            children: /* @__PURE__ */ t(Q, { node: i })
          }
        ),
        c < e.children.length - 1 && /* @__PURE__ */ t(
          Ce,
          {
            style: {
              width: e.direction === "horizontal" ? 4 : void 0,
              height: e.direction === "vertical" ? 4 : void 0,
              background: "transparent",
              cursor: e.direction === "horizontal" ? "col-resize" : "row-resize"
            }
          }
        )
      ] }, i.id))
    }
  );
}
function Q({ node: e }) {
  return xe(e) ? /* @__PURE__ */ t(Ee, { panel: e }) : De(e) ? /* @__PURE__ */ t(ze, { split: e }) : null;
}
function Re() {
  const { root: e } = U();
  return /* @__PURE__ */ t(
    K,
    {
      height: "100%",
      width: "100%",
      overflow: "hidden",
      padding: "size-50",
      children: /* @__PURE__ */ t(Q, { node: e })
    }
  );
}
const Y = F(null);
function Xe() {
  return H(Y);
}
const [Me] = re(
  "aspect:component-registry",
  () => new le()
), $ = F({ colorScheme: "dark", toggle: () => {
} });
function O() {
  return H($);
}
function L(e) {
  const [o, i] = I(e.getAll());
  return R(() => (i(e.getAll()), e.onUpdate(() => i(e.getAll()))), [e]), o;
}
function _e({ context: e, wrapper: o }) {
  const i = W(() => Me(e), [e]), c = ce(e), g = se(e), m = de(e), [p, l] = I([]);
  R(() => ue(e, l), [e]);
  const w = L(c), S = L(g), T = L(m), b = W(() => Te(p), [p]), s = ge(e), [k, A] = I(() => {
    try {
      return localStorage.getItem("theme") ?? "dark";
    } catch {
      return "dark";
    }
  }), x = () => {
    A((a) => {
      const r = a === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("theme", r);
      } catch {
      }
      return document.documentElement.classList.toggle("dark", r === "dark"), r;
    });
  }, h = pe(e);
  R(() => {
    function a(r) {
      var M;
      const v = (M = document.activeElement) == null ? void 0 : M.tagName;
      if (v === "INPUT" || v === "TEXTAREA" || v === "SELECT" || document.querySelector("[role=dialog]")) return;
      const y = [];
      (r.ctrlKey || r.metaKey) && y.push("Ctrl"), r.shiftKey && y.push("Shift"), r.altKey && y.push("Alt"), y.push(r.key);
      const E = y.length > 1 ? y.join("+") : r.key, z = h.getBindings(E).length > 0 ? h.getBindings(E) : h.getBindings(r.key);
      for (const n of z)
        n.preventDefault !== !1 && r.preventDefault(), n.execute();
    }
    return document.addEventListener("keydown", a), () => document.removeEventListener("keydown", a);
  }, [h]);
  const f = w.length > 0 ? w[w.length - 1] : void 0, d = /* @__PURE__ */ t(ae.Provider, { value: i, children: /* @__PURE__ */ C(j, { direction: "column", height: "100%", width: "100%", children: [
    /* @__PURE__ */ t(Ke, { menus: T }),
    /* @__PURE__ */ t(K, { flex: !0, UNSAFE_style: { overflow: "hidden" }, children: /* @__PURE__ */ t(Y.Provider, { value: s, children: /* @__PURE__ */ t(Pe, { initialLayout: b, children: /* @__PURE__ */ t(Re, {}) }) }) }),
    S.length > 0 && /* @__PURE__ */ t(Be, { actions: S }),
    /* @__PURE__ */ t(Le, { dialog: f, registry: i })
  ] }) });
  return /* @__PURE__ */ t($.Provider, { value: { colorScheme: k, toggle: x }, children: o ? /* @__PURE__ */ t(o, { children: d }) : d });
}
function Ke({ menus: e }) {
  const { colorScheme: o, toggle: i } = O();
  return /* @__PURE__ */ C(
    j,
    {
      alignItems: "center",
      gap: "size-25",
      UNSAFE_style: {
        paddingInline: 8,
        minHeight: 36,
        borderBottom: "1px solid var(--spectrum-alias-border-color-mid, rgba(255,255,255,0.1))"
      },
      children: [
        e.map((c) => /* @__PURE__ */ C(G, { children: [
          /* @__PURE__ */ t(V, { isQuiet: !0, children: /* @__PURE__ */ t(N, { children: c.label ?? c.actionKey }) }),
          /* @__PURE__ */ t(
            J,
            {
              onAction: (g) => {
                const m = c.children.find((p) => p.actionKey === g);
                m == null || m.submit();
              },
              children: c.children.map((g) => /* @__PURE__ */ t(Z, { children: g.label ?? g.actionKey }, g.actionKey))
            }
          )
        ] }, c.actionKey)),
        /* @__PURE__ */ t(K, { flex: !0 }),
        /* @__PURE__ */ t(V, { isQuiet: !0, onPress: i, "aria-label": "Toggle theme", children: /* @__PURE__ */ t(N, { children: o === "dark" ? "☀" : "🌙" }) })
      ]
    }
  );
}
function Be({ actions: e }) {
  return /* @__PURE__ */ t(
    j,
    {
      alignItems: "center",
      justifyContent: "center",
      gap: "size-50",
      UNSAFE_style: {
        paddingInline: 8,
        paddingBlock: 4,
        borderTop: "1px solid var(--spectrum-alias-border-color-mid, rgba(255,255,255,0.1))"
      },
      children: e.map((o) => /* @__PURE__ */ t(
        V,
        {
          isQuiet: !0,
          isDisabled: o.disabled,
          onPress: () => o.submit(),
          children: /* @__PURE__ */ t(N, { children: o.label ?? o.actionKey })
        },
        o.actionKey
      ))
    }
  );
}
function Le({
  dialog: e,
  registry: o
}) {
  if (!e) return null;
  const i = o.resolve(e);
  return i ? /* @__PURE__ */ t(ee, { onDismiss: () => {
  }, children: /* @__PURE__ */ C(te, { children: [
    /* @__PURE__ */ t(ne, { children: typeof e.header == "string" ? e.header : "Dialog" }),
    /* @__PURE__ */ t(oe, { children: /* @__PURE__ */ t(i, { model: e }) })
  ] }) }) : null;
}
export {
  Pe as DockProvider,
  _e as SpectrumAppShell,
  Re as SpectrumDockLayout,
  Ee as SpectrumDockPanel,
  Me as getComponentRegistry,
  Te as panelsToTreeFromViews,
  Xe as useActivePanelView,
  O as useColorScheme,
  U as useDockLayout
};
