import {
  type ContentPanelView,
  type DialogButton,
  type DialogView,
  getDialogStackView,
} from "@statewalker/workbench-views";
import {
  getComponentRegistry,
  type HtmlComponentRegistry,
} from "./html-components-registry.adapter.js";

interface MountedDialog {
  element: HTMLDialogElement;
  cleanup: () => void;
}

/**
 * Subscribes to `DialogStackView` and mounts each `DialogView` as a native
 * `<dialog>` overlay. Mirrors the rendering semantics of the React bindings'
 * `AppShell` so workspace-core's dialogs behave identically across all hosts.
 *
 * Returns a cleanup that removes every mounted dialog and unsubscribes.
 */
export function bindDialogStack(ctx: Record<string, unknown>): () => void {
  const stack = getDialogStackView(ctx);
  const registry = getComponentRegistry(ctx);
  const mounted = new Map<DialogView, MountedDialog>();

  function mount(view: DialogView): void {
    if (mounted.has(view)) return;
    const element = document.createElement("dialog");
    element.dataset.dialogKey = view.key;
    applyAttributes(element, view);

    const close = (label?: string) => {
      view.close(label);
      stack.remove(view);
    };

    const handleCancel = (event: Event) => {
      // `cancel` fires for Escape on a native <dialog>.
      if (!view.closeOnEscape || !view.isDismissable) {
        event.preventDefault();
        return;
      }
      close(undefined);
    };

    const handleClick = (event: MouseEvent) => {
      // Click outside the inner content — the click target is the dialog itself.
      if (!view.closeOnClickOutside || !view.isDismissable) return;
      if (event.target === element) close(undefined);
    };

    element.addEventListener("cancel", handleCancel);
    element.addEventListener("click", handleClick);

    const headerCleanup = renderHeader(element, view, registry);
    const bodyCleanup = renderBody(element, view, registry);
    const footerCleanup = renderFooter(element, view, close);

    document.body.appendChild(element);
    if (typeof element.showModal === "function") {
      element.showModal();
    } else {
      element.setAttribute("open", "");
    }

    const unsubscribe = view.onUpdate(() => applyAttributes(element, view));

    mounted.set(view, {
      element,
      cleanup: () => {
        unsubscribe();
        element.removeEventListener("cancel", handleCancel);
        element.removeEventListener("click", handleClick);
        headerCleanup();
        bodyCleanup();
        footerCleanup();
        if (typeof element.close === "function") element.close();
        element.remove();
      },
    });
  }

  function unmount(view: DialogView): void {
    const entry = mounted.get(view);
    if (!entry) return;
    entry.cleanup();
    mounted.delete(view);
  }

  function reconcile(views: DialogView[]): void {
    const next = new Set(views);
    for (const view of mounted.keys()) {
      if (!next.has(view)) unmount(view);
    }
    for (const view of views) mount(view);
  }

  // Render any dialogs already in the stack (UIModelRegistry retains state).
  reconcile(stack.getAll());
  const stackUnsubscribe = stack.onUpdate(() => reconcile(stack.getAll()));

  return () => {
    stackUnsubscribe();
    for (const view of [...mounted.keys()]) unmount(view);
  };
}

function applyAttributes(element: HTMLDialogElement, view: DialogView): void {
  element.classList.toggle("dialog-centered", view.centered);
  element.classList.toggle("dialog-fullscreen", view.fullScreen);
  element.dataset.size = view.size;
  element.dataset.dismissable = String(view.isDismissable);
}

function renderHeader(
  element: HTMLDialogElement,
  view: DialogView,
  registry: HtmlComponentRegistry,
): () => void {
  const header = (view as unknown as ContentPanelView).header;
  if (header === undefined) return () => {};
  const slot = document.createElement("header");
  slot.dataset.role = "dialog-header";
  if (typeof header === "string") {
    const heading = document.createElement("h2");
    heading.textContent = header;
    slot.appendChild(heading);
    element.appendChild(slot);
    return () => slot.remove();
  }
  const factory = registry.resolve(header);
  if (!factory) {
    element.appendChild(slot);
    return () => slot.remove();
  }
  const [child, removeChild] = factory({ model: header, components: registry });
  slot.appendChild(child);
  element.appendChild(slot);
  return () => {
    removeChild();
    slot.remove();
  };
}

function renderBody(
  element: HTMLDialogElement,
  view: DialogView,
  registry: HtmlComponentRegistry,
): () => void {
  const body = document.createElement("div");
  body.dataset.role = "dialog-body";
  const removers: Array<() => void> = [];
  for (const child of (view as unknown as ContentPanelView).children) {
    const factory = registry.resolve(child);
    if (!factory) continue;
    const [node, remove] = factory({ model: child, components: registry });
    body.appendChild(node);
    removers.push(remove);
  }
  element.appendChild(body);
  return () => {
    for (const remove of removers) remove();
    body.remove();
  };
}

function renderFooter(
  element: HTMLDialogElement,
  view: DialogView,
  close: (label?: string) => void,
): () => void {
  if (view.buttons.length === 0) return () => {};
  const footer = document.createElement("footer");
  footer.dataset.role = "dialog-footer";
  const handlers: Array<{ btn: HTMLButtonElement; listener: () => void }> = [];
  for (const button of view.buttons) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = button.label;
    if (button.variant) btn.dataset.variant = button.variant;
    const listener = () => handleButtonClick(button, close);
    btn.addEventListener("click", listener);
    footer.appendChild(btn);
    handlers.push({ btn, listener });
  }
  element.appendChild(footer);
  return () => {
    for (const { btn, listener } of handlers) btn.removeEventListener("click", listener);
    footer.remove();
  };
}

function handleButtonClick(button: DialogButton, close: (label?: string) => void): void {
  const result = button.onClick?.();
  if (result === false) return;
  close(button.label);
}
