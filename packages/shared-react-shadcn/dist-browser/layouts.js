import { newAdapter as ee } from "@statewalker/shared-adapters";
import {
  ComponentRegistryContext as ne,
  useComponentRegistry as re,
  ReactComponentRegistry as te,
} from "@statewalker/shared-react/component-registry";
import {
  updatePanelActiveTab as at,
  isPanel as ct,
  calculateDropPosition as dt,
  panelsToTree as lt,
  addTabToPanel as ot,
  findAndRemoveTab as q,
  panelsToTree as Ri,
  updateSplitSizes as st,
  isSplit as ut,
  findPanel as X,
} from "@statewalker/shared-react/dock";
/* empty css               */
import { useUpdates as gt } from "@statewalker/shared-react/hooks";
import {
  CheckboxView as _e,
  CheckboxGroupView as $e,
  TextView as Ae,
  DialogView as Ar,
  getTopMenuView as ae,
  SwitchView as ar,
  JsonView as Be,
  SheetView as Br,
  TagGroupView as be,
  SidebarView as br,
  AvatarView as Ce,
  LinkView as Cr,
  ActionGroupView as ce,
  CollapsibleView as cr,
  ColorSwatchPickerView as De,
  MenuTriggerView as Dr,
  getKeyboardView as de,
  CardView as dr,
  TreeView as Ee,
  NumberFieldView as er,
  RangeCalendarView as Fe,
  ToggleButtonView as fe,
  FlexView as fr,
  BadgeView as Ge,
  FileTriggerView as ge,
  DividerView as gr,
  MeterView as He,
  ColorAreaView as he,
  ActionBarView as hr,
  DatePickerView as Ie,
  getDialogStackView as ie,
  SearchFieldView as ir,
  ToastView as Je,
  InlineAlertView as je,
  DateRangePickerView as Ke,
  LabeledValueView as ke,
  ContextMenuView as kr,
  DateFieldView as Le,
  getActivePanelView as le,
  TextFieldView as lr,
  TableView as Me,
  TooltipView as Mr,
  ListView as me,
  ScrollAreaView as mr,
  WellView as Ne,
  PopoverView as Nr,
  RangeSliderView as nr,
  EmptyView as Oe,
  getToolbarView as oe,
  SliderView as or,
  HeadingView as Pe,
  PaginationView as Pr,
  ListBoxView as pe,
  GridView as pr,
  ComboBoxView as Qe,
  ProgressCircleView as qe,
  ColorSliderView as Re,
  MenuView as Rr,
  PickerView as rr,
  KbdView as Se,
  AlertDialogView as Sr,
  listenPanel as se,
  TextAreaView as sr,
  ImageView as Te,
  TabsView as Tr,
  RadioGroupView as tr,
  SkeletonView as Ue,
  ButtonView as ue,
  ContentPanelView as ur,
  ColorSwatchView as Ve,
  AccordionView as Vr,
  ColorPickerView as ve,
  MenuBarView as vr,
  SpinnerView as We,
  ColorFieldView as we,
  ActionMenuView as wr,
  ProgressBarView as Xe,
  ColorWheelView as xe,
  BreadcrumbView as xr,
  StatusLightView as Ye,
  TimeFieldView as ye,
  FormView as Ze,
  CalendarView as ze,
} from "@statewalker/shared-views";
import {
  ArrowUp as Er,
  GripVertical as Fr,
  Key as Gr,
  MessageSquare as Hr,
  ArrowRight as Ir,
  File as jr,
  ArrowDown as Kr,
  Layers as Lr,
  FolderOpen as Or,
  GripVerticalIcon as qr,
  X as U,
  Sun as Ur,
  Moon as Wr,
  List as Xr,
  Settings as yr,
  ArrowLeft as zr,
} from "lucide-react";
import Yr, {
  useEffect as B,
  useRef as F,
  useMemo as H,
  useState as N,
  useCallback as u,
  createContext as W,
  useContext as Y,
} from "react";
import { jsxs as k, jsx as r, Fragment as Z } from "react/jsx-runtime";
import * as G from "react-resizable-panels";
import { b as _r, a as $r, D as Jr, c as Qr, B as y, d as Zr } from "./dialog-BUL2rVnl.js";
import { M as et, d as it, c as nt, a as rt, b as tt } from "./menubar-SGqF5dkF.js";
import {
  A as An,
  P as Bn,
  e as Cn,
  b as En,
  G as kn,
  S as Ln,
  d as Mn,
  B as Nn,
  E as Pn,
  F as Sn,
  C as Tn,
  J as Vn,
  T as xn,
  D as zn,
} from "./sheet.renderer-GaVVNgCX.js";
import {
  t as _t,
  o as $t,
  K as At,
  a0 as an,
  a2 as Bt,
  y as bn,
  w as bt,
  m as Ct,
  s as cn,
  a6 as Dn,
  j as Dt,
  p as dn,
  C as Et,
  R as en,
  a3 as Ft,
  A as fn,
  d as ft,
  u as Gt,
  V as gn,
  O as Ht,
  z as hn,
  x as ht,
  r as It,
  f as Jt,
  J as jt,
  Q as Kt,
  I as kt,
  q as Lt,
  g as ln,
  a7 as Mt,
  M as mn,
  a5 as mt,
  L as Nt,
  X as nn,
  E as Ot,
  _ as on,
  n as Pt,
  a as pn,
  F as pt,
  N as Qt,
  Y as qt,
  G as Rn,
  i as Rt,
  S as rn,
  H as St,
  a1 as sn,
  c as Tt,
  U as tn,
  Z as Ut,
  T as un,
  k as Vt,
  b as vn,
  h as vt,
  a4 as Wt,
  v as wn,
  $ as wt,
  W as Xt,
  l as xt,
  e as Yt,
  B as yt,
  P as Zt,
  D as zt,
} from "./tooltip.renderer-DkbFTYyQ.js";
import { c as E } from "./utils-gWiv5-6R.js";

