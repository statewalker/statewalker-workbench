import {
  ActionView,
  ContentPanelView,
  DialogView,
  publishDialog,
} from "@statewalker/workbench-views";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { getComponentRegistry, SpectrumAppShell } from "../src/layouts/app-shell.js";
import { SpectrumProvider } from "../src/spectrum-provider.js";

afterEach(() => {
  cleanup();
});

function setupCtx(): Record<string, unknown> {
  const ctx: Record<string, unknown> = {};
  const registry = getComponentRegistry(ctx);

  // Spectrum's DialogOverlay looks up `DialogView` itself in the registry and
  // passes it to the rendered component. Provide a minimal renderer that walks
  // the dialog's children (the workspace body is a ContentPanelView + ActionView).
  registry.register(DialogView, ({ model }) => (
    <div data-testid="dialog-body">
      {model.children.map((child) => {
        if (child instanceof ContentPanelView) {
          return <p key={child.key}>{typeof child.header === "string" ? child.header : null}</p>;
        }
        if (child instanceof ActionView) {
          return (
            <button key={child.key} type="button" data-testid={`action-${child.actionKey}`}>
              {child.label ?? child.actionKey}
            </button>
          );
        }
        return null;
      })}
    </div>
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
    isOpen: true,
    buttons: [
      { label: "Cancel", variant: "ghost" },
      { label: "Open Folder", variant: "default" },
    ],
  });
}

describe("Spectrum AppShell renders DialogView from DialogStackView", () => {
  it("renders the workspace-shaped dialog header, description, and body button", () => {
    const ctx = setupCtx();
    const dialog = buildWorkspaceDialog();
    publishDialog(ctx, dialog);

    render(
      <SpectrumProvider>
        <SpectrumAppShell context={ctx} />
      </SpectrumProvider>,
    );

    // Header (Spectrum's <Heading> rendering the dialog's string header)
    expect(screen.getByText("Open workspace folder")).toBeTruthy();

    // Description (rendered through the DialogView registry renderer above)
    expect(screen.getByText("Pick a workspace folder to begin.")).toBeTruthy();

    // Body button
    expect(screen.getByTestId("action-open")).toBeTruthy();
  });

  it("renders nothing dialog-shaped when DialogStackView is empty", () => {
    const ctx = setupCtx();
    render(
      <SpectrumProvider>
        <SpectrumAppShell context={ctx} />
      </SpectrumProvider>,
    );
    expect(screen.queryByText("Open workspace folder")).toBeNull();
  });
});
