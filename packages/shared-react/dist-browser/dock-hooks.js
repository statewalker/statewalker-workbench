import { createContext as y, useContext as H, useState as P, useEffect as R, useCallback as e, useRef as I } from "react";
import { jsx as G } from "react/jsx-runtime";
import { b as O, f as q, a as J, u as K, e as M, c as N } from "./tree-DPPIyetn.js";
const j = y(null), Z = j.Provider;
function _() {
  return H(j);
}
const U = y(null);
function $() {
  const T = H(U);
  if (!T)
    throw new Error("useDockLayout must be used within a DockProvider");
  return T;
}
function tt({ children: T, initialLayout: f }) {
  const [d, u] = P(f), [C, g] = P(null), [, p] = P(null), [D, m] = P(null);
  R(() => {
    u(f);
  }, [f]);
  const E = e((n, r) => {
    g({ tabId: n, sourcePanelId: r });
  }, []), s = e(() => {
    g(null), p(null);
  }, []), B = e(
    (n) => {
      p(n);
    },
    []
  ), x = e(
    (n, r, o) => {
      const c = C;
      if (g(null), p(null), !!c) {
        if (c.sourcePanelId === n) {
          const l = O(d, c.sourcePanelId);
          if (!l || l.tabs.length <= 1)
            return;
        }
        m({
          tabId: c.tabId,
          sourcePanelId: c.sourcePanelId,
          targetPanelId: n,
          suggestedPosition: r,
          dropCoords: o
        });
      }
    },
    [C, d]
  ), v = e(
    (n, r, o, c) => {
      u((l) => {
        if (r === o && c === "center")
          return l;
        if (r === o && c !== "center") {
          const w = O(l, r);
          if (w && w.tabs.length <= 1)
            return l;
        }
        const { node: h, tab: k } = q(
          l,
          r,
          n
        );
        return !k || !h ? l : J(h, o, k, c);
      });
    },
    []
  ), z = e(
    (n) => {
      D && (v(
        D.tabId,
        D.sourcePanelId,
        D.targetPanelId,
        n
      ), m(null));
    },
    [D, v]
  ), b = e(() => {
    m(null);
  }, []), L = e((n, r) => {
    u((o) => {
      const { node: c } = q(o, n, r);
      return c || o;
    });
  }, []), S = e((n, r) => {
    u((o) => K(o, n, r));
  }, []), i = e((n, r) => {
    u((o) => M(o, n, r));
  }, []);
  return /* @__PURE__ */ G(
    U.Provider,
    {
      value: {
        root: d,
        dragState: C,
        pendingDrop: D,
        startDrag: E,
        endDrag: s,
        setDropTarget: B,
        requestDrop: x,
        confirmDrop: z,
        cancelDrop: b,
        moveTab: v,
        closeTab: L,
        setActiveTab: S,
        updateSizes: i
      },
      children: T
    }
  );
}
function et(T) {
  const {
    isDragging: f,
    hasPendingDrop: d,
    pendingDropPosition: u,
    onDragStart: C,
    onDragEnd: g,
    onRequestDrop: p,
    onConfirmDrop: D,
    onCancelDrop: m,
    isDragEvent: E
  } = T, s = I(null), B = I(null), [x, v] = P(null), [z, b] = P(!1), [L, S] = P("center"), i = e(
    (t) => E ? E(t) : f,
    [E, f]
  ), n = e(
    (t, a) => {
      t.dataTransfer.effectAllowed = "move", t.dataTransfer.setData("text/plain", a), C(a);
    },
    [C]
  ), r = e(() => {
    g == null || g();
  }, [g]), o = e(
    (t) => {
      t.preventDefault(), i(t) && (t.dataTransfer.dropEffect = "move");
    },
    [i]
  ), c = e(
    (t) => {
      t.preventDefault(), i(t) && (s.current && v(s.current.getBoundingClientRect()), b(!0));
    },
    [i]
  ), l = e(
    (t) => {
      var A;
      if (!i(t)) return;
      const a = (A = s.current) == null ? void 0 : A.getBoundingClientRect();
      if (a) {
        const { clientX: X, clientY: Y } = t;
        (X < a.left || X > a.right || Y < a.top || Y > a.bottom) && b(!1);
      }
    },
    [i]
  ), h = e(
    (t) => {
      if (!i(t)) return;
      t.preventDefault(), t.stopPropagation();
      const a = N(
        t.clientX,
        t.clientY,
        x
      );
      S(a), p(a, { x: t.clientX, y: t.clientY }), s.current && v(s.current.getBoundingClientRect()), b(!1);
    },
    [i, x, p]
  ), k = e((t) => {
    t.preventDefault(), t.dataTransfer.dropEffect = "move";
  }, []), w = e((t) => {
    t.preventDefault();
  }, []), F = e(
    (t) => {
      t.preventDefault(), t.stopPropagation(), S("center"), p("center", { x: t.clientX, y: t.clientY }), s.current && v(s.current.getBoundingClientRect()), b(!1);
    },
    [p]
  );
  return R(() => {
    d && u && S(u);
  }, [d, u]), R(() => {
    if (!d) return;
    const t = (A) => {
      A.target.closest("[data-drop-confirmation]") || m();
    }, a = setTimeout(() => {
      document.addEventListener("click", t);
    }, 100);
    return () => {
      clearTimeout(a), document.removeEventListener("click", t);
    };
  }, [d, m]), R(() => {
    f || b(!1);
  }, [f]), R(() => {
    const t = () => {
      s.current && v(s.current.getBoundingClientRect());
    };
    return window.addEventListener("resize", t), () => window.removeEventListener("resize", t);
  }, []), {
    panelRef: s,
    contentRef: B,
    isHovering: z,
    selectedPosition: L,
    containerRect: x,
    handlers: {
      tabDragStart: n,
      tabDragEnd: r,
      contentDragOver: o,
      contentDragEnter: c,
      contentDragLeave: l,
      contentDrop: h,
      tabBarDragOver: k,
      tabBarDragEnter: w,
      tabBarDrop: F
    },
    confirmation: {
      selectPosition: S,
      confirm: D,
      cancel: m
    }
  };
}
export {
  Z as ActivePanelProvider,
  tt as DockProvider,
  _ as useActivePanel,
  $ as useDockLayout,
  et as usePanelDnd
};
