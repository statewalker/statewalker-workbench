import { describe, expect, it, vi } from "vitest";
import { ProgressModel } from "./progress-model.js";

describe("ProgressModel", () => {
  it("has sensible defaults", () => {
    const p = new ProgressModel({});
    expect(p.value).toBe(0);
    expect(p.max).toBe(100);
    expect(p.label).toBeUndefined();
    expect(p.indeterminate).toBe(false);
  });

  it("accepts all options", () => {
    const p = new ProgressModel({
      value: 50,
      max: 200,
      label: "Loading...",
      indeterminate: true,
      key: "p1",
    });
    expect(p.key).toBe("p1");
    expect(p.value).toBe(50);
    expect(p.max).toBe(200);
    expect(p.label).toBe("Loading...");
    expect(p.indeterminate).toBe(true);
  });

  it("percentage computes correctly", () => {
    const p = new ProgressModel({ value: 25, max: 50 });
    expect(p.percentage).toBe(50);
  });

  it("percentage returns 0 when max is 0", () => {
    const p = new ProgressModel({ value: 10, max: 0 });
    expect(p.percentage).toBe(0);
  });

  it("setValue clamps and notifies", () => {
    const p = new ProgressModel({ max: 100 });
    const listener = vi.fn();
    p.onUpdate(listener);

    p.setValue(50);
    expect(p.value).toBe(50);
    expect(listener).toHaveBeenCalledTimes(1);

    p.setValue(150);
    expect(p.value).toBe(100);

    p.setValue(-10);
    expect(p.value).toBe(0);
  });

  it("setValue clears indeterminate", () => {
    const p = new ProgressModel({ indeterminate: true });
    p.setValue(30);
    expect(p.indeterminate).toBe(false);
  });

  it("setIndeterminate notifies", () => {
    const p = new ProgressModel({});
    const listener = vi.fn();
    p.onUpdate(listener);

    p.setIndeterminate(true);

    expect(p.indeterminate).toBe(true);
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
