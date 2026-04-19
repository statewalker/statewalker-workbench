import { useEffect as f, useState as s } from "react";

function c(...o) {
  const [, e] = s({});
  f(() => {
    const n = () => e({}),
      r = o.map((t) => t(n));
    return () => {
      for (const t of r) t == null || t();
    };
  }, o);
}
export { c as useUpdates };
