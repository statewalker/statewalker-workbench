import { useUpdates as n } from "@statewalker/shared-react/hooks";
import { createElement as C, useRef as R, useState as U } from "react";
import { jsxs as a, jsx as r } from "react/jsx-runtime";
import { a as d, R as o, c as u } from "./sheet.renderer-GaVVNgCX.js";

function I({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ a("button", {
      type: e.type,
      disabled: e.action.disabled || e.isPending,
      onClick: () => e.action.submit(),
      className: `inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
        disabled:pointer-events-none disabled:opacity-50
        bg-primary text-primary-foreground hover:bg-primary/90
        ${e.size === "S" ? "h-8 px-3 text-xs" : e.size === "L" ? "h-11 px-8 text-base" : e.size === "XL" ? "h-12 px-10 text-lg" : "h-9 px-4 text-sm"}`,
      children: [
        e.isPending &&
          /* @__PURE__ */ r("span", {
            className:
              "animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full",
          }),
        e.action.label ?? e.action.actionKey,
      ],
    })
  );
}
function A({ model: e }) {
  n(e.onUpdate);
  const t = R(null);
  return /* @__PURE__ */ a("div", {
    className: "inline-flex flex-col gap-1",
    children: [
      /* @__PURE__ */ r("button", {
        type: "button",
        disabled: e.action.disabled,
        onClick: () => {
          var s;
          return (s = t.current) == null ? void 0 : s.click();
        },
        className: `inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4
          bg-secondary text-secondary-foreground hover:bg-secondary/80
          disabled:pointer-events-none disabled:opacity-50 transition-colors`,
        children: e.action.label ?? "Choose file",
      }),
      /* @__PURE__ */ r("input", {
        ref: t,
        type: "file",
        className: "sr-only",
        accept: e.acceptedFileTypes.join(","),
        multiple: e.allowsMultiple,
        onChange: (s) => {
          var l;
          (l = s.target.files) != null && l.length && e.action.submit(s.target.files);
        },
      }),
    ],
  });
}
function T({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ r("button", {
      type: "button",
      "aria-pressed": e.isSelected,
      disabled: e.action.disabled,
      onClick: () => e.toggle(),
      className: `inline-flex items-center justify-center rounded-md font-medium transition-colors
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
        disabled:pointer-events-none disabled:opacity-50
        ${e.isSelected ? (e.isEmphasized ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground") : "bg-transparent hover:bg-accent hover:text-accent-foreground"}
        ${e.size === "XS" ? "h-7 px-2 text-xs" : e.size === "S" ? "h-8 px-3 text-xs" : e.size === "L" ? "h-11 px-8 text-base" : e.size === "XL" ? "h-12 px-10 text-lg" : "h-9 px-4 text-sm"}`,
      children: e.action.label ?? e.action.actionKey,
    })
  );
}
function P({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ r("div", {
      className: "overflow-auto rounded-md border border-border p-1",
      role: "listbox",
      children: e.items.map((t) => {
        const s = e.selectedKeys.has(t.key),
          l = e.disabledKeys.has(t.key);
        return /* @__PURE__ */ a(
          "div",
          {
            role: "option",
            "aria-selected": s,
            tabIndex: e.selectionMode !== "none" ? 0 : void 0,
            onClick: () => {
              e.selectionMode !== "none" && !l && e.toggleSelection(t.key);
            },
            onKeyDown: (i) => {
              (i.key === "Enter" || i.key === " ") &&
                e.selectionMode !== "none" &&
                !l &&
                (i.preventDefault(), e.toggleSelection(t.key));
            },
            className: `flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors
              ${s ? "bg-accent text-accent-foreground" : "hover:bg-muted/50"}
              ${l ? "opacity-50 pointer-events-none" : ""}
              ${e.selectionMode !== "none" ? "cursor-pointer" : ""}`,
            children: [
              t.icon && /* @__PURE__ */ r("span", { children: t.icon }),
              /* @__PURE__ */ a("div", {
                className: "flex flex-col min-w-0",
                children: [
                  /* @__PURE__ */ r("span", { children: t.label }),
                  t.description &&
                    /* @__PURE__ */ r("span", {
                      className: "text-xs text-muted-foreground",
                      children: t.description,
                    }),
                ],
              }),
            ],
          },
          t.key,
        );
      }),
    })
  );
}
const p = {
  compact: "px-2 py-1",
  regular: "px-3 py-2",
  spacious: "px-4 py-3",
};
function q({ model: e }) {
  n(e.onUpdate);
  const t = p[e.density] ?? p.regular;
  return /* @__PURE__ */ r("ul", {
    className: "overflow-auto rounded-md border border-border",
    children: e.items.map((s) => {
      const l = e.selectedKeys.has(s.key),
        i = e.disabledKeys.has(s.key);
      return /* @__PURE__ */ a(
        "li",
        {
          tabIndex: e.selectionMode !== "none" ? 0 : void 0,
          onClick: () => {
            e.selectionMode !== "none" && !i && e.toggleSelection(s.key);
          },
          onKeyDown: (c) => {
            (c.key === "Enter" || c.key === " ") &&
              e.selectionMode !== "none" &&
              !i &&
              (c.preventDefault(), e.toggleSelection(s.key));
          },
          className: `flex items-center gap-3 border-b border-border last:border-b-0 ${t} text-sm transition-colors
              ${l ? "bg-accent text-accent-foreground" : "hover:bg-muted/50"}
              ${i ? "opacity-50 pointer-events-none" : ""}
              ${e.selectionMode !== "none" ? "cursor-pointer" : ""}`,
          children: [
            s.icon && /* @__PURE__ */ r("span", { children: s.icon }),
            /* @__PURE__ */ a("div", {
              className: "flex flex-col min-w-0",
              children: [
                /* @__PURE__ */ r("span", {
                  className: e.overflowMode === "truncate" ? "truncate" : "",
                  children: s.label,
                }),
                s.description &&
                  /* @__PURE__ */ r("span", {
                    className: "text-xs text-muted-foreground",
                    children: s.description,
                  }),
              ],
            }),
          ],
        },
        s.key,
      );
    }),
  });
}
function B({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ a("div", {
      className: "flex flex-col gap-1.5",
      children: [
        e.label &&
          /* @__PURE__ */ r("span", { className: "text-sm font-medium", children: e.label }),
        /* @__PURE__ */ r("div", {
          className: "flex flex-wrap gap-1",
          children: e.items.map((t) =>
            /* @__PURE__ */ a(
              "span",
              {
                className:
                  "inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs font-medium",
                children: [
                  t.icon && /* @__PURE__ */ r("span", { children: t.icon }),
                  t.label,
                  /* @__PURE__ */ r("button", {
                    type: "button",
                    onClick: () => e.removeItem(t.key),
                    className:
                      "ml-0.5 rounded-full hover:bg-muted-foreground/20 h-3.5 w-3.5 inline-flex items-center justify-center text-muted-foreground hover:text-foreground",
                    children: "✕",
                  }),
                ],
              },
              t.key,
            ),
          ),
        }),
        e.errorMessage &&
          /* @__PURE__ */ r("p", {
            className: "text-xs text-destructive",
            children: e.errorMessage,
          }),
      ],
    })
  );
}
function F({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ r("div", {
      className: "rounded-md border border-border bg-muted p-4 text-sm text-muted-foreground",
      children: "Color area placeholder",
    })
  );
}
function E({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ r("div", {
      className: "rounded-md border border-border bg-muted p-4 text-sm text-muted-foreground",
      children: "Color field placeholder",
    })
  );
}
function W({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ r("div", {
      className: "rounded-md border border-border bg-muted p-4 text-sm text-muted-foreground",
      children: "Color picker placeholder",
    })
  );
}
function H({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ r("div", {
      className: "p-2 text-sm text-muted-foreground",
      children: "Color color-slider placeholder",
    })
  );
}
function G({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ r("div", {
      className: "p-2 text-sm text-muted-foreground",
      children: "Color color-swatch placeholder",
    })
  );
}
function X({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ r("div", {
      className: "p-2 text-sm text-muted-foreground",
      children: "Color color-swatch-picker placeholder",
    })
  );
}
function Q({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ r("div", {
      className: "p-2 text-sm text-muted-foreground",
      children: "Color color-wheel placeholder",
    })
  );
}
const $ = {
  50: "w-6 h-6",
  75: "w-8 h-8",
  100: "w-10 h-10",
  200: "w-14 h-14",
  300: "w-18 h-18",
  400: "w-22 h-22",
  500: "w-26 h-26",
  600: "w-30 h-30",
  700: "w-36 h-36",
};
function Z({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ r("img", {
      src: e.src,
      alt: e.alt,
      className: `rounded-full object-cover ${$[e.size] ?? "w-10 h-10"} ${e.isDisabled ? "opacity-50" : ""}`,
    })
  );
}
const b = {
  1: "text-4xl font-bold tracking-tight",
  2: "text-3xl font-semibold tracking-tight",
  3: "text-2xl font-semibold",
  4: "text-xl font-semibold",
  5: "text-lg font-medium",
  6: "text-base font-medium",
};
function J({ model: e }) {
  n(e.onUpdate);
  const t = b[e.level] ?? b[2];
  return C(`h${e.level}`, { className: t }, e.text);
}
function Y({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ r("img", {
      src: e.src,
      alt: e.alt,
      style: {
        objectFit: e.objectFit,
        width: e.width,
        height: e.height,
      },
    })
  );
}
function _({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ r("kbd", {
      className:
        "pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground",
      children: e.keys,
    })
  );
}
function ee({ model: e }) {
  n(e.onUpdate);
  const t =
    typeof e.value === "number" && e.formatOptions
      ? new Intl.NumberFormat(void 0, e.formatOptions).format(e.value)
      : String(e.value);
  return /* @__PURE__ */ a("div", {
    className: "flex flex-col gap-0.5",
    children: [
      /* @__PURE__ */ r("span", { className: "text-sm text-muted-foreground", children: e.label }),
      /* @__PURE__ */ r("span", { className: "text-sm font-medium", children: t }),
    ],
  });
}
function re({ model: e }) {
  return n(e.onUpdate), /* @__PURE__ */ r("span", { children: e.text });
}
function te({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ r("div", {
      role: e.role,
      className: "rounded-lg border border-border bg-muted/50 p-4",
      children: e.children.map((t) => /* @__PURE__ */ r(o, { model: t }, t.key)),
    })
  );
}
function ne({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ r("div", {
      className: "p-2 text-sm text-muted-foreground",
      children: "Date/time calendar placeholder",
    })
  );
}
function ae({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ r("div", {
      className: "p-2 text-sm text-muted-foreground",
      children: "Date/time date-field placeholder",
    })
  );
}
function se({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ r("div", {
      className: "p-2 text-sm text-muted-foreground",
      children: "Date/time date-picker placeholder",
    })
  );
}
function ie({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ r("div", {
      className: "p-2 text-sm text-muted-foreground",
      children: "Date/time date-range-picker placeholder",
    })
  );
}
function le({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ r("div", {
      className: "p-2 text-sm text-muted-foreground",
      children: "Date/time range-calendar placeholder",
    })
  );
}
function oe({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ r("div", {
      className: "p-2 text-sm text-muted-foreground",
      children: "Date/time time-field placeholder",
    })
  );
}
const f = {
    positive: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    negative: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    neutral: "bg-secondary text-secondary-foreground",
    informative: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  h = {
    S: "text-xs px-1.5 py-0.5",
    M: "text-xs px-2.5 py-0.5",
    L: "text-sm px-3 py-1",
  };
function ce({ model: e }) {
  n(e.onUpdate);
  const t = f[e.variant] ?? f.neutral,
    s = h[e.size] ?? h.M;
  return /* @__PURE__ */ r("span", {
    className: `inline-flex items-center rounded-full font-medium ${t} ${s}`,
    children: e.label,
  });
}
const g = {
  informative:
    "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200",
  positive:
    "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200",
  notice:
    "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
  negative:
    "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200",
};
function de({ model: e }) {
  n(e.onUpdate);
  const t = g[e.variant] ?? g.informative;
  return /* @__PURE__ */ a("div", {
    className: `rounded-lg border p-4 ${t}`,
    role: "alert",
    children: [
      e.header && /* @__PURE__ */ r("h4", { className: "mb-1 font-semibold", children: e.header }),
      /* @__PURE__ */ r("div", {
        className: "text-sm",
        children:
          typeof e.content === "string" ? e.content : /* @__PURE__ */ r(o, { model: e.content }),
      }),
    ],
  });
}
const M = {
  positive: "bg-green-500",
  warning: "bg-yellow-500",
  critical: "bg-red-500",
  informative: "bg-blue-500",
};
function ue({ model: e }) {
  n(e.onUpdate);
  const t = e.size === "S" ? "h-1" : e.size === "L" ? "h-3" : "h-2",
    s = M[e.variant] ?? "bg-primary";
  return /* @__PURE__ */ a("div", {
    className: "w-full",
    children: [
      e.label &&
        /* @__PURE__ */ a("div", {
          className: "flex justify-between mb-1 text-sm",
          children: [
            /* @__PURE__ */ r("span", { className: "text-muted-foreground", children: e.label }),
            /* @__PURE__ */ a("span", {
              className: "text-muted-foreground",
              children: [Math.round(e.percentage), "%"],
            }),
          ],
        }),
      /* @__PURE__ */ r("div", {
        className: `w-full rounded-full bg-secondary ${t} overflow-hidden`,
        children: /* @__PURE__ */ r("div", {
          className: `${t} rounded-full ${s} transition-[width] duration-200`,
          style: {
            width: `${Math.min(100, Math.max(0, e.percentage))}%`,
          },
        }),
      }),
    ],
  });
}
function pe({ model: e }) {
  n(e.onUpdate);
  const t = e.size === "S" ? "h-1" : e.size === "L" ? "h-3" : "h-2";
  return /* @__PURE__ */ a("div", {
    className: "w-full",
    children: [
      (e.label || e.showValueLabel) &&
        /* @__PURE__ */ a("div", {
          className: "flex justify-between mb-1 text-sm",
          children: [
            e.label &&
              /* @__PURE__ */ r("span", { className: "text-muted-foreground", children: e.label }),
            e.showValueLabel &&
              !e.isIndeterminate &&
              /* @__PURE__ */ a("span", {
                className: "text-muted-foreground",
                children: [Math.round(e.percentage), "%"],
              }),
          ],
        }),
      /* @__PURE__ */ r("div", {
        className: `w-full rounded-full bg-secondary ${t} overflow-hidden`,
        children: e.isIndeterminate
          ? /* @__PURE__ */ r("div", {
              className: `${t} rounded-full bg-primary animate-pulse w-1/2`,
            })
          : /* @__PURE__ */ r("div", {
              className: `${t} rounded-full bg-primary transition-[width] duration-200`,
              style: {
                width: `${Math.min(100, Math.max(0, e.percentage))}%`,
              },
            }),
      }),
    ],
  });
}
const S = { S: 24, M: 32, L: 48 };
function be({ model: e }) {
  n(e.onUpdate);
  const t = S[e.size] ?? 32,
    s = t <= 24 ? 2 : 3,
    l = (t - s) / 2,
    i = 2 * Math.PI * l,
    c = e.maxValue - e.minValue,
    w = e.isIndeterminate || c === 0 ? 0.25 : ((e.value ?? 0) - e.minValue) / c,
    k = i * (1 - w);
  return /* @__PURE__ */ a("svg", {
    width: t,
    height: t,
    viewBox: `0 0 ${t} ${t}`,
    className: e.isIndeterminate ? "animate-spin" : "",
    "aria-label": "Progress",
    role: "img",
    children: [
      /* @__PURE__ */ r("circle", {
        cx: t / 2,
        cy: t / 2,
        r: l,
        fill: "none",
        stroke: "currentColor",
        strokeWidth: s,
        className: "text-secondary",
      }),
      /* @__PURE__ */ r("circle", {
        cx: t / 2,
        cy: t / 2,
        r: l,
        fill: "none",
        stroke: "currentColor",
        strokeWidth: s,
        strokeDasharray: i,
        strokeDashoffset: k,
        strokeLinecap: "round",
        className: "text-primary",
        transform: `rotate(-90 ${t / 2} ${t / 2})`,
      }),
    ],
  });
}
function fe({ model: e }) {
  n(e.onUpdate);
  const t = e.variant === "circular" ? "rounded-full" : (e.variant === "text", "rounded-md"),
    s =
      e.variant === "circular"
        ? { width: "2.5rem", height: "2.5rem" }
        : e.variant === "text"
          ? { width: "100%", height: "1rem" }
          : { width: "100%", height: "4rem" };
  return /* @__PURE__ */ r("div", {
    className: `animate-pulse bg-muted ${t}`,
    style: {
      width: e.width ?? s.width,
      height: e.height ?? s.height,
    },
  });
}
const x = {
  S: "w-4 h-4 border-2",
  M: "w-6 h-6 border-2",
  L: "w-10 h-10 border-3",
};
function he({ model: e }) {
  n(e.onUpdate);
  const t = x[e.size] ?? x.M;
  return /* @__PURE__ */ a("output", {
    className: "inline-flex flex-col items-center gap-2",
    children: [
      /* @__PURE__ */ r("div", {
        className: `animate-spin rounded-full border-current border-t-transparent ${t}`,
      }),
      e.label &&
        /* @__PURE__ */ r("span", {
          className: "text-sm text-muted-foreground",
          children: e.label,
        }),
    ],
  });
}
const z = {
    positive: "bg-green-500",
    negative: "bg-red-500",
    notice: "bg-yellow-500",
    info: "bg-blue-500",
    neutral: "bg-gray-400",
    celery: "bg-lime-500",
    chartreuse: "bg-lime-400",
    yellow: "bg-yellow-400",
    magenta: "bg-pink-500",
    fuchsia: "bg-fuchsia-500",
    purple: "bg-purple-500",
    indigo: "bg-indigo-500",
    seafoam: "bg-teal-400",
  },
  v = {
    S: "w-2 h-2",
    M: "w-2.5 h-2.5",
    L: "w-3 h-3",
  };
function ge({ model: e }) {
  n(e.onUpdate);
  const t = z[e.variant] ?? "bg-gray-400",
    s = v[e.size] ?? v.M;
  return /* @__PURE__ */ a("div", {
    className: "inline-flex items-center gap-2",
    children: [
      /* @__PURE__ */ r("span", { className: `${s} rounded-full ${t} flex-shrink-0` }),
      /* @__PURE__ */ r("span", { className: "text-sm", children: e.label }),
    ],
  });
}
const y = {
  positive: "border-green-500",
  negative: "border-red-500",
  info: "border-blue-500",
  neutral: "border-border",
};
function xe({ model: e }) {
  n(e.onUpdate);
  const t = y[e.variant] ?? y.neutral;
  return /* @__PURE__ */ a("div", {
    className: `flex items-center gap-3 rounded-lg border bg-card p-4 shadow-lg ${t}`,
    role: "alert",
    children: [
      /* @__PURE__ */ r("span", { className: "text-sm flex-1", children: e.message }),
      e.action && /* @__PURE__ */ r(d, { action: e.action }),
    ],
  });
}
function ve({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ a("label", {
      className: `inline-flex items-center gap-2 ${e.isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`,
      children: [
        /* @__PURE__ */ r("input", {
          type: "checkbox",
          checked: e.isSelected,
          disabled: e.isDisabled,
          readOnly: e.isReadOnly,
          ref: (t) => {
            t && (t.indeterminate = e.isIndeterminate);
          },
          onChange: () => e.toggle(),
          className: "h-4 w-4 rounded border-input text-primary focus:ring-ring",
        }),
        /* @__PURE__ */ r("span", { className: "text-sm", children: e.label }),
      ],
    })
  );
}
function ye({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ a("fieldset", {
      disabled: e.isDisabled,
      className: "flex flex-col gap-1.5",
      children: [
        /* @__PURE__ */ a("legend", {
          className: "text-sm font-medium",
          children: [
            e.label,
            e.isRequired &&
              /* @__PURE__ */ r("span", { className: "text-destructive ml-1", children: "*" }),
          ],
        }),
        /* @__PURE__ */ r("div", {
          className: `flex gap-3 ${e.orientation === "horizontal" ? "flex-row flex-wrap" : "flex-col"}`,
          children: e.children.map((t) => /* @__PURE__ */ r(o, { model: t }, t.key)),
        }),
        e.errorMessage &&
          /* @__PURE__ */ r("p", {
            className: "text-xs text-destructive",
            children: e.errorMessage,
          }),
      ],
    })
  );
}
function me({ model: e }) {
  n(e.onUpdate);
  const [t, s] = U(!1),
    l = e.items.filter((i) => i.label.toLowerCase().includes(e.inputValue.toLowerCase()));
  return /* @__PURE__ */ a("div", {
    className: "flex flex-col gap-1.5 relative",
    children: [
      e.label &&
        /* @__PURE__ */ a("label", {
          className: "text-sm font-medium",
          children: [
            e.label,
            e.isRequired &&
              /* @__PURE__ */ r("span", { className: "text-destructive ml-1", children: "*" }),
          ],
        }),
      /* @__PURE__ */ r("input", {
        type: "text",
        value: e.inputValue,
        placeholder: e.placeholder,
        disabled: e.isDisabled,
        onChange: (i) => {
          e.setInputValue(i.target.value), s(!0);
        },
        onFocus: () => {
          e.menuTrigger === "focus" && s(!0);
        },
        onBlur: () => setTimeout(() => s(!1), 150),
        className: `flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors
          placeholder:text-muted-foreground
          focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
          disabled:cursor-not-allowed disabled:opacity-50
          ${e.errorMessage ? "border-destructive" : "border-input"}`,
      }),
      t &&
        l.length > 0 &&
        /* @__PURE__ */ r("ul", {
          className:
            "absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border border-border bg-popover p-1 shadow-md",
          children: l.map((i) =>
            /* @__PURE__ */ r(
              "li",
              {
                children: /* @__PURE__ */ r("button", {
                  type: "button",
                  className: `w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer ${e.selectedKey === i.key ? "bg-accent" : ""}`,
                  onMouseDown: (c) => {
                    c.preventDefault(), e.setSelectedKey(i.key), e.setInputValue(i.label), s(!1);
                  },
                  children: i.label,
                }),
              },
              i.key,
            ),
          ),
        }),
      e.errorMessage &&
        /* @__PURE__ */ r("p", { className: "text-xs text-destructive", children: e.errorMessage }),
    ],
  });
}
function Ne({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ r("form", {
      onSubmit: (t) => t.preventDefault(),
      className: "flex flex-col gap-4",
      children: /* @__PURE__ */ r("fieldset", {
        disabled: e.isDisabled,
        className: "flex flex-col gap-4",
        children: e.children.map((t) => /* @__PURE__ */ r(o, { model: t }, t.key)),
      }),
    })
  );
}
function we({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ a("div", {
      className: "flex flex-col gap-1.5",
      children: [
        e.label &&
          /* @__PURE__ */ a("label", {
            className: "text-sm font-medium",
            children: [
              e.label,
              e.isRequired &&
                /* @__PURE__ */ r("span", { className: "text-destructive ml-1", children: "*" }),
            ],
          }),
        /* @__PURE__ */ r("input", {
          type: "number",
          value: e.value ?? "",
          min: e.minValue,
          max: e.maxValue,
          step: e.step,
          disabled: e.isDisabled,
          readOnly: e.isReadOnly,
          required: e.isRequired,
          onChange: (t) => {
            const s = t.target.value;
            e.setValue(s === "" ? void 0 : Number(s));
          },
          className: `flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors
          placeholder:text-muted-foreground
          focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
          disabled:cursor-not-allowed disabled:opacity-50
          ${e.errorMessage ? "border-destructive" : "border-input"}`,
        }),
        e.description &&
          !e.errorMessage &&
          /* @__PURE__ */ r("p", {
            className: "text-xs text-muted-foreground",
            children: e.description,
          }),
        e.errorMessage &&
          /* @__PURE__ */ r("p", {
            className: "text-xs text-destructive",
            children: e.errorMessage,
          }),
      ],
    })
  );
}
function ke({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ a("div", {
      className: "flex flex-col gap-1.5",
      children: [
        e.label &&
          /* @__PURE__ */ a("label", {
            className: "text-sm font-medium",
            children: [
              e.label,
              e.isRequired &&
                /* @__PURE__ */ r("span", { className: "text-destructive ml-1", children: "*" }),
            ],
          }),
        /* @__PURE__ */ a("select", {
          value: e.selectedKey ?? "",
          disabled: e.isDisabled,
          onChange: (t) => e.setSelectedKey(t.target.value || void 0),
          className: `flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors
          focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
          disabled:cursor-not-allowed disabled:opacity-50
          ${e.errorMessage ? "border-destructive" : "border-input"}`,
          children: [
            e.placeholder &&
              /* @__PURE__ */ r("option", { value: "", disabled: !0, children: e.placeholder }),
            e.items.map((t) =>
              /* @__PURE__ */ r("option", { value: t.key, children: t.label }, t.key),
            ),
          ],
        }),
        e.errorMessage &&
          /* @__PURE__ */ r("p", {
            className: "text-xs text-destructive",
            children: e.errorMessage,
          }),
      ],
    })
  );
}
function Re({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ a("fieldset", {
      disabled: e.isDisabled,
      className: "flex flex-col gap-1.5",
      children: [
        /* @__PURE__ */ a("legend", {
          className: "text-sm font-medium",
          children: [
            e.label,
            e.isRequired &&
              /* @__PURE__ */ r("span", { className: "text-destructive ml-1", children: "*" }),
          ],
        }),
        /* @__PURE__ */ r("div", {
          className: `flex gap-3 ${e.orientation === "horizontal" ? "flex-row flex-wrap" : "flex-col"}`,
          children: e.options.map((t) =>
            /* @__PURE__ */ a(
              "label",
              {
                className: `inline-flex items-center gap-2 ${t.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`,
                children: [
                  /* @__PURE__ */ r("input", {
                    type: "radio",
                    name: e.key,
                    value: t.value,
                    checked: e.value === t.value,
                    disabled: t.disabled || e.isReadOnly,
                    onChange: () => e.setValue(t.value),
                    className: "h-4 w-4 border-input text-primary focus:ring-ring",
                  }),
                  /* @__PURE__ */ a("div", {
                    className: "flex flex-col",
                    children: [
                      /* @__PURE__ */ r("span", { className: "text-sm", children: t.label }),
                      t.description &&
                        /* @__PURE__ */ r("span", {
                          className: "text-xs text-muted-foreground",
                          children: t.description,
                        }),
                    ],
                  }),
                ],
              },
              t.value,
            ),
          ),
        }),
        e.errorMessage &&
          /* @__PURE__ */ r("p", {
            className: "text-xs text-destructive",
            children: e.errorMessage,
          }),
      ],
    })
  );
}
function Ce({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ a("div", {
      className: "flex flex-col gap-1.5 w-full",
      children: [
        e.label &&
          /* @__PURE__ */ a("div", {
            className: "flex justify-between text-sm",
            children: [
              /* @__PURE__ */ r("span", { className: "font-medium", children: e.label }),
              /* @__PURE__ */ a("span", {
                className: "text-muted-foreground",
                children: [e.startValue, " - ", e.endValue],
              }),
            ],
          }),
        /* @__PURE__ */ a("div", {
          className: "flex gap-2 items-center",
          children: [
            /* @__PURE__ */ r("input", {
              type: "range",
              value: e.startValue,
              min: e.minValue,
              max: e.maxValue,
              step: e.step,
              disabled: e.isDisabled,
              onChange: (t) => e.setRange(Number(t.target.value), e.endValue),
              className: `w-full h-2 rounded-lg appearance-none cursor-pointer bg-secondary
            disabled:cursor-not-allowed disabled:opacity-50`,
            }),
            /* @__PURE__ */ r("input", {
              type: "range",
              value: e.endValue,
              min: e.minValue,
              max: e.maxValue,
              step: e.step,
              disabled: e.isDisabled,
              onChange: (t) => e.setRange(e.startValue, Number(t.target.value)),
              className: `w-full h-2 rounded-lg appearance-none cursor-pointer bg-secondary
            disabled:cursor-not-allowed disabled:opacity-50`,
            }),
          ],
        }),
      ],
    })
  );
}
function Ue({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ a("div", {
      className: "flex flex-col gap-1.5",
      children: [
        e.label &&
          /* @__PURE__ */ r("label", { className: "text-sm font-medium", children: e.label }),
        /* @__PURE__ */ a("div", {
          className: "relative",
          children: [
            /* @__PURE__ */ r("input", {
              type: "search",
              value: e.value,
              placeholder: e.placeholder,
              disabled: e.isDisabled,
              onChange: (t) => e.setValue(t.target.value),
              className: `flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-8 text-sm shadow-sm transition-colors
            placeholder:text-muted-foreground
            focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
            disabled:cursor-not-allowed disabled:opacity-50`,
            }),
            /* @__PURE__ */ r("svg", {
              className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground",
              xmlns: "http://www.w3.org/2000/svg",
              fill: "none",
              viewBox: "0 0 24 24",
              strokeWidth: 2,
              stroke: "currentColor",
              children: /* @__PURE__ */ r("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                d: "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z",
              }),
            }),
            e.value &&
              /* @__PURE__ */ r("button", {
                type: "button",
                onClick: () => e.clear(),
                className:
                  "absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground",
                children: "✕",
              }),
          ],
        }),
      ],
    })
  );
}
function $e({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ a("div", {
      className: "flex flex-col gap-1.5 w-full",
      children: [
        e.label &&
          /* @__PURE__ */ a("div", {
            className: "flex justify-between text-sm",
            children: [
              /* @__PURE__ */ r("span", { className: "font-medium", children: e.label }),
              /* @__PURE__ */ r("span", { className: "text-muted-foreground", children: e.value }),
            ],
          }),
        /* @__PURE__ */ r("input", {
          type: "range",
          value: e.value,
          min: e.minValue,
          max: e.maxValue,
          step: e.step,
          disabled: e.isDisabled,
          onChange: (t) => e.setValue(Number(t.target.value)),
          className: `w-full h-2 rounded-lg appearance-none cursor-pointer bg-secondary
          disabled:cursor-not-allowed disabled:opacity-50`,
        }),
      ],
    })
  );
}
function Me({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ a("label", {
      className: `inline-flex items-center gap-2 ${e.isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`,
      children: [
        /* @__PURE__ */ r("button", {
          type: "button",
          role: "switch",
          "aria-checked": e.isSelected,
          disabled: e.isDisabled || e.isReadOnly,
          onClick: () => e.toggle(),
          className: `relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-50
          ${e.isSelected ? (e.isEmphasized, "bg-primary") : "bg-input"}`,
          children: /* @__PURE__ */ r("span", {
            className: `pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform ${e.isSelected ? "translate-x-4" : "translate-x-0"}`,
          }),
        }),
        /* @__PURE__ */ r("span", { className: "text-sm", children: e.label }),
      ],
    })
  );
}
function Se({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ a("div", {
      className: "flex flex-col gap-1.5",
      children: [
        e.label &&
          /* @__PURE__ */ a("label", {
            className: "text-sm font-medium",
            children: [
              e.label,
              e.isRequired &&
                /* @__PURE__ */ r("span", { className: "text-destructive ml-1", children: "*" }),
            ],
          }),
        /* @__PURE__ */ r("textarea", {
          value: e.value,
          placeholder: e.placeholder,
          disabled: e.isDisabled,
          readOnly: e.isReadOnly,
          required: e.isRequired,
          maxLength: e.maxLength,
          onChange: (t) => e.setValue(t.target.value),
          className: `flex min-h-[60px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm transition-colors
          placeholder:text-muted-foreground
          focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
          disabled:cursor-not-allowed disabled:opacity-50
          ${e.errorMessage ? "border-destructive" : "border-input"}`,
        }),
        e.description &&
          !e.errorMessage &&
          /* @__PURE__ */ r("p", {
            className: "text-xs text-muted-foreground",
            children: e.description,
          }),
        e.errorMessage &&
          /* @__PURE__ */ r("p", {
            className: "text-xs text-destructive",
            children: e.errorMessage,
          }),
      ],
    })
  );
}
function ze({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ a("div", {
      className: "flex flex-col gap-1.5",
      children: [
        e.label &&
          /* @__PURE__ */ a("label", {
            className: "text-sm font-medium",
            children: [
              e.label,
              e.isRequired &&
                /* @__PURE__ */ r("span", { className: "text-destructive ml-1", children: "*" }),
            ],
          }),
        /* @__PURE__ */ r("input", {
          type: e.type,
          value: e.value,
          placeholder: e.placeholder,
          disabled: e.isDisabled,
          readOnly: e.isReadOnly,
          required: e.isRequired,
          maxLength: e.maxLength,
          pattern: e.pattern,
          onChange: (t) => e.setValue(t.target.value),
          className: `flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors
          placeholder:text-muted-foreground
          focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
          disabled:cursor-not-allowed disabled:opacity-50
          ${e.errorMessage ? "border-destructive" : "border-input"}`,
        }),
        e.description &&
          !e.errorMessage &&
          /* @__PURE__ */ r("p", {
            className: "text-xs text-muted-foreground",
            children: e.description,
          }),
        e.errorMessage &&
          /* @__PURE__ */ r("p", {
            className: "text-xs text-destructive",
            children: e.errorMessage,
          }),
      ],
    })
  );
}
function De({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ a("div", {
      children: [
        /* @__PURE__ */ a("button", {
          type: "button",
          onClick: () => e.toggle(),
          disabled: e.trigger.disabled,
          className:
            "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50",
          children: [
            e.trigger.label ?? "Toggle",
            /* @__PURE__ */ r("span", {
              className: `ml-2 transition-transform ${e.isOpen ? "rotate-180" : ""}`,
              children: "▾",
            }),
          ],
        }),
        e.isOpen &&
          /* @__PURE__ */ r("div", {
            className: "px-3 py-2",
            children: e.children.map((t) => /* @__PURE__ */ r(o, { model: t }, t.key)),
          }),
      ],
    })
  );
}
function Ve({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ a("div", {
      className: "flex flex-col",
      children: [
        e.header &&
          /* @__PURE__ */ r("div", {
            className: "border-b border-border px-4 py-3 font-semibold",
            children:
              typeof e.header === "string" ? e.header : /* @__PURE__ */ r(u, { value: e.header }),
          }),
        /* @__PURE__ */ r("div", {
          className: "p-4",
          children: e.children.map((t) => /* @__PURE__ */ r(o, { model: t }, t.key)),
        }),
        e.footer &&
          /* @__PURE__ */ r("div", {
            className: "border-t border-border px-4 py-3",
            children:
              typeof e.footer === "string" ? e.footer : /* @__PURE__ */ r(u, { value: e.footer }),
          }),
      ],
    })
  );
}
const m = {
  S: "1px",
  M: "2px",
  L: "4px",
};
function Le({ model: e }) {
  return (
    n(e.onUpdate),
    e.orientation === "vertical"
      ? /* @__PURE__ */ r("div", {
          className: "self-stretch bg-border",
          style: { width: m[e.size], minHeight: "1rem" },
        })
      : /* @__PURE__ */ r("hr", {
          className: "w-full border-none bg-border",
          style: { height: m[e.size] },
        })
  );
}
function Oe({ model: e }) {
  n(e.onUpdate);
  const t =
    e.orientation === "horizontal"
      ? "overflow-x-auto overflow-y-hidden"
      : e.orientation === "both"
        ? "overflow-auto"
        : "overflow-y-auto overflow-x-hidden";
  return /* @__PURE__ */ r("div", {
    className: t,
    style: { maxHeight: e.maxHeight },
    children: e.children.map((s) => /* @__PURE__ */ r(o, { model: s }, s.key)),
  });
}
function Ke({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ r("aside", {
      className: `flex flex-col border-border bg-card transition-[width] duration-200 overflow-hidden ${e.side === "right" ? "border-l" : "border-r"}`,
      style: {
        width: e.isOpen ? e.expandedWidth : e.collapsedWidth,
      },
      children:
        e.isOpen &&
        /* @__PURE__ */ r("div", {
          className: "flex-1 overflow-auto p-2",
          children: e.children.map((t) => /* @__PURE__ */ r(o, { model: t }, t.key)),
        }),
    })
  );
}
function je({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ a("div", {
      className: `flex items-center gap-2 rounded-md border border-border bg-card p-2 ${e.isEmphasized ? "bg-accent" : ""}`,
      role: "toolbar",
      children: [
        e.selectedItemCount > 0 &&
          /* @__PURE__ */ a("span", {
            className: "text-sm text-muted-foreground mr-2",
            children: [e.selectedItemCount, " selected"],
          }),
        e.children.map((t) => /* @__PURE__ */ r(d, { action: t }, t.actionKey)),
      ],
    })
  );
}
function Ie({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ a("div", {
      className: "relative inline-block",
      children: [
        /* @__PURE__ */ a("button", {
          type: "button",
          onClick: () => e.toggle(),
          disabled: e.action.disabled,
          className: `inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4
          bg-secondary text-secondary-foreground hover:bg-secondary/80
          disabled:pointer-events-none disabled:opacity-50 transition-colors
          ${e.isQuiet ? "bg-transparent hover:bg-accent" : ""}`,
          children: [
            e.action.label ?? e.action.actionKey,
            /* @__PURE__ */ r("span", { className: "ml-1", children: "▾" }),
          ],
        }),
        e.isOpen &&
          /* @__PURE__ */ r("div", {
            className:
              "absolute left-0 top-full z-50 mt-1 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md",
            children: e.items.map((t) =>
              t.isSeparator
                ? /* @__PURE__ */ r(
                    "div",
                    {
                      className: "-mx-1 my-1 h-px bg-border",
                      role: "separator",
                    },
                    t.key,
                  )
                : /* @__PURE__ */ a(
                    "button",
                    {
                      type: "button",
                      role: "menuitem",
                      disabled: t.action.disabled,
                      onClick: () => {
                        t.action.submit(), e.setOpen(!1);
                      },
                      className: `relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors
                  hover:bg-accent hover:text-accent-foreground
                  disabled:pointer-events-none disabled:opacity-50`,
                      children: [
                        /* @__PURE__ */ r("span", {
                          className: "flex-1",
                          children: t.action.label ?? t.action.actionKey,
                        }),
                        t.shortcut &&
                          /* @__PURE__ */ r("span", {
                            className: "ml-auto text-xs text-muted-foreground",
                            children: t.shortcut,
                          }),
                      ],
                    },
                    t.key,
                  ),
            ),
          }),
      ],
    })
  );
}
function D({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ r("div", {
      className:
        "min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md",
      role: "menu",
      children: e.children.map((t) => {
        if (t.isSeparator)
          return /* @__PURE__ */ r(
            "div",
            {
              className: "-mx-1 my-1 h-px bg-border",
              role: "separator",
            },
            t.key,
          );
        const s = e.selectedKeys.has(t.key),
          l = e.disabledKeys.has(t.key);
        return /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            role: "menuitem",
            disabled: l || t.action.disabled,
            onClick: () => t.action.submit(),
            className: `relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors
              hover:bg-accent hover:text-accent-foreground
              disabled:pointer-events-none disabled:opacity-50
              ${s ? "bg-accent" : ""}`,
            children: [
              /* @__PURE__ */ r("span", {
                className: "flex-1",
                children: t.action.label ?? t.action.actionKey,
              }),
              t.shortcut &&
                /* @__PURE__ */ r("span", {
                  className: "ml-auto text-xs text-muted-foreground",
                  children: t.shortcut,
                }),
            ],
          },
          t.key,
        );
      }),
    })
  );
}
function V({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ a("div", {
      className: "relative inline-block",
      children: [
        /* @__PURE__ */ r("button", {
          type: "button",
          onClick: () => e.toggle(),
          disabled: e.trigger.disabled,
          className: `inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4
          bg-secondary text-secondary-foreground hover:bg-secondary/80
          disabled:pointer-events-none disabled:opacity-50 transition-colors`,
          children: e.trigger.label ?? e.trigger.actionKey,
        }),
        e.isOpen &&
          /* @__PURE__ */ r("div", {
            className: "absolute left-0 top-full z-50 mt-1",
            children: /* @__PURE__ */ r(D, { model: e.menu }),
          }),
      ],
    })
  );
}
function Ae({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ r("div", {
      className: "flex items-center gap-1 border-b border-border bg-card px-2 py-1",
      role: "menubar",
      children: e.children.map((t) => /* @__PURE__ */ r(V, { model: t }, t.key)),
    })
  );
}
const N = {
  primary: "text-primary underline-offset-4 hover:underline",
  secondary: "text-secondary-foreground underline-offset-4 hover:underline",
  overBackground: "text-primary-foreground underline-offset-4 hover:underline",
};
function Te({ model: e }) {
  n(e.onUpdate);
  const t = N[e.variant] ?? N.primary;
  return /* @__PURE__ */ r("a", {
    href: "#",
    onClick: (s) => {
      s.preventDefault(), e.action.submit();
    },
    className: `inline-flex items-center text-sm font-medium transition-colors
        ${t}
        ${e.isQuiet ? "no-underline" : ""}
        ${e.action.disabled ? "pointer-events-none opacity-50" : "cursor-pointer"}`,
    children: e.action.label ?? e.action.actionKey,
  });
}
function Pe({ model: e }) {
  return (
    n(e.onUpdate),
    e.isOpen
      ? /* @__PURE__ */ a("div", {
          className: "fixed inset-0 z-50 flex items-center justify-center",
          children: [
            /* @__PURE__ */ r("div", { className: "fixed inset-0 bg-black/50" }),
            /* @__PURE__ */ a("div", {
              className:
                "relative z-50 w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg",
              children: [
                e.header &&
                  /* @__PURE__ */ r("h2", {
                    className: "text-lg font-semibold mb-2",
                    children:
                      typeof e.header === "string"
                        ? e.header
                        : /* @__PURE__ */ r(u, { value: e.header }),
                  }),
                /* @__PURE__ */ r("div", {
                  className: "text-sm text-muted-foreground mb-4",
                  children: e.children.map((t) => /* @__PURE__ */ r(o, { model: t }, t.key)),
                }),
                /* @__PURE__ */ a("div", {
                  className: "flex justify-end gap-2",
                  children: [
                    e.cancelAction && /* @__PURE__ */ r(d, { action: e.cancelAction }),
                    e.secondaryAction && /* @__PURE__ */ r(d, { action: e.secondaryAction }),
                    /* @__PURE__ */ r(d, { action: e.primaryAction }),
                  ],
                }),
              ],
            }),
          ],
        })
      : null
  );
}
function qe({ model: e }) {
  return (
    n(e.onUpdate),
    e.isOpen
      ? /* @__PURE__ */ r("div", {
          className:
            "z-50 rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none",
          style: {
            marginTop: e.offset,
            marginLeft: e.crossOffset,
          },
          children: /* @__PURE__ */ r(o, { model: e.content }),
        })
      : null
  );
}
function Be({ model: e }) {
  return (
    n(e.onUpdate),
    /* @__PURE__ */ r("div", {
      className:
        "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground shadow-md",
      role: "tooltip",
      children:
        typeof e.content === "string" ? e.content : /* @__PURE__ */ r(o, { model: e.content }),
    })
  );
}
export {
  B as $,
  je as A,
  ce as B,
  ne as C,
  ae as D,
  ue as E,
  A as F,
  qe as G,
  J as H,
  Y as I,
  pe as J,
  _ as K,
  ee as L,
  Ae as M,
  we as N,
  be as O,
  ke as P,
  le as Q,
  Re as R,
  Ce as S,
  Oe as T,
  Ue as U,
  Ke as V,
  fe as W,
  $e as X,
  he as Y,
  ge as Z,
  Me as _,
  Ie as a,
  Se as a0,
  ze as a1,
  re as a2,
  oe as a3,
  xe as a4,
  T as a5,
  Be as a6,
  te as a7,
  Pe as b,
  Z as c,
  I as d,
  ye as e,
  ve as f,
  De as g,
  F as h,
  E as i,
  W as j,
  H as k,
  X as l,
  G as m,
  Q as n,
  me as o,
  Ve as p,
  se as q,
  ie as r,
  Le as s,
  Ne as t,
  de as u,
  Te as v,
  P as w,
  q as x,
  D as y,
  V as z,
};
