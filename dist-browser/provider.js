import { jsx as o } from "react/jsx-runtime";
import { Provider as i, defaultTheme as m } from "@adobe/react-spectrum";
function n({
  children: e,
  colorScheme: r = "light",
  locale: t = "en-US"
}) {
  return /* @__PURE__ */ o(
    i,
    {
      theme: m,
      colorScheme: r,
      locale: t,
      height: "100%",
      children: e
    }
  );
}
export {
  n as SpectrumProvider
};
