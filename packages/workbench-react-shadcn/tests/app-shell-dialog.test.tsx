import {
  ActionView,
  ContentPanelView,
  DialogView,
  publishDialog,
} from "@statewalker/workbench-views";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AppShell, getComponentRegistry } from "../src/layouts/app-shell.js";

afterEach(() => {
  cleanup();
});

function setupCtx(): Record<string, unknown> {
  const ctx: Record<string, unknown> = {};
  // The shadcn AppShell uses its own component registry keyed "aspect:component-registry".
  // Register the renderers for the view-models used in the workspace dialog body.
  const registry = getComponentRegistry(ctx);

  registry.register(ContentPanelView, ({ model }) => (
    <section data-testid="content-panel">
      {typeof model.header === "string" ? <p>{model.header}</p> : null}
    </section>
  ));

  registry.register(ActionView, ({ model }) => (
    <button type="button" data-testid={`action-${model.actionKey}`}>
      {model.label ?? model.actionKey}
    </button>
  ));

  return ctx;
}

function buildWorkspaceDialog(): DialogView {
  const description = new ContentPanelView({ header: "Pick a workspace folder to begin." });
  const open = new ActionView({ key: "open", label: "Open Folder" });
  return new DialogView({
    key: "request-workspace",
    header: "Open workspace folder",
    children: [description, open],
    isDismissable: true,
    closeOnEscape: true,
    closeOnClickOutside: true,
    isOpen: true,
    buttons: [
      { label: "Cancel", variant: "ghost" },
      { label: "Open Folder", variant: "default" },
    ],
  });
}

describe("shadcn AppShell renders DialogView from DialogStackView", () => {
  it("renders the workspace-shaped dialog header, description, and footer buttons", () => {
    const ctx = setupCtx();
    const dialog = buildWorkspaceDialog();
    publishDialog(ctx, dialog);

    render(<AppShell context={ctx} />);

    // Header (shadcn renders both DialogTitle and a sr-only DialogDescription
    // with the same text — assert at least one is present).
    expect(screen.getAllByText("Open workspace folder").length).toBeGreaterThan(0);

    // Description (rendered through ReactComponentRegistry → ContentPanelView)
    expect(screen.getByText("Pick a workspace folder to begin.")).toBeTruthy();

    // Body button (the ActionView in the dialog children)
    expect(screen.getByTestId("action-open")).toBeTruthy();

    // Footer buttons (configured on DialogView.buttons, rendered by DialogOverlay)
    expect(screen.getByRole("button", { name: "Cancel" })).toBeTruthy();
    // "Open Folder" matches both the body ActionView and the footer button;
    // assert there are at least two matches (one body, one footer).
    expect(screen.getAllByRole("button", { name: "Open Folder" }).length).toBeGreaterThanOrEqual(2);
  });

  it("renders nothing dialog-shaped when DialogStackView is empty", () => {
    const ctx = setupCtx();
    render(<AppShell context={ctx} />);
    expect(screen.queryByText("Open workspace folder")).toBeNull();
  });
});
