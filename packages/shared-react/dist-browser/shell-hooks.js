import { useEffect as f, useState as i } from "react";
function E(e, t) {
  f(() => {
    function n(u) {
      var c, d;
      if ((c = t == null ? void 0 : t.skip) != null && c.call(t)) return;
      const r = (d = document.activeElement) == null ? void 0 : d.tagName;
      if (r === "INPUT" || r === "TEXTAREA" || r === "SELECT" || document.querySelector("[role=dialog]")) return;
      const a = e().get(u.key);
      a && (u.preventDefault(), a());
    }
    return window.addEventListener("keydown", n), () => window.removeEventListener("keydown", n);
  }, [e, t]);
}
function g(e) {
  const [t, n] = i(() => e.getAll());
  return f(() => (n(e.getAll()), e.onUpdate(() => n(e.getAll()))), [e]), t;
}
export {
  E as useKeyboardDispatch,
  g as useModelItems
};
