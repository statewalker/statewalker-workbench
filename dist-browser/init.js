/* empty css               */
import { FlexView as i, GridView as a, CardView as o, EmptyView as d, TabsView as s, AccordionView as t, BreadcrumbView as w, PaginationView as V, SheetView as R, ContextMenuView as c, DialogView as m, TableView as l, TreeView as p, JsonView as u } from "@repo/shared-views";
import { F as b, G as T, C, E as f, d as g, A as x, B as A, P as B, S as D, b as E, D as F, T as G, e as J, J as P } from "./sheet.renderer-GaVVNgCX.js";
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
    e.register(u, P)
  ];
  return () => {
    for (const n of r)
      n();
  };
}
export {
  j as initCommonViews
};
