import { ActionButtonView as I, ActionGroupView as L, ButtonView as E, FileTriggerView as q, LogicButtonView as Q, ToggleButtonView as G, ListBoxView as N, ListView as W, TableView as H, TagGroupView as _, TreeView as j, ColorAreaView as J, ColorFieldView as $, ColorPickerView as X, ColorSliderView as Y, ColorSwatchPickerView as Z, ColorSwatchView as m, ColorWheelView as ee, AvatarView as ne, HeadingView as ie, ImageView as re, KbdView as te, LabeledValueView as ae, TextView as se, WellView as ce, JsonView as le, CalendarView as ue, DateFieldView as oe, DatePickerView as he, DateRangePickerView as de, RangeCalendarView as pe, TimeFieldView as ge, BadgeView as be, EmptyView as ve, InlineAlertView as fe, MeterView as Re, ProgressBarView as we, ProgressCircleView as Ve, SkeletonView as ye, SpinnerView as Ce, StatusLightView as Se, ToastView as xe, CheckboxGroupView as Ue, CheckboxView as De, ComboBoxView as ke, FormView as Ae, NumberFieldView as Me, PickerView as ze, RadioGroupView as Pe, RangeSliderView as Fe, SearchFieldView as Ke, SliderView as Te, SwitchView as Oe, TextAreaView as Be, TextFieldView as Ie, CardView as Le, CollapsibleView as Ee, ContentPanelView as qe, DividerView as Qe, FlexView as Ge, GridView as Ne, ScrollAreaView as We, SidebarView as He, ActionBarView as _e, ActionMenuView as je, MenuBarView as Je, MenuView as $e, MenuTriggerView as Xe, AccordionView as Ye, BreadcrumbView as Ze, LinkView as me, PaginationView as en, TabsView as nn, AlertDialogView as rn, ContextualHelpView as tn, DialogView as an, PopoverView as sn, SheetView as cn, TooltipView as ln } from "@repo/shared-views";
import { jsx as i, jsxs as s } from "react/jsx-runtime";
import { ActionButton as f, ActionGroup as un, Item as u, Button as x, FileTrigger as on, LogicButton as hn, ToggleButton as dn, ListBox as pn, ListView as gn, Flex as h, Checkbox as y, Text as R, TagGroup as bn, View as p, ColorArea as U, ColorField as vn, ColorSlider as D, ColorSwatch as k, ColorSwatchPicker as fn, ColorWheel as Rn, Avatar as wn, Heading as w, Image as Vn, Keyboard as yn, LabeledValue as Cn, Well as Sn, Calendar as xn, DateField as Un, DatePicker as Dn, DateRangePicker as kn, RangeCalendar as An, TimeField as Mn, Badge as zn, IllustratedMessage as Pn, Content as V, InlineAlert as Fn, Meter as Kn, ProgressBar as Tn, ProgressCircle as A, StatusLight as On, CheckboxGroup as Bn, ComboBox as In, Form as Ln, NumberField as En, Picker as qn, RadioGroup as Qn, Radio as Gn, RangeSlider as Nn, SearchField as Wn, Slider as Hn, Switch as _n, TextArea as jn, TextField as Jn, Disclosure as M, DisclosureTitle as z, DisclosurePanel as P, Divider as $n, Grid as Xn, ActionBar as Yn, ActionMenu as Zn, MenuTrigger as F, Menu as K, Breadcrumbs as mn, Link as ei, Tabs as ni, TabList as ii, TabPanels as ri, AlertDialog as ti, ContextualHelp as ai, Dialog as C, Tooltip as si } from "@adobe/react-spectrum";
import { useUpdates as t } from "@repo/shared-react/hooks";
import { parseColor as c } from "@react-stately/color";
import { useComponentRegistry as T } from "@repo/shared-react/component-registry";
import { parseDate as b, parseTime as ci } from "@internationalized/date";
function li({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(
    f,
    {
      isQuiet: e.isQuiet,
      isDisabled: e.action.disabled,
      staticColor: e.staticColor,
      onPress: () => e.action.submit(),
      children: e.action.label
    }
  );
}
function ui({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(
    un,
    {
      orientation: e.orientation,
      density: e.density,
      isJustified: e.isJustified,
      isQuiet: e.isQuiet,
      isEmphasized: e.isEmphasized,
      selectionMode: e.selectionMode,
      selectedKeys: e.selectedKeys,
      disabledKeys: e.disabledKeys,
      onAction: (n) => {
        const r = e.children.find((a) => a.actionKey === String(n));
        r == null || r.submit();
      },
      children: e.children.map((n) => /* @__PURE__ */ i(u, { children: n.label }, n.actionKey))
    }
  );
}
function oi({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(
    x,
    {
      variant: e.action.variant === "danger" ? "negative" : e.action.variant === "primary" ? "accent" : "secondary",
      isPending: e.isPending,
      isDisabled: e.action.disabled,
      staticColor: e.staticColor,
      onPress: () => e.action.submit(),
      children: e.action.label
    }
  );
}
function hi({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(
    on,
    {
      acceptedFileTypes: e.acceptedFileTypes,
      allowsMultiple: e.allowsMultiple,
      children: /* @__PURE__ */ i(x, { variant: "primary", children: e.action.label })
    }
  );
}
function di({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(hn, { variant: e.logicVariant, onPress: () => e.toggle() });
}
function pi({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(
    dn,
    {
      isSelected: e.isSelected,
      isEmphasized: e.isEmphasized,
      onChange: () => e.toggle(),
      children: e.action.label
    }
  );
}
function gi({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(
    pn,
    {
      selectionMode: e.selectionMode,
      selectedKeys: e.selectedKeys,
      disabledKeys: e.disabledKeys,
      onSelectionChange: (n) => {
        n === "all" ? e.selectedKeys = new Set(e.items.map((r) => r.key)) : e.selectedKeys = new Set([...n].map(String));
      },
      children: e.items.map((n) => /* @__PURE__ */ i(u, { textValue: n.label, children: n.label }, n.key))
    }
  );
}
function bi({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(
    gn,
    {
      selectionMode: e.selectionMode,
      selectedKeys: e.selectedKeys,
      disabledKeys: e.disabledKeys,
      density: e.density,
      overflowMode: e.overflowMode,
      onSelectionChange: (n) => {
        n === "all" ? e.selectedKeys = new Set(e.items.map((r) => r.key)) : e.selectedKeys = new Set([...n].map(String));
      },
      children: e.items.map((n) => /* @__PURE__ */ i(u, { textValue: n.label, children: n.label }, n.key))
    }
  );
}
function vi({ model: e }) {
  t(e.onUpdate);
  const n = e.sortedRows, r = e.selectionMode !== "none";
  return /* @__PURE__ */ i(h, { direction: "column", width: "100%", UNSAFE_style: { overflow: "auto" }, children: /* @__PURE__ */ s("table", { style: { width: "100%", borderCollapse: "collapse" }, children: [
    /* @__PURE__ */ i("thead", { children: /* @__PURE__ */ s("tr", { children: [
      r && /* @__PURE__ */ i("th", { style: { padding: "6px 8px", textAlign: "left", width: 32 }, children: /* @__PURE__ */ i(
        y,
        {
          isSelected: n.length > 0 && e.selectedKeys.size === n.length,
          onChange: (a) => {
            a ? e.selectAll() : e.selectedKeys = /* @__PURE__ */ new Set();
          },
          "aria-label": "Select all"
        }
      ) }),
      e.columns.map((a) => {
        var d;
        return /* @__PURE__ */ i(
          "th",
          {
            style: {
              padding: "6px 12px",
              textAlign: "left",
              cursor: a.sortable ? "pointer" : "default",
              width: a.width,
              fontWeight: 600
            },
            onClick: a.sortable ? () => e.sort(a.key) : void 0,
            children: /* @__PURE__ */ s(R, { UNSAFE_style: { fontWeight: 600 }, children: [
              a.label,
              ((d = e.sortDescriptor) == null ? void 0 : d.column) === a.key && (e.sortDescriptor.direction === "ascending" ? " ▲" : " ▼")
            ] })
          },
          a.key
        );
      })
    ] }) }),
    /* @__PURE__ */ i("tbody", { children: n.map((a) => {
      const d = e.rowKey(a), v = e.selectedKeys.has(d);
      return /* @__PURE__ */ s(
        "tr",
        {
          style: {
            background: v ? "var(--spectrum-alias-highlight-selected)" : void 0
          },
          children: [
            r && /* @__PURE__ */ i("td", { style: { padding: "4px 8px" }, children: /* @__PURE__ */ i(
              y,
              {
                isSelected: v,
                onChange: () => {
                  const o = new Set(e.selectedKeys);
                  v ? o.delete(d) : o.add(d), e.selectedKeys = o;
                },
                "aria-label": `Select row ${d}`
              }
            ) }),
            e.columns.map((o) => /* @__PURE__ */ i("td", { style: { padding: "4px 12px" }, children: /* @__PURE__ */ i(R, { children: o.render ? String(
              o.render(
                a[o.key],
                a
              ) ?? ""
            ) : String(
              a[o.key] ?? ""
            ) }) }, o.key))
          ]
        },
        d
      );
    }) })
  ] }) });
}
function fi({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(
    bn,
    {
      label: e.label,
      errorMessage: e.errorMessage,
      maxRows: e.maxRows,
      onRemove: (n) => {
        for (const r of n)
          e.removeItem(String(r));
      },
      children: e.items.map((n) => /* @__PURE__ */ i(u, { children: n.label }, n.key))
    }
  );
}
function O({
  node: e,
  model: n,
  depth: r
}) {
  var o;
  const a = n.isExpanded(e.key), d = n.isSelected(e.key), v = e.children && e.children.length > 0;
  return /* @__PURE__ */ s("div", { children: [
    /* @__PURE__ */ s(
      h,
      {
        direction: "row",
        gap: "size-50",
        alignItems: "center",
        UNSAFE_style: { paddingLeft: `${r * 16}px` },
        children: [
          v ? /* @__PURE__ */ i(f, { isQuiet: !0, onPress: () => n.toggleExpand(e.key), children: a ? "▼" : "▶" }) : /* @__PURE__ */ i(p, { width: "size-300" }),
          /* @__PURE__ */ i(
            R,
            {
              UNSAFE_style: {
                fontWeight: d ? "bold" : "normal",
                cursor: "pointer"
              },
              children: /* @__PURE__ */ i(
                "span",
                {
                  onClick: () => n.select(e.key),
                  onKeyDown: () => {
                  },
                  role: "treeitem",
                  tabIndex: 0,
                  children: e.label
                }
              )
            }
          )
        ]
      }
    ),
    v && a && /* @__PURE__ */ i("div", { children: (o = e.children) == null ? void 0 : o.map((S) => /* @__PURE__ */ i(
      O,
      {
        node: S,
        model: n,
        depth: r + 1
      },
      S.key
    )) })
  ] });
}
function Ri({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i("div", { role: "tree", children: e.roots.map((n) => /* @__PURE__ */ i(O, { node: n, model: e, depth: 0 }, n.key)) });
}
function wi({ model: e }) {
  t(e.onUpdate);
  let n;
  try {
    n = c(e.value);
  } catch {
    n = c("#ff0000");
  }
  return /* @__PURE__ */ i(
    U,
    {
      value: n,
      xChannel: e.xChannel,
      yChannel: e.yChannel,
      isDisabled: e.isDisabled,
      onChange: (r) => {
        e.value = r.toString("hex");
      }
    }
  );
}
function Vi({ model: e }) {
  t(e.onUpdate);
  let n;
  try {
    n = c(e.value);
  } catch {
    n = c("#000000");
  }
  return /* @__PURE__ */ i(
    vn,
    {
      label: e.label,
      value: n,
      isDisabled: e.isDisabled,
      isReadOnly: e.isReadOnly,
      onChange: (r) => {
        r && (e.value = r.toString("hex"));
      }
    }
  );
}
function yi({ model: e }) {
  t(e.onUpdate);
  let n;
  try {
    n = c(e.value).toFormat("hsb");
  } catch {
    n = c("#000000").toFormat("hsb");
  }
  return /* @__PURE__ */ s(h, { direction: "column", gap: "size-100", children: [
    /* @__PURE__ */ i(
      U,
      {
        value: n,
        onChange: (r) => {
          e.value = r.toString("hex");
        }
      }
    ),
    /* @__PURE__ */ i(
      D,
      {
        value: n,
        channel: "hue",
        onChange: (r) => {
          e.value = r.toString("hex");
        }
      }
    )
  ] });
}
function Ci({ model: e }) {
  t(e.onUpdate);
  let n;
  try {
    n = c(e.value).toFormat("hsb");
  } catch {
    n = c("#ff0000").toFormat("hsb");
  }
  return /* @__PURE__ */ i(
    D,
    {
      value: n,
      channel: e.channel,
      label: e.label,
      isDisabled: e.isDisabled,
      onChange: (r) => {
        e.value = r.toString("hex");
      }
    }
  );
}
function Si({ model: e }) {
  t(e.onUpdate);
  let n;
  try {
    n = c(e.color);
  } catch {
    n = c("#000000");
  }
  return /* @__PURE__ */ i(k, { color: n, size: e.size });
}
function xi({
  model: e
}) {
  t(e.onUpdate);
  let n;
  try {
    n = e.selectedColor ? c(e.selectedColor) : void 0;
  } catch {
    n = void 0;
  }
  return /* @__PURE__ */ i(
    fn,
    {
      value: n,
      size: e.size,
      rounding: e.rounding === "regular" ? "default" : e.rounding,
      onChange: (r) => {
        e.selectedColor = r.toString("hex");
      },
      children: e.colors.map((r) => {
        let a;
        try {
          a = c(r);
        } catch {
          a = c("#000000");
        }
        return /* @__PURE__ */ i(k, { color: a }, r);
      })
    }
  );
}
function Ui({ model: e }) {
  t(e.onUpdate);
  let n;
  try {
    n = c(e.value).toFormat("hsb");
  } catch {
    n = c("#ff0000").toFormat("hsb");
  }
  return /* @__PURE__ */ i(
    Rn,
    {
      value: n,
      size: e.size,
      isDisabled: e.isDisabled,
      onChange: (r) => {
        e.value = r.toString("hex");
      }
    }
  );
}
function Di({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(
    wn,
    {
      src: e.src,
      alt: e.alt,
      size: e.size,
      isDisabled: e.isDisabled
    }
  );
}
function ki({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(w, { level: e.level, children: e.text });
}
function Ai({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(
    Vn,
    {
      src: e.src,
      alt: e.alt,
      objectFit: e.objectFit,
      width: e.width,
      height: e.height
    }
  );
}
function Mi({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(yn, { children: e.keys });
}
function zi({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(Cn, { label: e.label, value: String(e.value) });
}
function Pi({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(R, { children: e.text });
}
function g({ value: e }) {
  const n = T();
  if (typeof e == "string")
    return /* @__PURE__ */ i("span", { children: e });
  const r = n.resolve(e);
  return r ? /* @__PURE__ */ i(r, { model: e }) : /* @__PURE__ */ i("span", { children: "No renderer" });
}
function l({ model: e }) {
  const r = T().resolve(e);
  return r ? /* @__PURE__ */ i(r, { model: e }) : /* @__PURE__ */ i("span", { children: "No renderer" });
}
function Fi({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(
    Sn,
    {
      role: e.role === "group" || e.role === "region" ? e.role : void 0,
      children: e.children.map((n) => /* @__PURE__ */ i(l, { model: n }, n.key))
    }
  );
}
function Ki({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ s(p, { children: [
    e.label && /* @__PURE__ */ i("div", { style: { fontWeight: "bold", marginBottom: 4 }, children: e.label }),
    /* @__PURE__ */ i(
      "pre",
      {
        style: {
          margin: 0,
          padding: 8,
          overflow: "auto",
          fontSize: 12,
          fontFamily: "monospace",
          background: "var(--spectrum-gray-100)",
          borderRadius: 4
        },
        children: JSON.stringify(e.data, null, 2)
      }
    )
  ] });
}
function Ti({ model: e }) {
  t(e.onUpdate);
  let n;
  try {
    n = e.value ? b(e.value) : void 0;
  } catch {
    n = void 0;
  }
  return /* @__PURE__ */ i(
    xn,
    {
      value: n,
      isDisabled: e.isDisabled,
      isReadOnly: e.isReadOnly,
      onChange: (r) => {
        e.value = r.toString();
      }
    }
  );
}
function Oi({ model: e }) {
  t(e.onUpdate);
  let n;
  try {
    n = e.value ? b(e.value) : void 0;
  } catch {
    n = void 0;
  }
  return /* @__PURE__ */ i(
    Un,
    {
      label: e.label,
      value: n,
      granularity: e.granularity,
      isDisabled: e.isDisabled,
      isReadOnly: e.isReadOnly,
      isRequired: e.isRequired,
      errorMessage: e.errorMessage,
      description: e.description,
      onChange: (r) => {
        e.value = r == null ? void 0 : r.toString();
      }
    }
  );
}
function Bi({ model: e }) {
  t(e.onUpdate);
  let n;
  try {
    n = e.value ? b(e.value) : void 0;
  } catch {
    n = void 0;
  }
  return /* @__PURE__ */ i(
    Dn,
    {
      label: e.label,
      value: n,
      granularity: e.granularity,
      isDisabled: e.isDisabled,
      isReadOnly: e.isReadOnly,
      isRequired: e.isRequired,
      errorMessage: e.errorMessage,
      description: e.description,
      isOpen: e.isOpen,
      onChange: (r) => {
        e.value = r == null ? void 0 : r.toString();
      },
      onOpenChange: (r) => {
        e.isOpen = r;
      }
    }
  );
}
function Ii({
  model: e
}) {
  t(e.onUpdate);
  let n;
  try {
    e.startValue && e.endValue && (n = {
      start: b(e.startValue),
      end: b(e.endValue)
    });
  } catch {
    n = void 0;
  }
  return /* @__PURE__ */ i(
    kn,
    {
      label: e.label,
      value: n,
      granularity: e.granularity,
      isDisabled: e.isDisabled,
      isOpen: e.isOpen,
      onChange: (r) => {
        r && e.setRange(r.start.toString(), r.end.toString());
      },
      onOpenChange: (r) => {
        e.isOpen = r;
      }
    }
  );
}
function Li({ model: e }) {
  t(e.onUpdate);
  let n;
  try {
    e.startValue && e.endValue && (n = {
      start: b(e.startValue),
      end: b(e.endValue)
    });
  } catch {
    n = void 0;
  }
  return /* @__PURE__ */ i(
    An,
    {
      value: n,
      isDisabled: e.isDisabled,
      isReadOnly: e.isReadOnly,
      onChange: (r) => {
        r && e.setRange(r.start.toString(), r.end.toString());
      }
    }
  );
}
function Ei({ model: e }) {
  t(e.onUpdate);
  let n;
  try {
    n = e.value ? ci(e.value) : void 0;
  } catch {
    n = void 0;
  }
  return /* @__PURE__ */ i(
    Mn,
    {
      label: e.label,
      value: n,
      granularity: e.granularity,
      hourCycle: e.hourCycle,
      isDisabled: e.isDisabled,
      isReadOnly: e.isReadOnly,
      isRequired: e.isRequired,
      errorMessage: e.errorMessage,
      onChange: (r) => {
        e.value = r == null ? void 0 : r.toString();
      }
    }
  );
}
function qi({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(zn, { variant: e.variant === "informative" ? "info" : e.variant, children: e.label });
}
function Qi({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ s(Pn, { children: [
    /* @__PURE__ */ i(w, { children: e.heading }),
    e.description && /* @__PURE__ */ i(V, { children: e.description })
  ] });
}
function Gi({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ s(
    Fn,
    {
      variant: e.variant === "informative" ? "info" : e.variant,
      children: [
        e.header && /* @__PURE__ */ i(w, { children: e.header }),
        /* @__PURE__ */ i(V, { children: /* @__PURE__ */ i(g, { value: e.content }) })
      ]
    }
  );
}
function Ni({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(
    Kn,
    {
      label: e.label,
      value: e.value,
      minValue: e.minValue,
      maxValue: e.maxValue,
      size: e.size === "M" ? "S" : e.size,
      variant: e.variant
    }
  );
}
function Wi({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(
    Tn,
    {
      label: e.label,
      value: e.value ?? void 0,
      minValue: e.minValue,
      maxValue: e.maxValue,
      size: e.size === "M" ? "S" : e.size,
      labelPosition: e.labelPosition,
      showValueLabel: e.showValueLabel,
      variant: e.variant,
      isIndeterminate: e.isIndeterminate
    }
  );
}
function Hi({
  model: e
}) {
  return t(e.onUpdate), /* @__PURE__ */ i(
    A,
    {
      value: e.value ?? void 0,
      minValue: e.minValue,
      maxValue: e.maxValue,
      size: e.size,
      variant: e.variant,
      isIndeterminate: e.isIndeterminate
    }
  );
}
function _i({ model: e }) {
  t(e.onUpdate);
  const n = e.variant === "circular" ? "50%" : e.variant === "text" ? "4px" : "8px";
  return /* @__PURE__ */ i(
    p,
    {
      UNSAFE_style: {
        width: e.width ?? "100%",
        height: e.height ?? (e.variant === "text" ? "1em" : "48px"),
        borderRadius: n,
        background: "var(--spectrum-gray-300)",
        animation: "pulse 1.5s ease-in-out infinite"
      }
    }
  );
}
function ji({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(
    A,
    {
      "aria-label": e.label ?? "Loading",
      isIndeterminate: !0,
      size: e.size
    }
  );
}
function Ji({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(On, { variant: e.variant, children: e.label });
}
function $i({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ s(
    h,
    {
      direction: "row",
      gap: "size-100",
      alignItems: "center",
      UNSAFE_style: { padding: "8px 16px" },
      children: [
        /* @__PURE__ */ i(R, { children: e.message }),
        e.action && /* @__PURE__ */ i(
          "button",
          {
            type: "button",
            onClick: () => {
              var n;
              return (n = e.action) == null ? void 0 : n.submit();
            },
            style: {
              cursor: "pointer",
              textDecoration: "underline",
              background: "none",
              border: "none",
              padding: 0
            },
            children: e.action.label
          }
        )
      ]
    }
  );
}
function Xi({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(
    y,
    {
      isSelected: e.isSelected,
      isIndeterminate: e.isIndeterminate,
      isDisabled: e.isDisabled,
      isReadOnly: e.isReadOnly,
      isRequired: e.isRequired,
      isEmphasized: e.isEmphasized,
      onChange: () => e.toggle(),
      children: e.label
    }
  );
}
function Yi({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(
    Bn,
    {
      label: e.label,
      value: e.value,
      orientation: e.orientation,
      isRequired: e.isRequired,
      isDisabled: e.isDisabled,
      errorMessage: e.errorMessage,
      onChange: (n) => {
        e.value = n;
      },
      children: e.children.map((n) => /* @__PURE__ */ i(y, { value: n.key, children: n.label }, n.key))
    }
  );
}
function Zi({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(
    In,
    {
      label: e.label,
      selectedKey: e.selectedKey,
      inputValue: e.inputValue,
      placeholder: e.placeholder,
      isDisabled: e.isDisabled,
      isRequired: e.isRequired,
      isQuiet: e.isQuiet,
      errorMessage: e.errorMessage,
      allowsCustomValue: e.allowsCustomValue,
      menuTrigger: e.menuTrigger,
      onSelectionChange: (n) => {
        e.selectedKey = n != null ? String(n) : void 0;
      },
      onInputChange: (n) => {
        e.inputValue = n;
      },
      children: e.items.map((n) => /* @__PURE__ */ i(u, { children: n.label }, n.key))
    }
  );
}
function mi({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(
    Ln,
    {
      labelPosition: e.labelPosition,
      labelAlign: e.labelAlign,
      isRequired: e.isRequired,
      isDisabled: e.isDisabled,
      isReadOnly: e.isReadOnly,
      validationBehavior: e.validationBehavior,
      necessityIndicator: e.necessityIndicator,
      children: e.children.map((n) => /* @__PURE__ */ i(l, { model: n }, n.key))
    }
  );
}
function er({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(
    En,
    {
      label: e.label,
      value: e.value ?? void 0,
      minValue: e.minValue,
      maxValue: e.maxValue,
      step: e.step,
      formatOptions: e.formatOptions,
      isRequired: e.isRequired,
      isDisabled: e.isDisabled,
      isReadOnly: e.isReadOnly,
      errorMessage: e.errorMessage,
      description: e.description,
      onChange: (n) => {
        e.value = n;
      }
    }
  );
}
function nr({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(
    qn,
    {
      label: e.label,
      selectedKey: e.selectedKey,
      placeholder: e.placeholder,
      isDisabled: e.isDisabled,
      isRequired: e.isRequired,
      isQuiet: e.isQuiet,
      errorMessage: e.errorMessage,
      onSelectionChange: (n) => {
        e.selectedKey = String(n);
      },
      children: e.items.map((n) => /* @__PURE__ */ i(u, { children: n.label }, n.key))
    }
  );
}
function ir({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(
    Qn,
    {
      label: e.label,
      value: e.value ?? "",
      orientation: e.orientation,
      isRequired: e.isRequired,
      isDisabled: e.isDisabled,
      isReadOnly: e.isReadOnly,
      errorMessage: e.errorMessage,
      onChange: (n) => {
        e.value = n;
      },
      children: e.options.map((n) => /* @__PURE__ */ i(Gn, { value: n.value, isDisabled: n.disabled, children: n.label }, n.value))
    }
  );
}
function rr({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(
    Nn,
    {
      label: e.label,
      value: { start: e.startValue, end: e.endValue },
      minValue: e.minValue,
      maxValue: e.maxValue,
      step: e.step,
      isDisabled: e.isDisabled,
      onChange: (n) => {
        e.setRange(n.start, n.end);
      }
    }
  );
}
function tr({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(
    Wn,
    {
      label: e.label,
      value: e.value,
      placeholder: e.placeholder,
      isDisabled: e.isDisabled,
      isQuiet: e.isQuiet,
      onChange: (n) => {
        e.value = n;
      },
      onClear: () => e.clear()
    }
  );
}
function ar({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(
    Hn,
    {
      label: e.label,
      value: e.value,
      minValue: e.minValue,
      maxValue: e.maxValue,
      step: e.step,
      isFilled: e.isFilled,
      isDisabled: e.isDisabled,
      orientation: e.orientation,
      formatOptions: e.formatOptions,
      onChange: (n) => {
        e.value = n;
      }
    }
  );
}
function sr({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(
    _n,
    {
      isSelected: e.isSelected,
      isDisabled: e.isDisabled,
      isReadOnly: e.isReadOnly,
      isEmphasized: e.isEmphasized,
      onChange: () => e.toggle(),
      children: e.label
    }
  );
}
function cr({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(
    jn,
    {
      label: e.label,
      value: e.value,
      placeholder: e.placeholder,
      description: e.description,
      errorMessage: e.errorMessage,
      isRequired: e.isRequired,
      isDisabled: e.isDisabled,
      isReadOnly: e.isReadOnly,
      isQuiet: e.isQuiet,
      maxLength: e.maxLength,
      labelPosition: e.labelPosition,
      onChange: (n) => {
        e.value = n;
      }
    }
  );
}
function lr({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(
    Jn,
    {
      label: e.label,
      value: e.value,
      placeholder: e.placeholder,
      description: e.description,
      errorMessage: e.errorMessage,
      isRequired: e.isRequired,
      isDisabled: e.isDisabled,
      isReadOnly: e.isReadOnly,
      isQuiet: e.isQuiet,
      type: e.type,
      maxLength: e.maxLength,
      labelPosition: e.labelPosition,
      onChange: (n) => {
        e.value = n;
      }
    }
  );
}
function ur({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ s(
    p,
    {
      borderWidth: "thin",
      borderColor: "dark",
      borderRadius: "medium",
      padding: "size-200",
      children: [
        e.preview && /* @__PURE__ */ i(p, { marginBottom: "size-200", children: /* @__PURE__ */ i(l, { model: e.preview }) }),
        e.header && /* @__PURE__ */ i(w, { level: 3, children: /* @__PURE__ */ i(g, { value: e.header }) }),
        /* @__PURE__ */ i(h, { direction: "column", gap: "size-100", children: e.children.map((n) => /* @__PURE__ */ i(l, { model: n }, n.key)) }),
        e.footer && /* @__PURE__ */ i(p, { marginTop: "size-200", children: /* @__PURE__ */ i(g, { value: e.footer }) })
      ]
    }
  );
}
function or({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ s(
    M,
    {
      isExpanded: e.isOpen,
      onExpandedChange: () => e.toggle(),
      children: [
        /* @__PURE__ */ i(z, { children: e.trigger.label }),
        /* @__PURE__ */ i(P, { children: e.children.map((n) => /* @__PURE__ */ i(l, { model: n }, n.key)) })
      ]
    }
  );
}
function hr({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ s(h, { direction: "column", gap: "size-200", children: [
    e.header && /* @__PURE__ */ i(p, { children: /* @__PURE__ */ i(g, { value: e.header }) }),
    e.children.map((n) => /* @__PURE__ */ i(l, { model: n }, n.key)),
    e.footer && /* @__PURE__ */ i(p, { children: /* @__PURE__ */ i(g, { value: e.footer }) })
  ] });
}
function dr({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i($n, { orientation: e.orientation, size: e.size });
}
function pr({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(
    h,
    {
      direction: e.direction,
      gap: e.gap,
      wrap: e.wrap,
      alignItems: e.alignItems,
      justifyContent: e.justifyContent,
      children: e.children.map((n) => /* @__PURE__ */ i(l, { model: n }, n.key))
    }
  );
}
function gr({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(
    Xn,
    {
      columns: e.columns,
      rows: e.rows,
      areas: e.areas.length > 0 ? e.areas : void 0,
      gap: e.gap,
      columnGap: e.columnGap,
      rowGap: e.rowGap,
      children: e.children.map((n) => /* @__PURE__ */ i(l, { model: n }, n.key))
    }
  );
}
function br({ model: e }) {
  t(e.onUpdate);
  const n = e.orientation === "horizontal" || e.orientation === "both" ? "auto" : "hidden", r = e.orientation === "vertical" || e.orientation === "both" ? "auto" : "hidden";
  return /* @__PURE__ */ i(
    p,
    {
      UNSAFE_style: {
        overflowX: n,
        overflowY: r,
        maxHeight: e.maxHeight ?? void 0
      },
      children: e.children.map((a) => /* @__PURE__ */ i(l, { model: a }, a.key))
    }
  );
}
function vr({ model: e }) {
  t(e.onUpdate);
  const n = e.isOpen ? e.expandedWidth : e.collapsedWidth;
  return /* @__PURE__ */ i(h, { direction: e.side === "right" ? "row-reverse" : "row", children: /* @__PURE__ */ i(
    p,
    {
      UNSAFE_style: {
        width: n,
        transition: "width 0.2s ease",
        overflow: "hidden"
      },
      children: e.children.map((r) => /* @__PURE__ */ i(l, { model: r }, r.key))
    }
  ) });
}
function fr({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(
    Yn,
    {
      isEmphasized: e.isEmphasized,
      selectedItemCount: e.selectedItemCount === 0 ? "all" : e.selectedItemCount,
      onAction: (n) => {
        const r = e.children.find((a) => a.actionKey === String(n));
        r == null || r.submit();
      },
      onClearSelection: () => e.setSelectedItemCount(0),
      children: e.children.map((n) => /* @__PURE__ */ i(u, { children: n.label }, n.actionKey))
    }
  );
}
function Rr({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(
    Zn,
    {
      isQuiet: e.isQuiet,
      isDisabled: e.action.disabled,
      onAction: (n) => {
        const r = e.items.find((a) => a.key === String(n));
        r == null || r.action.submit();
      },
      children: e.items.map((n) => /* @__PURE__ */ i(u, { children: n.action.label }, n.key))
    }
  );
}
function wr({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ s(F, { children: [
    /* @__PURE__ */ i(f, { children: "Menu" }),
    /* @__PURE__ */ i(
      K,
      {
        selectionMode: e.selectionMode,
        selectedKeys: e.selectedKeys,
        disabledKeys: e.disabledKeys,
        onAction: (n) => {
          const r = e.children.find((a) => a.key === String(n));
          r == null || r.action.submit();
        },
        children: e.children.map((n) => /* @__PURE__ */ i(u, { children: n.action.label }, n.key))
      }
    )
  ] });
}
function B({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ s(
    F,
    {
      isOpen: e.isOpen,
      onOpenChange: (n) => e.setOpen(n),
      children: [
        /* @__PURE__ */ i(f, { onPress: () => e.toggle(), children: e.trigger.label }),
        /* @__PURE__ */ i(
          K,
          {
            selectionMode: e.menu.selectionMode,
            selectedKeys: e.menu.selectedKeys,
            disabledKeys: e.menu.disabledKeys,
            onAction: (n) => {
              const r = e.menu.children.find((a) => a.key === String(n));
              r == null || r.action.submit();
            },
            children: e.menu.children.map((n) => /* @__PURE__ */ i(u, { children: n.action.label }, n.key))
          }
        )
      ]
    }
  );
}
function Vr({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(h, { direction: "row", gap: "size-0", children: e.children.map((n) => /* @__PURE__ */ i(B, { model: n }, n.key)) });
}
function yr({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(h, { direction: "column", gap: "size-0", children: e.items.map((n) => /* @__PURE__ */ s(
    M,
    {
      isExpanded: e.isExpanded(n.key),
      isDisabled: n.disabled,
      onExpandedChange: () => e.toggle(n.key),
      children: [
        /* @__PURE__ */ i(z, { children: n.title }),
        /* @__PURE__ */ i(P, { children: /* @__PURE__ */ i(l, { model: n.content }) })
      ]
    },
    n.key
  )) });
}
function Cr({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(
    mn,
    {
      size: e.size,
      isMultiline: e.isMultiline,
      onAction: (n) => {
        const r = e.items.findIndex((a) => a.key === String(n));
        if (r >= 0) {
          const a = e.items[r];
          a.action ? a.action.submit() : e.popTo(r);
        }
      },
      children: e.items.map((n) => /* @__PURE__ */ i(u, { children: n.label }, n.key))
    }
  );
}
function Sr({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(
    ei,
    {
      variant: e.variant,
      isQuiet: e.isQuiet,
      onPress: () => e.action.submit(),
      children: e.action.label
    }
  );
}
function xr({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ s(h, { direction: "row", gap: "size-100", alignItems: "center", children: [
    /* @__PURE__ */ i(
      f,
      {
        isDisabled: !e.hasPrevious,
        onPress: () => e.previous(),
        children: "Previous"
      }
    ),
    /* @__PURE__ */ s(R, { children: [
      e.page,
      " / ",
      e.totalPages
    ] }),
    /* @__PURE__ */ i(f, { isDisabled: !e.hasNext, onPress: () => e.next(), children: "Next" })
  ] });
}
function Ur({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ s(
    ni,
    {
      selectedKey: e.selectedKey,
      orientation: e.orientation,
      density: e.density,
      isQuiet: e.isQuiet,
      isEmphasized: e.isEmphasized,
      onSelectionChange: (n) => e.setSelectedKey(String(n)),
      children: [
        /* @__PURE__ */ i(ii, { children: e.tabs.map((n) => /* @__PURE__ */ i(u, { children: n.label }, n.key)) }),
        /* @__PURE__ */ i(ri, { children: e.tabs.map((n) => /* @__PURE__ */ i(u, { children: /* @__PURE__ */ i(l, { model: n.content }) }, n.key)) })
      ]
    }
  );
}
function Dr({ model: e }) {
  var n, r;
  return t(e.onUpdate), /* @__PURE__ */ i(
    ti,
    {
      variant: e.variant,
      title: typeof e.header == "string" ? e.header : "Alert",
      primaryActionLabel: e.primaryAction.label ?? "OK",
      secondaryActionLabel: (n = e.secondaryAction) == null ? void 0 : n.label,
      cancelLabel: (r = e.cancelAction) == null ? void 0 : r.label,
      onPrimaryAction: () => e.primaryAction.submit(),
      onSecondaryAction: () => {
        var a;
        return (a = e.secondaryAction) == null ? void 0 : a.submit();
      },
      onCancel: () => {
        var a;
        return (a = e.cancelAction) == null ? void 0 : a.submit();
      },
      children: typeof e.header == "string" ? e.header : ""
    }
  );
}
function kr({
  model: e
}) {
  return t(e.onUpdate), /* @__PURE__ */ s(ai, { variant: e.variant, children: [
    e.title && /* @__PURE__ */ i(w, { children: e.title }),
    /* @__PURE__ */ i(V, { children: /* @__PURE__ */ i(g, { value: e.content }) })
  ] });
}
function Ar({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ s(C, { size: e.size, isDismissable: e.isDismissable, children: [
    e.header && /* @__PURE__ */ i(w, { children: /* @__PURE__ */ i(g, { value: e.header }) }),
    /* @__PURE__ */ i(V, { children: e.children.map((n) => /* @__PURE__ */ i(l, { model: n }, n.key)) }),
    e.footer && /* @__PURE__ */ i(g, { value: e.footer })
  ] });
}
function Mr({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(C, { children: /* @__PURE__ */ i(V, { children: /* @__PURE__ */ i(l, { model: e.content }) }) });
}
function zr({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(C, { isDismissable: e.isDismissable, children: /* @__PURE__ */ i(V, { children: e.content && /* @__PURE__ */ i(l, { model: e.content }) }) });
}
function Pr({ model: e }) {
  return t(e.onUpdate), /* @__PURE__ */ i(si, { variant: e.variant, placement: e.placement, children: /* @__PURE__ */ i(g, { value: e.content }) });
}
function Er(e) {
  const n = [
    e.register(I, li),
    e.register(L, ui),
    e.register(E, oi),
    e.register(q, hi),
    e.register(Q, di),
    e.register(G, pi),
    e.register(N, gi),
    e.register(W, bi),
    e.register(H, vi),
    e.register(_, fi),
    e.register(j, Ri),
    e.register(J, wi),
    e.register($, Vi),
    e.register(X, yi),
    e.register(Y, Ci),
    e.register(Z, xi),
    e.register(m, Si),
    e.register(ee, Ui),
    e.register(ne, Di),
    e.register(ie, ki),
    e.register(re, Ai),
    e.register(te, Mi),
    e.register(ae, zi),
    e.register(se, Pi),
    e.register(ce, Fi),
    e.register(le, Ki),
    e.register(ue, Ti),
    e.register(oe, Oi),
    e.register(he, Bi),
    e.register(de, Ii),
    e.register(pe, Li),
    e.register(ge, Ei),
    e.register(be, qi),
    e.register(ve, Qi),
    e.register(fe, Gi),
    e.register(Re, Ni),
    e.register(we, Wi),
    e.register(Ve, Hi),
    e.register(ye, _i),
    e.register(Ce, ji),
    e.register(Se, Ji),
    e.register(xe, $i),
    e.register(Ue, Yi),
    e.register(De, Xi),
    e.register(ke, Zi),
    e.register(Ae, mi),
    e.register(Me, er),
    e.register(ze, nr),
    e.register(Pe, ir),
    e.register(Fe, rr),
    e.register(Ke, tr),
    e.register(Te, ar),
    e.register(Oe, sr),
    e.register(Be, cr),
    e.register(Ie, lr),
    e.register(Le, ur),
    e.register(Ee, or),
    e.register(qe, hr),
    e.register(Qe, dr),
    e.register(Ge, pr),
    e.register(Ne, gr),
    e.register(We, br),
    e.register(He, vr),
    e.register(_e, fr),
    e.register(je, Rr),
    e.register(Je, Vr),
    e.register($e, wr),
    e.register(Xe, B),
    e.register(Ye, yr),
    e.register(Ze, Cr),
    e.register(me, Sr),
    e.register(en, xr),
    e.register(nn, Ur),
    e.register(rn, Dr),
    e.register(tn, kr),
    e.register(an, Ar),
    e.register(sn, Mr),
    e.register(cn, zr),
    e.register(ln, Pr)
  ];
  return () => {
    for (const r of n) r();
  };
}
export {
  Er as initSpectrumViews
};
