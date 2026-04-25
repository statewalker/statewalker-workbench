import { describe, expect, it, vi } from "vitest";
import {
  getToastStackView,
  listenToast,
  publishToast,
  ToastStackView,
} from "./toast-stack-view.js";
import { ToastView } from "./toast-view.js";

function makeToast(message: string): ToastView {
  return new ToastView({ message });
}

describe("ToastStackView", () => {
  it("getToastStackView auto-creates a stack on first access", () => {
    const ctx: Record<string, unknown> = {};
    const stack = getToastStackView(ctx);
    expect(stack).toBeInstanceOf(ToastStackView);
    expect(stack.getAll()).toEqual([]);
  });

  it("publishToast appends and returns a remover", () => {
    const ctx: Record<string, unknown> = {};
    const a = makeToast("a");
    const b = makeToast("b");

    const removeA = publishToast(ctx, a);
    publishToast(ctx, b);

    const stack = getToastStackView(ctx);
    expect(stack.getAll()).toEqual([a, b]);

    removeA();
    expect(stack.getAll()).toEqual([b]);
  });

  it("listenToast emits the current set on subscribe and on every change", () => {
    const ctx: Record<string, unknown> = {};
    const cb = vi.fn();

    const a = makeToast("a");
    publishToast(ctx, a); // pre-existing entry

    const unsubscribe = listenToast(ctx, cb);
    expect(cb).toHaveBeenLastCalledWith([a]); // initial flush

    const b = makeToast("b");
    const removeB = publishToast(ctx, b);
    expect(cb).toHaveBeenLastCalledWith([a, b]);

    removeB();
    expect(cb).toHaveBeenLastCalledWith([a]);

    unsubscribe();
    publishToast(ctx, makeToast("c"));
    // No further calls after unsubscribe.
    expect(cb).toHaveBeenLastCalledWith([a]);
  });
});
