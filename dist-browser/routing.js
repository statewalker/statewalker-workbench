import { newRegistry as r } from "@repo/shared/registry";
function c(e) {
  const [t, s] = r(), o = n();
  o && e.setRouteId(o), t(
    e.onRouteIdChanged(() => {
      h(e.routeId);
    })
  );
  const i = () => {
    e.setRouteId(n());
  };
  return window.addEventListener("hashchange", i), t(() => window.removeEventListener("hashchange", i)), s;
}
function n() {
  const e = window.location.hash;
  return e.startsWith("#") ? decodeURIComponent(e.slice(1)) : "";
}
function h(e) {
  n() !== e && (e ? window.history.replaceState(null, "", `#${encodeURIComponent(e)}`) : window.history.replaceState(
    null,
    "",
    window.location.pathname + window.location.search
  ));
}
export {
  c as bindHashRouting
};