const J = W(null);
function O() {
  const e = Y(J);
  if (!e) throw new Error("useDockLayout must be used within a DockProvider");
  return e;
}
function In(e) {
  return lt(
    e.map((t) => ({
      key: t.key,
      label: t.label,
      icon: t.icon,
      area: t.area,
      closable: t.closable,
      content: t,
    })),
  );
}
function Kn({ children: e, initialLayout: t }) {
  const [n, s] = N(t),
    [h, p] = N(null),
    [, D] = N(null),
    [x, w] = N(null);
  B(() => {
    s(t);
  }, [t]);
  const V = u((i, c) => {
      p({ tabId: i, sourcePanelId: c });
    }, []),
    l = u(() => {
      p(null), D(null);
    }, []),
    d = u((i) => {
      D(i);
    }, []),
    v = u(
      (i, c, f) => {
        const b = h;
        if ((p(null), D(null), !!b)) {
          if (b.sourcePanelId === i) {
            const o = X(n, b.sourcePanelId);
            if (!o || o.tabs.length <= 1) return;
          }
          w({
            tabId: b.tabId,
            sourcePanelId: b.sourcePanelId,
            targetPanelId: i,
            suggestedPosition: c,
            dropCoords: f,
          });
        }
      },
      [h, n],
    ),
    g = u((i, c, f, b) => {
      s((o) => {
        if (c === f && b === "center") return o;
        if (c === f && b !== "center") {
          const z = X(o, c);
          if (z && z.tabs.length <= 1) return o;
        }
        const { node: T, tab: S } = q(o, c, i);
        return !S || !T ? o : ot(T, f, S, b);
      });
    }, []),
    M = u(
      (i) => {
        x && (g(x.tabId, x.sourcePanelId, x.targetPanelId, i), w(null));
      },
      [x, g],
    ),
    C = u(() => {
      w(null);
    }, []),
    A = u((i, c) => {
      s((f) => {
        const { node: b } = q(f, i, c);
        return b || f;
      });
    }, []),
    R = u((i, c) => {
      s((f) => at(f, i, c));
    }, []),
    m = u((i, c) => {
      s((f) => st(f, i, c));
    }, []);
  return /* @__PURE__ */ r(J.Provider, {
    value: {
      root: n,
      dragState: h,
      pendingDrop: x,
      startDrag: V,
      endDrag: l,
      setDropTarget: d,
      requestDrop: v,
      confirmDrop: M,
      cancelDrop: C,
      moveTab: g,
      closeTab: A,
      setActiveTab: R,
      updateSizes: m,
    },
    children: e,
  });
}
const Fn = [
  {
    position: "top",
    icon: /* @__PURE__ */ r(Er, { className: "w-4 h-4" }),
    gridArea: "1 / 2 / 2 / 3",
  },
  {
    position: "left",
    icon: /* @__PURE__ */ r(zr, { className: "w-4 h-4" }),
    gridArea: "2 / 1 / 3 / 2",
  },
  {
    position: "center",
    icon: /* @__PURE__ */ r(Lr, { className: "w-4 h-4" }),
    gridArea: "2 / 2 / 3 / 3",
  },
  {
    position: "right",
    icon: /* @__PURE__ */ r(Ir, { className: "w-4 h-4" }),
    gridArea: "2 / 3 / 3 / 4",
  },
  {
    position: "bottom",
    icon: /* @__PURE__ */ r(Kr, { className: "w-4 h-4" }),
    gridArea: "3 / 2 / 4 / 3",
  },
];
function yn({
  selectedPosition: e,
  onSelectPosition: t,
  onConfirm: n,
  onCancel: s,
  dropCoords: h,
  containerRect: p,
}) {
  if (!p) return null;
  const D = 140,
    x = 120;
  let w = h.x - p.left - D / 2,
    V = h.y - p.top - x / 2;
  return (
    (w = Math.max(8, Math.min(w, p.width - D - 8))),
    (V = Math.max(8, Math.min(V, p.height - x - 8))),
    /* @__PURE__ */ r("div", {
      role: "dialog",
      className: "absolute z-50",
      style: { left: w, top: V },
      onClick: (l) => l.stopPropagation(),
      onKeyDown: (l) => l.stopPropagation(),
      children: /* @__PURE__ */ k("div", {
        className: "bg-popover/95 border border-border rounded-xl shadow-2xl p-3 backdrop-blur-md",
        children: [
          /* @__PURE__ */ r("button", {
            type: "button",
            onClick: (l) => {
              l.preventDefault(), l.stopPropagation(), s();
            },
            className:
              "absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-lg hover:scale-110 transition-transform z-10",
            title: "Cancel",
            children: /* @__PURE__ */ r(U, { className: "w-3.5 h-3.5" }),
          }),
          /* @__PURE__ */ r("div", {
            className: "grid gap-1.5",
            style: {
              gridTemplateColumns: "repeat(3, 36px)",
              gridTemplateRows: "repeat(3, 32px)",
            },
            children: Fn.map(({ position: l, icon: d, gridArea: v }) =>
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  style: { gridArea: v },
                  onClick: (g) => {
                    g.preventDefault(), g.stopPropagation(), n(l);
                  },
                  onMouseEnter: () => t(l),
                  className: E(
                    "flex items-center justify-center rounded-lg transition-all duration-150",
                    "border-2 font-medium",
                    e === l
                      ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                      : "bg-muted/80 text-muted-foreground border-transparent hover:bg-muted hover:border-border/50",
                  ),
                  title: l === "center" ? "Add as tab" : `Split ${l}`,
                  children: d,
                },
                l,
              ),
            ),
          }),
          /* @__PURE__ */ r("div", {
            className: "mt-2 text-center text-xs font-medium text-muted-foreground",
            children: e === "center" ? "Add as Tab" : `Split ${e}`,
          }),
        ],
      }),
    })
  );
}
function Gn(e) {
  const {
      isDragging: t,
      hasPendingDrop: n,
      pendingDropPosition: s,
      onDragStart: h,
      onDragEnd: p,
      onRequestDrop: D,
      onConfirmDrop: x,
      onCancelDrop: w,
      isDragEvent: V,
    } = e,
    l = F(null),
    d = F(null),
    [v, g] = N(null),
    [M, C] = N(!1),
    [A, R] = N("center"),
    m = u((a) => (V ? V(a) : t), [V, t]),
    i = u(
      (a, P) => {
        (a.dataTransfer.effectAllowed = "move"), a.dataTransfer.setData("text/plain", P), h(P);
      },
      [h],
    ),
    c = u(() => {
      p == null || p();
    }, [p]),
    f = u(
      (a) => {
        a.preventDefault(), m(a) && (a.dataTransfer.dropEffect = "move");
      },
      [m],
    ),
    b = u(
      (a) => {
        a.preventDefault(), m(a) && (l.current && g(l.current.getBoundingClientRect()), C(!0));
      },
      [m],
    ),
    o = u(
      (a) => {
        var L;
        if (!m(a)) return;
        const P = (L = l.current) == null ? void 0 : L.getBoundingClientRect();
        if (P) {
          const { clientX: I, clientY: j } = a;
          (I < P.left || I > P.right || j < P.top || j > P.bottom) && C(!1);
        }
      },
      [m],
    ),
    T = u(
      (a) => {
        if (!m(a)) return;
        a.preventDefault(), a.stopPropagation();
        const P = dt(a.clientX, a.clientY, v);
        R(P),
          D(P, { x: a.clientX, y: a.clientY }),
          l.current && g(l.current.getBoundingClientRect()),
          C(!1);
      },
      [m, v, D],
    ),
    S = u((a) => {
      a.preventDefault(), (a.dataTransfer.dropEffect = "move");
    }, []),
    z = u((a) => {
      a.preventDefault();
    }, []),
    Q = u(
      (a) => {
        a.preventDefault(),
          a.stopPropagation(),
          R("center"),
          D("center", { x: a.clientX, y: a.clientY }),
          l.current && g(l.current.getBoundingClientRect()),
          C(!1);
      },
      [D],
    );
  return (
    B(() => {
      n && s && R(s);
    }, [n, s]),
    B(() => {
      if (!n) return;
      const a = (L) => {
          L.target.closest("[data-drop-confirmation]") || w();
        },
        P = setTimeout(() => {
          document.addEventListener("click", a);
        }, 100);
      return () => {
        clearTimeout(P), document.removeEventListener("click", a);
      };
    }, [n, w]),
    B(() => {
      t || C(!1);
    }, [t]),
    B(() => {
      const a = () => {
        l.current && g(l.current.getBoundingClientRect());
      };
      return window.addEventListener("resize", a), () => window.removeEventListener("resize", a);
    }, []),
    {
      panelRef: l,
      contentRef: d,
      isHovering: M,
      selectedPosition: A,
      containerRect: v,
      handlers: {
        tabDragStart: i,
        tabDragEnd: c,
        contentDragOver: f,
        contentDragEnter: b,
        contentDragLeave: o,
        contentDrop: T,
        tabBarDragOver: S,
        tabBarDragEnter: z,
        tabBarDrop: Q,
      },
      confirmation: {
        selectPosition: R,
        confirm: x,
        cancel: w,
      },
    }
  );
}
const On = {
  list: Xr,
  "message-square": Hr,
  file: jr,
  "folder-open": Or,
  key: Gr,
  settings: yr,
};
function jn({ name: e }) {
  if (!e) return null;
  const t = On[e];
  return t ? /* @__PURE__ */ r(t, { className: "size-3.5" }) : null;
}
function Hn({ panel: e }) {
  const {
      dragState: t,
      pendingDrop: n,
      startDrag: s,
      endDrag: h,
      requestDrop: p,
      confirmDrop: D,
      cancelDrop: x,
      closeTab: w,
      setActiveTab: V,
    } = O(),
    l = re(),
    d = Jn(),
    [v, g] = N((d == null ? void 0 : d.activePanelKey) ?? null);
  B(() => {
    if (d)
      return (
        g(d.activePanelKey),
        d.onUpdate(() => {
          g(d.activePanelKey);
        })
      );
  }, [d]);
  const M = F(null);
  B(() => {
    if (!v || v === M.current) return;
    const o = e.tabs.find((T) => T.id === v);
    o && e.activeTabId !== o.id ? ((M.current = v), V(e.id, o.id)) : o && (M.current = v);
  }, [v, e.tabs, e.activeTabId, e.id, V]);
  const C = t !== null,
    A = (n == null ? void 0 : n.targetPanelId) === e.id,
    R = e.tabs.some((o) => o.id === v),
    m = e.tabs.find((o) => o.id === e.activeTabId),
    i = Gn({
      panelId: e.id,
      isDragging: C,
      hasPendingDrop: A,
      pendingDropPosition: n == null ? void 0 : n.suggestedPosition,
      onDragStart: (o) => s(o, e.id),
      onDragEnd: h,
      onRequestDrop: (o, T) => p(e.id, o, T),
      onConfirmDrop: D,
      onCancelDrop: x,
    }),
    c = m == null ? void 0 : m.panelModel,
    f = c ? l.resolve(c.content) : null,
    b = u(() => {
      const o = e.activeTabId;
      o && d && d.setActivePanel(o);
    }, [e.activeTabId, d]);
  return /* @__PURE__ */ k("div", {
    ref: i.panelRef,
    onClickCapture: b,
    className: E(
      "flex flex-col h-full bg-card overflow-hidden relative rounded-md border transition-colors",
      R ? "border-primary/60 shadow-sm" : "border-border/50",
    ),
    children: [
      /* @__PURE__ */ k("div", {
        className: E(
          "flex items-center bg-muted/50 min-h-9 overflow-x-auto px-1",
          C && i.isHovering && "ring-2 ring-inset ring-primary/50",
        ),
        onDragOver: i.handlers.tabBarDragOver,
        onDragEnter: i.handlers.tabBarDragEnter,
        onDrop: i.handlers.tabBarDrop,
        children: [
          e.tabs.map((o) => {
            const T = o.id === e.activeTabId;
            return /* @__PURE__ */ k(
              "div",
              {
                role: "tab",
                tabIndex: 0,
                "aria-selected": T,
                draggable: !0,
                onDragStart: (S) => i.handlers.tabDragStart(S, o.id),
                onDragEnd: i.handlers.tabDragEnd,
                onClick: () => {
                  V(e.id, o.id), d == null || d.setActivePanel(o.id);
                },
                onKeyDown: (S) => {
                  (S.key === "Enter" || S.key === " ") &&
                    (S.preventDefault(), V(e.id, o.id), d == null || d.setActivePanel(o.id));
                },
                className: E(
                  "group relative flex items-center gap-1.5 px-3 py-1.5 text-sm cursor-pointer select-none transition-colors outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  T ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                ),
                children: [
                  /* @__PURE__ */ r(Fr, {
                    className:
                      "w-3 h-3 opacity-0 group-hover:opacity-40 cursor-grab active:cursor-grabbing transition-opacity",
                  }),
                  /* @__PURE__ */ r(jn, { name: o.icon }),
                  /* @__PURE__ */ r("span", { className: "truncate max-w-35", children: o.title }),
                  o.closable !== !1 &&
                    /* @__PURE__ */ r("button", {
                      type: "button",
                      onClick: (S) => {
                        S.stopPropagation(), w(e.id, o.id);
                      },
                      className:
                        "ml-1 p-0.5 rounded-sm hover:bg-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity",
                      children: /* @__PURE__ */ r(U, { className: "w-3 h-3" }),
                    }),
                  T &&
                    /* @__PURE__ */ r("span", {
                      className: "absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full",
                    }),
                ],
              },
              o.id,
            );
          }),
          C &&
            /* @__PURE__ */ r("div", {
              className:
                "flex-1 min-w-15 flex items-center justify-center text-xs text-muted-foreground/50 italic",
              children: "Drop here",
            }),
        ],
      }),
      /* @__PURE__ */ k("div", {
        ref: i.contentRef,
        className: E(
          "relative flex-1 overflow-auto",
          C && i.isHovering && "ring-2 ring-inset ring-primary/30 bg-primary/5",
        ),
        onDragOver: i.handlers.contentDragOver,
        onDragEnter: i.handlers.contentDragEnter,
        onDragLeave: i.handlers.contentDragLeave,
        onDrop: i.handlers.contentDrop,
        children: [
          f &&
            c &&
            /* @__PURE__ */ r("div", {
              className: "absolute inset-0 flex flex-col",
              children: /* @__PURE__ */ r(f, { model: c.content }),
            }),
          A &&
            i.selectedPosition !== "center" &&
            /* @__PURE__ */ r("div", {
              className: E(
                "absolute bg-primary/15 border-2 border-dashed border-primary rounded transition-all duration-200 pointer-events-none",
                i.selectedPosition === "left" && "left-0 top-0 w-1/2 h-full",
                i.selectedPosition === "right" && "right-0 top-0 w-1/2 h-full",
                i.selectedPosition === "top" && "left-0 top-0 w-full h-1/2",
                i.selectedPosition === "bottom" && "left-0 bottom-0 w-full h-1/2",
              ),
            }),
          A &&
            i.selectedPosition === "center" &&
            /* @__PURE__ */ r("div", {
              className:
                "absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded pointer-events-none",
            }),
        ],
      }),
      A &&
        n &&
        /* @__PURE__ */ r("div", {
          "data-drop-confirmation": !0,
          className: "absolute inset-0 pointer-events-none",
          children: /* @__PURE__ */ r("div", {
            className: "pointer-events-auto",
            children: /* @__PURE__ */ r(yn, {
              selectedPosition: i.selectedPosition,
              onSelectPosition: i.confirmation.selectPosition,
              onConfirm: i.confirmation.confirm,
              onCancel: i.confirmation.cancel,
              dropCoords: n.dropCoords,
              containerRect: i.containerRect,
            }),
          }),
        }),
    ],
  });
}
function Xn({ className: e, ...t }) {
  return /* @__PURE__ */ r(G.PanelGroup, {
    className: E("flex h-full w-full data-[panel-group-direction=vertical]:flex-col", e),
    ...t,
  });
}
function qn({ ...e }) {
  return /* @__PURE__ */ r(G.Panel, { ...e });
}
function Un({ withHandle: e, className: t, ...n }) {
  return /* @__PURE__ */ r(G.PanelResizeHandle, {
    className: E(
      "bg-border focus-visible:ring-ring relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-hidden data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:translate-x-0 data-[panel-group-direction=vertical]:after:-translate-y-1/2 [&[data-panel-group-direction=vertical]>div]:rotate-90",
      t,
    ),
    ...n,
    children:
      e &&
      /* @__PURE__ */ r("div", {
        className: "bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border",
        children: /* @__PURE__ */ r(qr, { className: "size-2.5" }),
      }),
  });
}
function Wn({ split: e }) {
  const { updateSizes: t } = O(),
    n = (s) => {
      t(e.id, s);
    };
  return /* @__PURE__ */ r(Xn, {
    direction: e.direction,
    onLayout: n,
    className: "h-full w-full",
    children: e.children.map((s, h) =>
      /* @__PURE__ */ k(
        Yr.Fragment,
        {
          children: [
            /* @__PURE__ */ r(qn, {
              id: s.id,
              order: h,
              defaultSize: e.sizes[h],
              minSize: 10,
              className: "relative",
              children: /* @__PURE__ */ r($, { node: s }),
            }),
            h < e.children.length - 1 &&
              /* @__PURE__ */ r(Un, {
                className:
                  "bg-transparent hover:bg-border active:bg-primary/50 transition-colors data-[panel-group-direction=vertical]:h-2 data-[panel-group-direction=horizontal]:w-2",
              }),
          ],
        },
        s.id,
      ),
    ),
  });
}
function $({ node: e }) {
  return ct(e)
    ? /* @__PURE__ */ r(Hn, { panel: e })
    : ut(e)
      ? /* @__PURE__ */ r(Wn, { split: e })
      : null;
}
function Yn() {
  const { root: e } = O();
  return /* @__PURE__ */ r("div", {
    className: "h-full w-full overflow-hidden bg-background p-1",
    children: /* @__PURE__ */ r($, { node: e }),
  });
}
function K(e) {
  const [t, n] = N(e.getAll());
  return B(() => (n(e.getAll()), e.onUpdate(() => n(e.getAll()))), [e]), t;
}
const _ = W(null);
function Jn() {
  return Y(_);
}
const [$n] = ee("aspect:component-registry", () => new te());
function bi({ context: e, wrapper: t }) {
  const n = H(() => $n(e), [e]),
    s = ie(e),
    h = oe(e),
    p = ae(e),
    [D, x] = N([]);
  B(() => se(e, x), [e]);
  const w = K(s),
    V = K(h),
    l = K(p),
    d = H(() => In(D), [D]),
    v = le(e),
    g = de(e);
  B(() => {
    function A(R) {
      var b;
      const m = (b = document.activeElement) == null ? void 0 : b.tagName;
      if (
        m === "INPUT" ||
        m === "TEXTAREA" ||
        m === "SELECT" ||
        document.querySelector("[role=dialog]")
      )
        return;
      const i = [];
      (R.ctrlKey || R.metaKey) && i.push("Ctrl"),
        R.shiftKey && i.push("Shift"),
        R.altKey && i.push("Alt"),
        i.push(R.key);
      const c = i.length > 1 ? i.join("+") : R.key,
        f = g.getBindings(c).length > 0 ? g.getBindings(c) : g.getBindings(R.key);
      for (const o of f) o.preventDefault !== !1 && R.preventDefault(), o.execute();
    }
    return (
      document.addEventListener("keydown", A), () => document.removeEventListener("keydown", A)
    );
  }, [g]);
  const M = w.length > 0 ? w[w.length - 1] : void 0,
    C = /* @__PURE__ */ r(ne.Provider, {
      value: n,
      children: /* @__PURE__ */ k("div", {
        className: "flex flex-col h-full w-full bg-background text-foreground",
        children: [
          /* @__PURE__ */ r(Qn, { menus: l }),
          /* @__PURE__ */ r("div", {
            className: "flex-1 overflow-hidden",
            children: /* @__PURE__ */ r(_.Provider, {
              value: v,
              children: /* @__PURE__ */ r(Kn, {
                initialLayout: d,
                children: /* @__PURE__ */ r(Yn, {}),
              }),
            }),
          }),
          /* @__PURE__ */ r(Zn, { actions: V }),
          /* @__PURE__ */ r(ei, { dialog: M, registry: n }),
        ],
      }),
    });
  return t ? /* @__PURE__ */ r(t, { children: C }) : C;
}
function _n() {
  const [e, t] = N(() => document.documentElement.classList.contains("dark"));
  return /* @__PURE__ */ r(y, {
    variant: "ghost",
    size: "icon",
    className: "ml-auto size-8",
    onClick: () => {
      const n = document.documentElement.classList.toggle("dark");
      t(n);
      try {
        localStorage.setItem("theme", n ? "dark" : "light");
      } catch {}
    },
    title: e ? "Switch to light theme" : "Switch to dark theme",
    children: e
      ? /* @__PURE__ */ r(Ur, { className: "size-4", "aria-hidden": "true" })
      : /* @__PURE__ */ r(Wr, { className: "size-4", "aria-hidden": "true" }),
  });
}
function Qn({ menus: e }) {
  return /* @__PURE__ */ k(et, {
    className: "border-0 border-b border-border rounded-none shadow-none bg-card",
    children: [
      e.map((t) =>
        /* @__PURE__ */ k(
          rt,
          {
            children: [
              /* @__PURE__ */ r(tt, { children: t.label ?? t.actionKey }),
              t.children.length > 0 &&
                /* @__PURE__ */ r(nt, {
                  children: t.children.map((n) =>
                    /* @__PURE__ */ r(
                      it,
                      {
                        disabled: n.disabled,
                        onClick: () => n.submit(),
                        children: n.label ?? n.actionKey,
                      },
                      n.actionKey,
                    ),
                  ),
                }),
            ],
          },
          t.actionKey,
        ),
      ),
      /* @__PURE__ */ r(_n, {}),
    ],
  });
}
function Zn({ actions: e }) {
  return e.length === 0
    ? null
    : /* @__PURE__ */ r("div", {
        className:
          "flex items-center justify-center gap-1 px-2 py-1.5 overflow-x-auto bg-(--toolbar) border-t border-border",
        children: e.map((t) => {
          const n = t.label ?? t.actionKey,
            s = n.match(/^(F\d+)\s+(.+)$/);
          return /* @__PURE__ */ r(
            y,
            {
              variant: "ghost",
              disabled: t.disabled,
              onClick: () => t.submit(),
              className: "flex items-center gap-1 h-auto px-2 py-1 text-sm",
              children: s
                ? /* @__PURE__ */ k(Z, {
                    children: [
                      /* @__PURE__ */ r("kbd", {
                        className:
                          "inline-flex items-center justify-center px-1.5 py-0.5 text-[0.65rem] font-mono font-semibold rounded bg-muted text-muted-foreground border border-border/50 min-w-[1.5rem]",
                        children: s[1],
                      }),
                      /* @__PURE__ */ r("span", { children: s[2] }),
                    ],
                  })
                : /* @__PURE__ */ r("span", { children: n }),
            },
            t.actionKey,
          );
        }),
      });
}
function ei({ dialog: e, registry: t }) {
  if (!e) return null;
  const n = t.resolve(e);
  return n
    ? /* @__PURE__ */ r(Jr, {
        open: !0,
        children: /* @__PURE__ */ k($r, {
          showCloseButton: !1,
          children: [
            /* @__PURE__ */ k(_r, {
              className: "sr-only",
              children: [
                /* @__PURE__ */ r(Qr, {
                  children: typeof e.header === "string" ? e.header : "Dialog",
                }),
                /* @__PURE__ */ r(Zr, { children: typeof e.header === "string" ? e.header : "" }),
              ],
            }),
            /* @__PURE__ */ r(n, { model: e }),
          ],
        }),
      })
    : null;
}
function ri({ model: e }) {
  gt(e.onUpdate);
  const t = e.orientation === "vertical",
    n = e.density === "compact";
  return /* @__PURE__ */ r("div", {
    role: "group",
    className: E(
      "inline-flex",
      t ? "flex-col" : "flex-row",
      n ? "gap-0" : "gap-1",
      n &&
        !t &&
        "[&>button:not(:first-child)]:rounded-l-none [&>button:not(:last-child)]:rounded-r-none",
      n &&
        t &&
        "[&>button:not(:first-child)]:rounded-t-none [&>button:not(:last-child)]:rounded-b-none",
    ),
    children: e.children.map((s) =>
      /* @__PURE__ */ r(
        y,
        {
          variant:
            s.variant === "primary"
              ? "default"
              : s.variant === "danger"
                ? "destructive"
                : "outline",
          size:
            e.size === "S" || e.size === "XS"
              ? "sm"
              : e.size === "L" || e.size === "XL"
                ? "lg"
                : "default",
          disabled: s.disabled || e.disabledKeys.has(s.actionKey),
          onClick: () => s.submit(),
          children: s.label ?? s.actionKey,
        },
        s.actionKey,
      ),
    ),
  });
}
function hi(e) {
  const t = [
    // Actions
    e.register(ce, ri),
    e.register(ue, ft),
    e.register(ge, pt),
    e.register(fe, mt),
    // Collections
    e.register(pe, bt),
    e.register(me, ht),
    e.register(be, wt),
    // Color
    e.register(he, vt),
    e.register(we, Rt),
    e.register(ve, Dt),
    e.register(Re, Vt),
    e.register(De, xt),
    e.register(Ve, Ct),
    e.register(xe, Pt),
    // Content
    e.register(Ce, Tt),
    e.register(Pe, St),
    e.register(Te, kt),
    e.register(Se, At),
    e.register(ke, Nt),
    e.register(Ae, Bt),
    e.register(Ne, Mt),
    // Data
    e.register(Be, Vn),
    e.register(Me, xn),
    e.register(Ee, Cn),
    // Date-Time
    e.register(ze, Et),
    e.register(Le, zt),
    e.register(Ie, Lt),
    e.register(Ke, It),
    e.register(Fe, Kt),
    e.register(ye, Ft),
    // Feedback
    e.register(Ge, yt),
    e.register(Oe, Pn),
    e.register(je, Gt),
    e.register(He, Ot),
    e.register(Xe, jt),
    e.register(qe, Ht),
    e.register(Ue, Xt),
    e.register(We, qt),
    e.register(Ye, Ut),
    e.register(Je, Wt),
    // Forms
    e.register($e, Yt),
    e.register(_e, Jt),
    e.register(Qe, $t),
    e.register(Ze, _t),
    e.register(er, Qt),
    e.register(rr, Zt),
    e.register(tr, en),
    e.register(nr, rn),
    e.register(ir, tn),
    e.register(or, nn),
    e.register(ar, on),
    e.register(sr, an),
    e.register(lr, sn),
    // Layout
    e.register(dr, Tn),
    e.register(cr, ln),
    e.register(ur, dn),
    e.register(gr, cn),
    e.register(fr, Sn),
    e.register(pr, kn),
    e.register(mr, un),
    e.register(br, gn),
    // Menus
    e.register(hr, fn),
    e.register(wr, pn),
    e.register(vr, mn),
    e.register(Rr, bn),
    e.register(Dr, hn),
    // Navigation
    e.register(Vr, An),
    e.register(xr, Nn),
    e.register(Cr, wn),
    e.register(Pr, Bn),
    e.register(Tr, Mn),
    // Overlays
    e.register(Sr, vn),
    e.register(kr, En),
    e.register(Ar, zn),
    e.register(Nr, Rn),
    e.register(Br, Ln),
    e.register(Mr, Dn),
  ];
  return () => {
    for (const n of t) n();
  };
}
export {
  bi as AppShell,
  Yn as DockLayout,
  Kn as DockProvider,
  yn as DropConfirmationGrid,
  $n as getComponentRegistry,
  hi as initShadcnViews,
  Ri as panelsToTree,
  O as useDockLayout,
  K as useModelItems,
  Gn as usePanelDnd,
};
