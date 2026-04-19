import { jsx as r } from "react/jsx-runtime";
import { e as b } from "./dialog-BUL2rVnl.js";
import { f as at, B as ot, C as nt, g as it, h as st, i as lt, j as dt, k as ut, D as ct, l as pt, a as gt, d as bt, m as ft, b as mt, c as vt, n as xt, o as ht } from "./dialog-BUL2rVnl.js";
import { c as a } from "./utils-gWiv5-6R.js";
import { Avatar as s, Slot as f, Checkbox as p, Collapsible as l, Label as m, Progress as g, Tooltip as i } from "radix-ui";
import { ChevronRight as v, CheckIcon as x } from "lucide-react";
import { M as kt, e as wt, c as Nt, d as yt, a as Tt, f as zt, g as It, h as Mt, i as Dt, j as Bt, b as At } from "./menubar-SGqF5dkF.js";
const h = b(
  "relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive: "bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90 [&>svg]:text-current"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function I({
  className: t,
  variant: e,
  ...o
}) {
  return /* @__PURE__ */ r(
    "div",
    {
      "data-slot": "alert",
      role: "alert",
      className: a(h({ variant: e }), t),
      ...o
    }
  );
}
function M({ className: t, ...e }) {
  return /* @__PURE__ */ r(
    "div",
    {
      "data-slot": "alert-title",
      className: a(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        t
      ),
      ...e
    }
  );
}
function D({
  className: t,
  ...e
}) {
  return /* @__PURE__ */ r(
    "div",
    {
      "data-slot": "alert-description",
      className: a(
        "col-start-2 grid justify-items-start gap-1 text-sm text-muted-foreground [&_p]:leading-relaxed",
        t
      ),
      ...e
    }
  );
}
function B({
  className: t,
  ...e
}) {
  return /* @__PURE__ */ r(
    s.Root,
    {
      "data-slot": "avatar",
      className: a(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full select-none",
        t
      ),
      ...e
    }
  );
}
function A({
  className: t,
  ...e
}) {
  return /* @__PURE__ */ r(
    s.Image,
    {
      "data-slot": "avatar-image",
      className: a("aspect-square size-full", t),
      ...e
    }
  );
}
function R({
  className: t,
  ...e
}) {
  return /* @__PURE__ */ r(
    s.Fallback,
    {
      "data-slot": "avatar-fallback",
      className: a(
        "flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground",
        t
      ),
      ...e
    }
  );
}
function S({ ...t }) {
  return /* @__PURE__ */ r("nav", { "aria-label": "breadcrumb", "data-slot": "breadcrumb", ...t });
}
function $({ className: t, ...e }) {
  return /* @__PURE__ */ r(
    "ol",
    {
      "data-slot": "breadcrumb-list",
      className: a(
        "flex flex-wrap items-center gap-1.5 text-sm break-words text-muted-foreground sm:gap-2.5",
        t
      ),
      ...e
    }
  );
}
function P({ className: t, ...e }) {
  return /* @__PURE__ */ r(
    "li",
    {
      "data-slot": "breadcrumb-item",
      className: a("inline-flex items-center gap-1.5", t),
      ...e
    }
  );
}
function j({
  asChild: t,
  className: e,
  ...o
}) {
  const n = t ? f.Root : "a";
  return /* @__PURE__ */ r(
    n,
    {
      "data-slot": "breadcrumb-link",
      className: a("transition-colors hover:text-foreground", e),
      ...o
    }
  );
}
function G({ className: t, ...e }) {
  return /* @__PURE__ */ r(
    "span",
    {
      "data-slot": "breadcrumb-page",
      role: "link",
      "aria-disabled": "true",
      "aria-current": "page",
      className: a("font-normal text-foreground", t),
      ...e
    }
  );
}
function L({
  children: t,
  className: e,
  ...o
}) {
  return /* @__PURE__ */ r(
    "li",
    {
      "data-slot": "breadcrumb-separator",
      role: "presentation",
      "aria-hidden": "true",
      className: a("[&>svg]:size-3.5", e),
      ...o,
      children: t ?? /* @__PURE__ */ r(v, {})
    }
  );
}
const C = b(
  "flex w-fit items-stretch has-[>[data-slot=button-group]]:gap-2 [&>*]:focus-visible:relative [&>*]:focus-visible:z-10 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
  {
    variants: {
      orientation: {
        horizontal: "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none",
        vertical: "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none"
      }
    },
    defaultVariants: {
      orientation: "horizontal"
    }
  }
);
function V({
  className: t,
  orientation: e,
  ...o
}) {
  return /* @__PURE__ */ r(
    "div",
    {
      role: "group",
      "data-slot": "button-group",
      "data-orientation": e,
      className: a(C({ orientation: e }), t),
      ...o
    }
  );
}
function _({
  className: t,
  asChild: e = !1,
  ...o
}) {
  const n = e ? f.Root : "div";
  return /* @__PURE__ */ r(
    n,
    {
      className: a(
        "flex items-center gap-2 rounded-md border bg-muted px-4 text-sm font-medium shadow-xs [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        t
      ),
      ...o
    }
  );
}
function F({
  className: t,
  ...e
}) {
  return /* @__PURE__ */ r(
    p.Root,
    {
      "data-slot": "checkbox",
      className: a(
        "peer size-4 shrink-0 rounded-[4px] border border-input shadow-xs transition-shadow outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:bg-input/30 dark:aria-invalid:ring-destructive/40 dark:data-[state=checked]:bg-primary",
        t
      ),
      ...e,
      children: /* @__PURE__ */ r(
        p.Indicator,
        {
          "data-slot": "checkbox-indicator",
          className: "grid place-content-center text-current transition-none",
          children: /* @__PURE__ */ r(x, { className: "size-3.5" })
        }
      )
    }
  );
}
function q({
  ...t
}) {
  return /* @__PURE__ */ r(l.Root, { "data-slot": "collapsible", ...t });
}
function H({
  ...t
}) {
  return /* @__PURE__ */ r(
    l.CollapsibleTrigger,
    {
      "data-slot": "collapsible-trigger",
      ...t
    }
  );
}
function E({
  ...t
}) {
  return /* @__PURE__ */ r(
    l.CollapsibleContent,
    {
      "data-slot": "collapsible-content",
      ...t
    }
  );
}
function k({ className: t, type: e, ...o }) {
  return /* @__PURE__ */ r(
    "input",
    {
      type: e,
      "data-slot": "input",
      className: a(
        "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        t
      ),
      ...o
    }
  );
}
function X({ className: t, ...e }) {
  return /* @__PURE__ */ r(
    "div",
    {
      "data-slot": "input-group",
      role: "group",
      className: a(
        "group/input-group relative flex w-full items-center rounded-md border border-input shadow-xs transition-[color,box-shadow] outline-none dark:bg-input/30",
        "h-9 min-w-0",
        "has-[>[data-align=inline-start]]:[&>input]:pl-2",
        "has-[>[data-align=inline-end]]:[&>input]:pr-2",
        "has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-[3px] has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50",
        "has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-destructive/20 dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40",
        t
      ),
      ...e
    }
  );
}
function J({
  className: t,
  align: e = "inline-start",
  ...o
}) {
  return /* @__PURE__ */ r(
    "div",
    {
      role: "group",
      "data-slot": "input-group-addon",
      "data-align": e,
      className: a(
        "flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium text-muted-foreground select-none [&>svg:not([class*='size-'])]:size-4",
        e === "inline-start" ? "order-first pl-3" : "order-last pr-3",
        t
      ),
      onClick: (d) => {
        var u, c;
        d.target.closest("button") || (c = (u = d.currentTarget.parentElement) == null ? void 0 : u.querySelector("input")) == null || c.focus();
      },
      ...o
    }
  );
}
function K({
  className: t,
  ...e
}) {
  return /* @__PURE__ */ r(
    k,
    {
      "data-slot": "input-group-control",
      className: a(
        "flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent",
        t
      ),
      ...e
    }
  );
}
function O({
  className: t,
  ...e
}) {
  return /* @__PURE__ */ r(
    m.Root,
    {
      "data-slot": "label",
      className: a(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        t
      ),
      ...e
    }
  );
}
function Q({
  className: t,
  value: e,
  ...o
}) {
  return /* @__PURE__ */ r(
    g.Root,
    {
      "data-slot": "progress",
      className: a(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
        t
      ),
      ...o,
      children: /* @__PURE__ */ r(
        g.Indicator,
        {
          "data-slot": "progress-indicator",
          className: "h-full w-full flex-1 bg-primary transition-all",
          style: { transform: `translateX(-${100 - (e || 0)}%)` }
        }
      )
    }
  );
}
function U({ className: t = "" }) {
  return /* @__PURE__ */ r(
    "span",
    {
      className: `spinner inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin ${t}`.trim()
    }
  );
}
function W({
  delayDuration: t = 0,
  ...e
}) {
  return /* @__PURE__ */ r(
    i.Provider,
    {
      "data-slot": "tooltip-provider",
      delayDuration: t,
      ...e
    }
  );
}
function Y({
  ...t
}) {
  return /* @__PURE__ */ r(i.Root, { "data-slot": "tooltip", ...t });
}
function Z({
  ...t
}) {
  return /* @__PURE__ */ r(i.Trigger, { "data-slot": "tooltip-trigger", ...t });
}
function tt({
  className: t,
  sideOffset: e = 0,
  children: o,
  ...n
}) {
  return /* @__PURE__ */ r(i.Portal, { children: /* @__PURE__ */ r(
    i.Content,
    {
      "data-slot": "tooltip-content",
      sideOffset: e,
      className: a(
        "z-50 w-fit animate-in rounded-md bg-foreground px-3 py-1.5 text-xs text-balance text-background fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        t
      ),
      ...n,
      children: o
    }
  ) });
}
export {
  I as Alert,
  D as AlertDescription,
  M as AlertTitle,
  B as Avatar,
  R as AvatarFallback,
  A as AvatarImage,
  at as Badge,
  S as Breadcrumb,
  P as BreadcrumbItem,
  j as BreadcrumbLink,
  $ as BreadcrumbList,
  G as BreadcrumbPage,
  L as BreadcrumbSeparator,
  ot as Button,
  V as ButtonGroup,
  _ as ButtonGroupText,
  nt as Card,
  it as CardContent,
  st as CardDescription,
  lt as CardFooter,
  dt as CardHeader,
  ut as CardTitle,
  F as Checkbox,
  q as Collapsible,
  E as CollapsibleContent,
  H as CollapsibleTrigger,
  ct as Dialog,
  pt as DialogClose,
  gt as DialogContent,
  bt as DialogDescription,
  ft as DialogFooter,
  mt as DialogHeader,
  vt as DialogTitle,
  xt as DialogTrigger,
  k as Input,
  X as InputGroup,
  J as InputGroupAddon,
  K as InputGroupInput,
  O as Label,
  kt as Menubar,
  wt as MenubarCheckboxItem,
  Nt as MenubarContent,
  yt as MenubarItem,
  Tt as MenubarMenu,
  zt as MenubarSeparator,
  It as MenubarShortcut,
  Mt as MenubarSub,
  Dt as MenubarSubContent,
  Bt as MenubarSubTrigger,
  At as MenubarTrigger,
  Q as Progress,
  U as Spinner,
  Y as Tooltip,
  tt as TooltipContent,
  W as TooltipProvider,
  Z as TooltipTrigger,
  C as buttonGroupVariants,
  ht as buttonVariants
};
