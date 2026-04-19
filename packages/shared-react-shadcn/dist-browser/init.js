/* empty css               */
import {
  GridView as a,
  ContextMenuView as c,
  EmptyView as d,
  FlexView as i,
  TableView as l,
  DialogView as m,
  CardView as o,
  TreeView as p,
  SheetView as R,
  TabsView as s,
  AccordionView as t,
  JsonView as u,
  PaginationView as V,
  BreadcrumbView as w,
} from "@statewalker/shared-views";
import {
  B as A,
  P as B,
  F as b,
  C,
  S as D,
  b as E,
  D as F,
  E as f,
  T as G,
  d as g,
  e as J,
  J as P,
  G as T,
  A as x,
} from "./sheet.renderer-GaVVNgCX.js";

function j(e) {
  const r = [
    // Layout
    e.register(i, b),
    e.register(a, T),
    e.register(o, C),
    // Feedback
    e.register(d, f),
    // Navigation
    e.register(s, g),
    e.register(t, x),
    e.register(w, A),
    e.register(V, B),
    // Overlay
    e.register(R, D),
    e.register(c, E),
    e.register(m, F),
    // Data Display
    e.register(l, G),
    e.register(p, J),
    e.register(u, P),
  ];
  return () => {
    for (const n of r) n();
  };
}
export { j as initCommonViews };
