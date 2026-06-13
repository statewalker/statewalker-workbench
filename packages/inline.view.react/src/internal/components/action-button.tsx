import { useAppWorkspace } from "@statewalker/core-react";
import { Commands } from "@statewalker/shared-commands";
import { type ReactElement, useCallback } from "react";

interface ActionButtonProps {
  label: string;
  /** Command key fired when the button is clicked. */
  command: string;
  /** Payload passed to the command. Optional. */
  payload?: unknown;
  /** Visual emphasis. Defaults to "default". */
  variant?: "default" | "primary" | "destructive";
}

function isActionButtonProps(value: unknown): value is ActionButtonProps {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.label === "string" && typeof v.command === "string";
}

/**
 * Inline button that fires an arbitrary command on click. The
 * spec carries the command key + payload so a single component
 * covers many use cases without per-action React bindings.
 */
export function ActionButton({ props }: { props: unknown }): ReactElement {
  const workspace = useAppWorkspace();
  const commands = workspace.requireAdapter(Commands);

  const onClick = useCallback(() => {
    if (!isActionButtonProps(props)) return;
    // Dynamic dispatch by string key. The action key is configured per
    // declarative spec; the bus accepts any CommandDeclaration shape.
    commands.call({ key: props.command }, props.payload);
  }, [commands, props]);

  if (!isActionButtonProps(props)) {
    return (
      <span className="rounded-sm bg-destructive/10 px-2 py-0.5 font-mono text-xs text-destructive">
        ActionButton: invalid props
      </span>
    );
  }
  const variant = props.variant ?? "default";
  const cls =
    variant === "primary"
      ? "bg-primary text-primary-foreground hover:bg-primary/90"
      : variant === "destructive"
        ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
        : "bg-secondary text-secondary-foreground hover:bg-secondary/80";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center rounded-md px-3 py-1 text-sm font-medium ${cls}`}
    >
      {props.label}
    </button>
  );
}
