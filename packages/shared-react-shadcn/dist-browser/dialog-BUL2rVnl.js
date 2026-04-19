import { XIcon as w } from "lucide-react";
import { Slot as D, Dialog as r } from "radix-ui";
import { forwardRef as k } from "react";
import { jsx as n, jsxs as v } from "react/jsx-runtime";
import { c as o, a as z } from "./utils-gWiv5-6R.js";

const b = (t) => (typeof t === "boolean" ? `${t}` : t === 0 ? "0" : t),
  p = z,
  _ = (t, e) => (a) => {
    var i;
    if ((e == null ? void 0 : e.variants) == null)
      return p(t, a == null ? void 0 : a.class, a == null ? void 0 : a.className);
    const { variants: u, defaultVariants: d } = e,
      h = Object.keys(u).map((s) => {
        const l = a == null ? void 0 : a[s],
          g = d == null ? void 0 : d[s];
        if (l === null) return null;
        const c = b(l) || b(g);
        return u[s][c];
      }),
      m =
        a &&
        Object.entries(a).reduce((s, l) => {
          const [g, c] = l;
          return c === void 0 || (s[g] = c), s;
        }, {}),
      y =
        e == null || (i = e.compoundVariants) === null || i === void 0
          ? void 0
          : i.reduce((s, l) => {
              const { class: g, className: c, ...N } = l;
              return Object.entries(N).every((C) => {
                const [x, f] = C;
                return Array.isArray(f)
                  ? f.includes(
                      {
                        ...d,
                        ...m,
                      }[x],
                    )
                  : {
                      ...d,
                      ...m,
                    }[x] === f;
              })
                ? [...s, g, c]
                : s;
            }, []);
    return p(t, h, y, a == null ? void 0 : a.class, a == null ? void 0 : a.className);
  },
  V = k(({ className: t = "", variant: e = "default", ...a }, i) =>
    /* @__PURE__ */ n("span", {
      ref: i,
      className: `${e === "outline" ? "badge-outline" : "badge"} ${t}`.trim(),
      ...a,
    }),
  );
V.displayName = "Badge";
const j = _(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
function F({ className: t, variant: e = "default", size: a = "default", asChild: i = !1, ...u }) {
  const d = i ? D.Root : "button";
  return /* @__PURE__ */ n(d, {
    "data-slot": "button",
    "data-variant": e,
    "data-size": a,
    className: o(j({ variant: e, size: a, className: t })),
    ...u,
  });
}
function H({ className: t, ...e }) {
  return /* @__PURE__ */ n("div", {
    "data-slot": "card",
    className: o("rounded-lg border bg-card text-card-foreground shadow-sm", t),
    ...e,
  });
}
function S({ className: t, ...e }) {
  return /* @__PURE__ */ n("div", {
    "data-slot": "card-header",
    className: o("flex flex-col gap-1.5 p-6", t),
    ...e,
  });
}
function I({ className: t, ...e }) {
  return /* @__PURE__ */ n("div", {
    "data-slot": "card-title",
    className: o("leading-none font-semibold tracking-tight", t),
    ...e,
  });
}
function K({ className: t, ...e }) {
  return /* @__PURE__ */ n("div", {
    "data-slot": "card-description",
    className: o("text-sm text-muted-foreground", t),
    ...e,
  });
}
function U({ className: t, ...e }) {
  return /* @__PURE__ */ n("div", {
    "data-slot": "card-content",
    className: o("p-6 pt-0", t),
    ...e,
  });
}
function W({ className: t, ...e }) {
  return /* @__PURE__ */ n("div", {
    "data-slot": "card-footer",
    className: o("flex items-center p-6 pt-0", t),
    ...e,
  });
}
function X({ ...t }) {
  return /* @__PURE__ */ n(r.Root, { "data-slot": "dialog", ...t });
}
function q({ ...t }) {
  return /* @__PURE__ */ n(r.Trigger, { "data-slot": "dialog-trigger", ...t });
}
function O({ ...t }) {
  return /* @__PURE__ */ n(r.Portal, { "data-slot": "dialog-portal", ...t });
}
function E({ ...t }) {
  return /* @__PURE__ */ n(r.Close, { "data-slot": "dialog-close", ...t });
}
function T({ className: t, ...e }) {
  return /* @__PURE__ */ n(r.Overlay, {
    "data-slot": "dialog-overlay",
    className: o(
      "fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
      t,
    ),
    ...e,
  });
}
function G({ className: t, children: e, showCloseButton: a = !0, ...i }) {
  return /* @__PURE__ */ v(O, {
    children: [
      /* @__PURE__ */ n(T, {}),
      /* @__PURE__ */ v(r.Content, {
        "data-slot": "dialog-content",
        className: o(
          "fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:max-w-lg",
          t,
        ),
        ...i,
        children: [
          e,
          a &&
            /* @__PURE__ */ v(r.Close, {
              "data-slot": "dialog-close",
              className:
                "absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              children: [
                /* @__PURE__ */ n(w, {}),
                /* @__PURE__ */ n("span", { className: "sr-only", children: "Close" }),
              ],
            }),
        ],
      }),
    ],
  });
}
function J({ className: t, ...e }) {
  return /* @__PURE__ */ n("div", {
    "data-slot": "dialog-header",
    className: o("flex flex-col gap-2 text-center sm:text-left", t),
    ...e,
  });
}
function L({ className: t, children: e, ...a }) {
  return /* @__PURE__ */ n("div", {
    "data-slot": "dialog-footer",
    className: o("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", t),
    ...a,
    children: e,
  });
}
function M({ className: t, ...e }) {
  return /* @__PURE__ */ n(r.Title, {
    "data-slot": "dialog-title",
    className: o("text-lg leading-none font-semibold", t),
    ...e,
  });
}
function Q({ className: t, ...e }) {
  return /* @__PURE__ */ n(r.Description, {
    "data-slot": "dialog-description",
    className: o("text-sm text-muted-foreground", t),
    ...e,
  });
}
export {
  F as B,
  H as C,
  X as D,
  G as a,
  J as b,
  M as c,
  Q as d,
  _ as e,
  V as f,
  U as g,
  K as h,
  W as i,
  S as j,
  I as k,
  E as l,
  L as m,
  q as n,
  j as o,
};
