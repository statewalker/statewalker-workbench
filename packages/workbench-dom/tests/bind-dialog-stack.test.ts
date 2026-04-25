// @vitest-environment jsdom

import {
  ActionView,
  ContentPanelView,
  DialogView,
  getDialogStackView,
  publishDialog,
  ViewModel,
} from "@statewalker/workbench-views";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { bindDialogStack } from "../src/bind-dialog-stack.js";
import { ComponentRegistry } from "../src/component-registry.js";
import { setComponentRegistry } from "../src/html-components-registry.adapter.js";

let ctx: Record<string, unknown>;
let cleanup: () => void;

function makeCtx(): Record<string, unknown> {
  const next: Record<string, unknown> = {};
  const registry = new ComponentRegistry<Element>();

  registry.register(ContentPanelView, ({ model }) => {
    const root = document.createElement("section");
    root.dataset.role = "content-panel";
    if (typeof model.header === "string") {
      const heading = document.createElement("h3");
      heading.textContent = model.header;
      root.appendChild(heading);
    }
    return [root, () => root.remove()];
  });

  registry.register(ActionView, ({ model }) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = model.label ?? "";
    button.dataset.actionKey = model.key;
    return [button, () => button.remove()];
  });

  setComponentRegistry(next, registry);
  return next;
}

beforeEach(() => {
  ctx = makeCtx();
  cleanup = bindDialogStack(ctx);
});

afterEach(() => {
  cleanup();
  document.body.innerHTML = "";
});

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
    buttons: [
      { label: "Cancel", variant: "ghost" },
      { label: "Open Folder", variant: "default" },
    ],
  });
}

describe("bindDialogStack", () => {
  it("renders a published DialogView with header, body, and footer buttons", () => {
    const view = buildWorkspaceDialog();
    publishDialog(ctx, view);

    const dialog = document.querySelector("dialog") as HTMLDialogElement | null;
    expect(dialog).not.toBeNull();
    expect(dialog?.dataset.dialogKey).toBe("request-workspace");

    const header = dialog?.querySelector('[data-role="dialog-header"]');
    expect(header?.textContent).toContain("Open workspace folder");

    const body = dialog?.querySelector('[data-role="dialog-body"]');
    expect(body?.textContent).toContain("Pick a workspace folder to begin.");

    const buttons = Array.from(
      dialog?.querySelectorAll('[data-role="dialog-footer"] button') ?? [],
    );
    expect(buttons.map((b) => b.textContent)).toEqual(["Cancel", "Open Folder"]);
  });

  it("removes the DOM dialog when the view is unpublished", () => {
    const view = buildWorkspaceDialog();
    const unpublish = publishDialog(ctx, view);
    expect(document.querySelector("dialog")).not.toBeNull();
    unpublish();
    expect(document.querySelector("dialog")).toBeNull();
  });

  it("Escape dismisses the dialog when closeOnEscape is true", async () => {
    const view = buildWorkspaceDialog();
    publishDialog(ctx, view);
    const dialog = document.querySelector("dialog") as HTMLDialogElement;

    const closed = view.waitForClose();
    dialog.dispatchEvent(new Event("cancel", { cancelable: true }));

    await expect(closed).resolves.toBeUndefined();
    expect(getDialogStackView(ctx).getAll()).toEqual([]);
    expect(document.querySelector("dialog")).toBeNull();
  });

  it("Escape is suppressed when closeOnEscape is false", () => {
    const dismissable = buildWorkspaceDialog();
    dismissable.closeOnEscape = false;
    publishDialog(ctx, dismissable);

    const dialog = document.querySelector("dialog") as HTMLDialogElement;
    const event = new Event("cancel", { cancelable: true });
    dialog.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(getDialogStackView(ctx).getAll()).toHaveLength(1);
  });

  it("button click invokes onClick and closes the dialog with the button label", async () => {
    let clicked = false;
    const description = new ContentPanelView({ header: "body" });
    const view = new DialogView({
      key: "k",
      header: "h",
      children: [description],
      buttons: [
        {
          label: "Confirm",
          onClick: () => {
            clicked = true;
            return undefined;
          },
        },
      ],
    });
    publishDialog(ctx, view);

    const closed = view.waitForClose();
    const button = document.querySelector(
      '[data-role="dialog-footer"] button',
    ) as HTMLButtonElement;
    button.click();

    await expect(closed).resolves.toBe("Confirm");
    expect(clicked).toBe(true);
    expect(getDialogStackView(ctx).getAll()).toEqual([]);
  });

  it("button click does not close when onClick returns false", () => {
    const description = new ContentPanelView({ header: "body" });
    const view = new DialogView({
      key: "k",
      header: "h",
      children: [description],
      buttons: [{ label: "NoOp", onClick: () => false }],
    });
    publishDialog(ctx, view);

    const button = document.querySelector(
      '[data-role="dialog-footer"] button',
    ) as HTMLButtonElement;
    button.click();

    expect(getDialogStackView(ctx).getAll()).toHaveLength(1);
    expect(document.querySelector("dialog")).not.toBeNull();
  });

  it("renders dialogs already in the stack at subscribe time", () => {
    cleanup();
    const view = buildWorkspaceDialog();
    publishDialog(ctx, view);
    expect(document.querySelector("dialog")).toBeNull();

    cleanup = bindDialogStack(ctx);
    expect(document.querySelector("dialog")?.dataset.dialogKey).toBe("request-workspace");
  });

  it("ignores body children whose constructor is not registered", () => {
    class UnknownView extends ViewModel {}
    const view = new DialogView({
      key: "k",
      header: "h",
      children: [new ContentPanelView({ header: "known" }), new UnknownView()],
      buttons: [],
    });
    publishDialog(ctx, view);

    const body = document.querySelector('[data-role="dialog-body"]');
    expect(body?.textContent).toContain("known");
    expect(body?.children).toHaveLength(1);
  });
});
