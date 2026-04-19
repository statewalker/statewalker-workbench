import { jsx as t, jsxs as a } from "react/jsx-runtime";
import { useUpdates as o } from "@statewalker/shared-react/hooks";
import { ChevronDown as x, ChevronRight as b, FolderOpen as m, Folder as y, File as v } from "lucide-react";
import "radix-ui";
import { B as u, C as N, j as k, k as w, g as C, i as R, D, a as U, b as j, c as K, d as T, m as P } from "./dialog-BUL2rVnl.js";
import { useState as $, useEffect as B, useCallback as E } from "react";
import { useComponentRegistry as f } from "@statewalker/shared-react/component-registry";
function W({ value: e }) {
  const r = f();
  if (typeof e == "string")
    return /* @__PURE__ */ t("span", { children: e });
  const n = r.resolve(e);
  return n ? /* @__PURE__ */ t(n, { model: e }) : /* @__PURE__ */ t("span", { className: "text-sm text-muted-foreground", children: "No renderer" });
}
function c({ model: e }) {
  const n = f().resolve(e);
  return n ? /* @__PURE__ */ t(n, { model: e }) : /* @__PURE__ */ t("span", { className: "text-sm text-muted-foreground", children: "No renderer" });
}
const S = {
  primary: "default",
  secondary: "secondary",
  neutral: "outline",
  danger: "destructive",
  info: "ghost"
};
function p({
  action: e,
  tooltip: r
}) {
  return o(e.onUpdate), /* @__PURE__ */ t(
    u,
    {
      variant: S[e.variant],
      onClick: () => e.submit(),
      disabled: e.disabled,
      title: r,
      children: e.label ?? e.actionKey
    }
  );
}
function X({ model: e }) {
  return o(e.onUpdate), /* @__PURE__ */ a("div", { className: "p-4", children: [
    e.label && /* @__PURE__ */ t("h3", { className: "text-sm font-medium mb-2 text-muted-foreground", children: e.label }),
    /* @__PURE__ */ t("pre", { className: "text-sm bg-muted rounded-md p-3 overflow-auto max-h-64 whitespace-pre-wrap", children: JSON.stringify(e.data, null, 2) })
  ] });
}
function Y({ model: e }) {
  o(e.onUpdate);
  const r = e.sortedRows, n = e.selectionMode !== "none";
  return /* @__PURE__ */ a("div", { className: "w-full overflow-auto", children: [
    /* @__PURE__ */ a("table", { className: "w-full caption-bottom text-sm", children: [
      /* @__PURE__ */ t("thead", { className: "border-b border-border", children: /* @__PURE__ */ a("tr", { children: [
        n && /* @__PURE__ */ t("th", { className: "h-10 px-2 text-left align-middle w-10", children: /* @__PURE__ */ t(
          "input",
          {
            type: "checkbox",
            className: "cursor-pointer",
            checked: r.length > 0 && e.selectedKeys.size === r.length,
            onChange: () => {
              e.selectedKeys.size === r.length ? e.clearSelection() : e.selectAll();
            }
          }
        ) }),
        e.columns.map((i) => {
          var s, d;
          return /* @__PURE__ */ t(
            "th",
            {
              className: `h-10 px-2 text-left align-middle font-medium text-muted-foreground ${i.sortable ? "cursor-pointer hover:text-foreground select-none" : ""}`,
              style: i.width ? { width: i.width } : void 0,
              onClick: () => e.sort(i.key),
              children: /* @__PURE__ */ a("span", { className: "flex items-center gap-1", children: [
                i.label,
                ((s = e.sortDescriptor) == null ? void 0 : s.column) === i.key && /* @__PURE__ */ t("span", { className: "text-xs", children: ((d = e.sortDescriptor) == null ? void 0 : d.direction) === "ascending" ? "▲" : "▼" })
              ] })
            },
            i.key
          );
        })
      ] }) }),
      /* @__PURE__ */ t("tbody", { children: r.map((i) => {
        const s = e.rowKey(i), d = i;
        return /* @__PURE__ */ a(
          "tr",
          {
            className: `border-b border-border transition-colors hover:bg-muted/50 ${e.isSelected(s) ? "bg-muted" : ""}`,
            children: [
              n && /* @__PURE__ */ t("td", { className: "px-2 align-middle", children: /* @__PURE__ */ t(
                "input",
                {
                  type: "checkbox",
                  className: "cursor-pointer",
                  checked: e.isSelected(s),
                  onChange: () => e.toggleSelection(s)
                }
              ) }),
              e.columns.map((l) => /* @__PURE__ */ t("td", { className: "px-2 py-2 align-middle", children: l.render ? l.render(d[l.key], i) : String(d[l.key] ?? "") }, l.key))
            ]
          },
          s
        );
      }) })
    ] }),
    r.length === 0 && /* @__PURE__ */ t("div", { className: "py-6 text-center text-sm text-muted-foreground", children: "No data" })
  ] });
}
function g({
  node: e,
  model: r,
  depth: n
}) {
  var l;
  const i = e.children && e.children.length > 0, s = r.isExpanded(e.key), d = r.selectedKeys.values().next().value === e.key;
  return /* @__PURE__ */ a("div", { children: [
    /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: `w-full flex items-center gap-1.5 px-2 py-1 text-sm rounded-md cursor-pointer hover:bg-accent ${d ? "bg-accent font-medium" : ""}`,
        style: { paddingLeft: `${n * 1 + 0.5}rem` },
        onClick: () => {
          i && r.toggleExpand(e.key), r.select(e.key);
        },
        children: [
          i ? s ? /* @__PURE__ */ t(x, { className: "h-4 w-4 shrink-0 text-muted-foreground" }) : /* @__PURE__ */ t(b, { className: "h-4 w-4 shrink-0 text-muted-foreground" }) : /* @__PURE__ */ t("span", { className: "w-4 shrink-0" }),
          i ? s ? /* @__PURE__ */ t(m, { className: "h-4 w-4 shrink-0 text-muted-foreground" }) : /* @__PURE__ */ t(y, { className: "h-4 w-4 shrink-0 text-muted-foreground" }) : /* @__PURE__ */ t(v, { className: "h-4 w-4 shrink-0 text-muted-foreground" }),
          /* @__PURE__ */ t("span", { className: "truncate", children: e.label })
        ]
      }
    ),
    i && s && /* @__PURE__ */ t("div", { children: (l = e.children) == null ? void 0 : l.map((h) => /* @__PURE__ */ t(
      g,
      {
        node: h,
        model: r,
        depth: n + 1
      },
      h.key
    )) })
  ] });
}
function q({ model: e }) {
  return o(e.onUpdate), /* @__PURE__ */ t("div", { className: "p-2", children: e.roots.map((r) => /* @__PURE__ */ t(g, { node: r, model: e, depth: 0 }, r.key)) });
}
function Q({ model: e }) {
  return o(e.onUpdate), /* @__PURE__ */ a("div", { className: "flex flex-col items-center justify-center py-10 text-center text-muted-foreground", children: [
    e.icon && /* @__PURE__ */ t("span", { className: "mb-3 text-4xl opacity-50", children: e.icon }),
    /* @__PURE__ */ t("h3", { className: "text-lg font-medium", children: e.heading }),
    e.description && /* @__PURE__ */ t("p", { className: "mt-1 text-sm", children: e.description }),
    e.action && /* @__PURE__ */ t("div", { className: "mt-4", children: /* @__PURE__ */ t(p, { action: e.action }) })
  ] });
}
function V({ model: e }) {
  o(e.onUpdate);
  const r = e.footer !== void 0 || e.actions.length > 0;
  return /* @__PURE__ */ a(N, { children: [
    e.header && /* @__PURE__ */ t(k, { children: /* @__PURE__ */ t(w, { children: typeof e.header == "string" ? e.header : /* @__PURE__ */ t(c, { model: e.header }) }) }),
    /* @__PURE__ */ t(C, { children: e.children.map((n) => /* @__PURE__ */ t(c, { model: n }, n.key)) }),
    r && /* @__PURE__ */ a(R, { children: [
      e.footer && (typeof e.footer == "string" ? e.footer : /* @__PURE__ */ t(c, { model: e.footer })),
      e.actions.length > 0 && /* @__PURE__ */ t("div", { className: "flex gap-2 ml-auto", children: e.actions.map((n) => /* @__PURE__ */ t(p, { action: n }, n.actionKey)) })
    ] })
  ] });
}
function Z({ model: e }) {
  o(e.onUpdate);
  const n = [
    "flex",
    e.direction === "row" ? "flex-row" : e.direction === "column" ? "flex-col" : e.direction === "row-reverse" ? "flex-row-reverse" : "flex-col-reverse",
    e.alignItems ? `items-${e.alignItems}` : "",
    e.justifyContent ? `justify-${e.justifyContent}` : "",
    e.wrap ? "flex-wrap" : ""
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ t("div", { className: n, style: { gap: e.gap }, children: e.children.map((i) => /* @__PURE__ */ t(c, { model: i }, i.key)) });
}
function _({ model: e }) {
  var r;
  return o(e.onUpdate), /* @__PURE__ */ t(
    "div",
    {
      className: "grid",
      style: {
        gridTemplateColumns: typeof e.columns == "string" ? e.columns : (r = e.columns) == null ? void 0 : r.join(" "),
        gap: e.gap
      },
      children: e.children.map((n) => /* @__PURE__ */ t(c, { model: n }, n.key))
    }
  );
}
function ee({ model: e }) {
  return o(e.onUpdate), /* @__PURE__ */ t("div", { className: "w-full divide-y divide-border border rounded-md", children: e.items.map((r) => {
    const n = e.isExpanded(r.key);
    return /* @__PURE__ */ a("div", { children: [
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: `flex w-full items-center justify-between px-4 py-3 text-sm font-medium transition-colors hover:bg-muted/50 ${r.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`,
          onClick: () => e.toggle(r.key),
          disabled: r.disabled,
          "aria-expanded": n,
          children: [
            /* @__PURE__ */ t("span", { children: r.title }),
            /* @__PURE__ */ t(
              "svg",
              {
                className: `h-4 w-4 shrink-0 transition-transform ${n ? "rotate-180" : ""}`,
                xmlns: "http://www.w3.org/2000/svg",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                children: /* @__PURE__ */ t("path", { d: "m6 9 6 6 6-6" })
              }
            )
          ]
        }
      ),
      n && /* @__PURE__ */ t("div", { className: "px-4 pb-3", children: /* @__PURE__ */ t(c, { model: r.content }) })
    ] }, r.key);
  }) });
}
function te({ model: e }) {
  return o(e.onUpdate), /* @__PURE__ */ t("nav", { "aria-label": "Breadcrumb", className: "flex items-center text-sm", children: e.items.map((r, n) => {
    const i = n === e.items.length - 1;
    return /* @__PURE__ */ a("span", { className: "flex items-center", children: [
      n > 0 && /* @__PURE__ */ t(
        "svg",
        {
          className: "mx-2 h-4 w-4 text-muted-foreground",
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          children: /* @__PURE__ */ t("path", { d: "m9 18 6-6-6-6" })
        }
      ),
      i ? /* @__PURE__ */ t("span", { className: "text-foreground font-medium", children: r.label }) : r.action ? /* @__PURE__ */ t(
        "button",
        {
          type: "button",
          className: "text-muted-foreground hover:text-foreground transition-colors cursor-pointer",
          onClick: () => {
            var s;
            (s = r.action) == null || s.submit(), e.popTo(n);
          },
          children: r.label
        }
      ) : /* @__PURE__ */ t(
        "span",
        {
          className: "text-muted-foreground hover:text-foreground transition-colors cursor-pointer",
          onClick: () => e.popTo(n),
          onKeyDown: (s) => {
            s.key === "Enter" && e.popTo(n);
          },
          role: "button",
          tabIndex: 0,
          children: r.label
        }
      )
    ] }, n);
  }) });
}
function re({ model: e }) {
  return o(e.onUpdate), /* @__PURE__ */ a("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ a("span", { className: "text-sm text-muted-foreground", children: [
      "Page ",
      e.page,
      " of ",
      e.totalPages
    ] }),
    /* @__PURE__ */ a("div", { className: "flex gap-1", children: [
      /* @__PURE__ */ t(
        u,
        {
          variant: "outline",
          onClick: () => e.setPage(1),
          disabled: !e.hasPrevious,
          children: "First"
        }
      ),
      /* @__PURE__ */ t(
        u,
        {
          variant: "outline",
          onClick: () => e.previous(),
          disabled: !e.hasPrevious,
          children: "Previous"
        }
      ),
      /* @__PURE__ */ t(
        u,
        {
          variant: "outline",
          onClick: () => e.next(),
          disabled: !e.hasNext,
          children: "Next"
        }
      ),
      /* @__PURE__ */ t(
        u,
        {
          variant: "outline",
          onClick: () => e.setPage(e.totalPages),
          disabled: !e.hasNext,
          children: "Last"
        }
      )
    ] })
  ] });
}
function ne({ model: e }) {
  o(e.onUpdate);
  const r = e.getActiveTab();
  return /* @__PURE__ */ a("div", { className: "w-full", children: [
    /* @__PURE__ */ t("div", { className: "flex border-b border-border", role: "tablist", children: e.tabs.map((n) => /* @__PURE__ */ t(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": n.key === e.selectedKey,
        disabled: n.disabled,
        className: `px-4 py-2 text-sm font-medium border-b-2 transition-colors ${n.key === e.selectedKey ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"} ${n.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`,
        onClick: () => e.selectedKey = n.key,
        children: n.label
      },
      n.key
    )) }),
    /* @__PURE__ */ t("div", { className: "pt-4", role: "tabpanel", children: r && /* @__PURE__ */ t(c, { model: r.content }) })
  ] });
}
function se({ model: e }) {
  o(e.onUpdate);
  const [r, n] = $(null);
  B(() => {
    if (!r) return;
    const s = () => n(null);
    return document.addEventListener("click", s), () => document.removeEventListener("click", s);
  }, [r]);
  const i = E((s) => {
    s.preventDefault(), n({ x: s.clientX, y: s.clientY });
  }, []);
  return /* @__PURE__ */ a("div", { role: "group", onContextMenu: i, children: [
    /* @__PURE__ */ t(c, { model: e.target }),
    r && /* @__PURE__ */ t(
      "div",
      {
        className: "fixed z-50 min-w-[160px] rounded-md border border-border bg-popover p-1 shadow-md",
        style: { left: r.x, top: r.y },
        children: e.items.map((s) => /* @__PURE__ */ t(
          "button",
          {
            type: "button",
            className: "w-full rounded-sm px-3 py-1.5 text-sm text-left hover:bg-muted cursor-pointer",
            onClick: () => {
              s.submit(), n(null);
            },
            children: s.label ?? s.actionKey
          },
          s.actionKey
        ))
      }
    )
  ] });
}
function ae({ model: e }) {
  return o(e.onUpdate), /* @__PURE__ */ t(D, { open: !0, children: /* @__PURE__ */ a(U, { showCloseButton: !1, children: [
    /* @__PURE__ */ a(j, { children: [
      /* @__PURE__ */ t(K, { children: typeof e.header == "string" ? e.header : "Dialog" }),
      /* @__PURE__ */ t(T, { className: "sr-only", children: typeof e.header == "string" ? e.header : "" })
    ] }),
    /* @__PURE__ */ t("div", { children: e.children.map((r) => /* @__PURE__ */ t(c, { model: r }, r.key)) }),
    e.footer && /* @__PURE__ */ t(P, { children: typeof e.footer == "string" ? e.footer : /* @__PURE__ */ t(c, { model: e.footer }) })
  ] }) });
}
const F = {
  left: "inset-y-0 left-0 w-80 border-r",
  right: "inset-y-0 right-0 w-80 border-l",
  top: "inset-x-0 top-0 h-80 border-b",
  bottom: "inset-x-0 bottom-0 h-80 border-t"
}, L = {
  left: "translate-x-0",
  right: "translate-x-0",
  top: "translate-y-0",
  bottom: "translate-y-0"
}, O = {
  left: "-translate-x-full",
  right: "translate-x-full",
  top: "-translate-y-full",
  bottom: "translate-y-full"
};
function ie({ model: e }) {
  return o(e.onUpdate), e.isOpen ? /* @__PURE__ */ a("div", { className: "fixed inset-0 z-50", children: [
    /* @__PURE__ */ t(
      "div",
      {
        className: "fixed inset-0 bg-black/50",
        onClick: () => e.setOpen(!1),
        onKeyDown: (r) => {
          r.key === "Escape" && e.setOpen(!1);
        }
      }
    ),
    /* @__PURE__ */ a(
      "div",
      {
        className: `fixed z-50 bg-card border-border ${F[e.side]} ${e.isOpen ? L[e.side] : O[e.side]} transition-transform duration-200 flex flex-col`,
        children: [
          e.content && /* @__PURE__ */ a("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border", children: [
            /* @__PURE__ */ t("h3", { className: "text-lg font-semibold", children: e.content }),
            /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                className: "text-muted-foreground hover:text-foreground cursor-pointer",
                onClick: () => e.setOpen(!1),
                children: "✕"
              }
            )
          ] }),
          /* @__PURE__ */ t("div", { className: "flex-1 overflow-auto p-4", children: e.content && /* @__PURE__ */ t(c, { model: e.content }) }),
          e.actions.length > 0 && /* @__PURE__ */ t("div", { className: "flex justify-end gap-2 border-t border-border p-4", children: e.actions.map((r) => /* @__PURE__ */ t(p, { action: r }, r.actionKey)) })
        ]
      }
    )
  ] }) : null;
}
export {
  ee as A,
  te as B,
  V as C,
  ae as D,
  Q as E,
  Z as F,
  _ as G,
  X as J,
  re as P,
  c as R,
  ie as S,
  Y as T,
  p as a,
  se as b,
  W as c,
  ne as d,
  q as e
};
