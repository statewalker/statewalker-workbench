import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { HeadingView } from "@statewalker/workbench-views";
import { createElement } from "react";

const levelClasses: Record<number, string> = {
  1: "text-4xl font-bold tracking-tight",
  2: "text-3xl font-semibold tracking-tight",
  3: "text-2xl font-semibold",
  4: "text-xl font-semibold",
  5: "text-lg font-medium",
  6: "text-base font-medium",
};

export function HeadingRenderer({ model }: { model: HeadingView }) {
  useUpdates(model.onUpdate);
  const className = levelClasses[model.level] ?? levelClasses[2];
  return createElement(`h${model.level}`, { className }, model.text);
}
