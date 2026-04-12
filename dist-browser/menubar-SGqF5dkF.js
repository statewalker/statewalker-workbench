import { jsx as a, jsxs as d } from "react/jsx-runtime";
import { CheckIcon as u, ChevronRightIcon as c } from "lucide-react";
import { Menubar as n } from "radix-ui";
import { c as o } from "./utils-gWiv5-6R.js";
function g({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ a(
    n.Root,
    {
      "data-slot": "menubar",
      className: o(
        "flex h-9 items-center gap-1 rounded-md border bg-background p-1 shadow-xs",
        e
      ),
      ...t
    }
  );
}
function x({
  ...e
}) {
  return /* @__PURE__ */ a(n.Menu, { "data-slot": "menubar-menu", ...e });
}
function m({
  ...e
}) {
  return /* @__PURE__ */ a(n.Portal, { "data-slot": "menubar-portal", ...e });
}
function v({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ a(
    n.Trigger,
    {
      "data-slot": "menubar-trigger",
      className: o(
        "flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
        e
      ),
      ...t
    }
  );
}
function h({
  className: e,
  align: t = "start",
  alignOffset: r = -4,
  sideOffset: s = 8,
  ...i
}) {
  return /* @__PURE__ */ a(m, { children: /* @__PURE__ */ a(
    n.Content,
    {
      "data-slot": "menubar-content",
      align: t,
      alignOffset: r,
      sideOffset: s,
      className: o(
        "z-50 min-w-[12rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-md border border-border/40 bg-popover p-1 text-popover-foreground shadow-md data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        e
      ),
      ...i
    }
  ) });
}
function M({
  className: e,
  inset: t,
  variant: r = "default",
  ...s
}) {
  return /* @__PURE__ */ a(
    n.Item,
    {
      "data-slot": "menubar-item",
      "data-inset": t,
      "data-variant": r,
      className: o(
        "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        e
      ),
      ...s
    }
  );
}
function z({
  className: e,
  children: t,
  checked: r,
  ...s
}) {
  return /* @__PURE__ */ d(
    n.CheckboxItem,
    {
      "data-slot": "menubar-checkbox-item",
      className: o(
        "relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        e
      ),
      checked: r,
      ...s,
      children: [
        /* @__PURE__ */ a("span", { className: "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ a(n.ItemIndicator, { children: /* @__PURE__ */ a(u, { className: "size-4" }) }) }),
        t
      ]
    }
  );
}
function N({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ a(
    n.Separator,
    {
      "data-slot": "menubar-separator",
      className: o("-mx-1 my-1 h-px bg-border", e),
      ...t
    }
  );
}
function k({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ a(
    "span",
    {
      "data-slot": "menubar-shortcut",
      className: o(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        e
      ),
      ...t
    }
  );
}
function w({
  ...e
}) {
  return /* @__PURE__ */ a(n.Sub, { "data-slot": "menubar-sub", ...e });
}
function S({
  className: e,
  inset: t,
  children: r,
  ...s
}) {
  return /* @__PURE__ */ d(
    n.SubTrigger,
    {
      "data-slot": "menubar-sub-trigger",
      "data-inset": t,
      className: o(
        "flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none focus:bg-accent focus:text-accent-foreground data-[inset]:pl-8 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
        e
      ),
      ...s,
      children: [
        r,
        /* @__PURE__ */ a(c, { className: "ml-auto h-4 w-4" })
      ]
    }
  );
}
function y({
  className: e,
  ...t
}) {
  return /* @__PURE__ */ a(
    n.SubContent,
    {
      "data-slot": "menubar-sub-content",
      className: o(
        "z-50 min-w-[8rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        e
      ),
      ...t
    }
  );
}
export {
  g as M,
  x as a,
  v as b,
  h as c,
  M as d,
  z as e,
  N as f,
  k as g,
  w as h,
  y as i,
  S as j
};
