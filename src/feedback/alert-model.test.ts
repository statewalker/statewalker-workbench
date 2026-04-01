import { describe, expect, it, vi } from "vitest";
import { ViewModel } from "../core/view-model.js";
import { AlertView } from "./alert-view.js";

describe("AlertView", () => {
  it("has sensible defaults", () => {
    const alert = new AlertView({ title: "Heads up" });
    expect(alert.variant).toBe("default");
    expect(alert.title).toBe("Heads up");
    expect(alert.description).toBeUndefined();
    expect(alert.icon).toBeUndefined();
  });

  it("accepts all options", () => {
    const desc = new ViewModel({ key: "desc" });
    const alert = new AlertView({
      variant: "destructive",
      title: "Error",
      description: desc,
      icon: "alert-triangle",
      key: "a1",
    });
    expect(alert.key).toBe("a1");
    expect(alert.variant).toBe("destructive");
    expect(alert.description).toBe(desc);
    expect(alert.icon).toBe("alert-triangle");
  });

  it("setTitle notifies", () => {
    const alert = new AlertView({ title: "Old" });
    const listener = vi.fn();
    alert.onUpdate(listener);

    alert.setTitle("New");

    expect(alert.title).toBe("New");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("setDescription notifies", () => {
    const alert = new AlertView({ title: "T" });
    const listener = vi.fn();
    alert.onUpdate(listener);

    alert.setDescription("details");

    expect(alert.description).toBe("details");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("setVariant notifies", () => {
    const alert = new AlertView({ title: "T" });
    const listener = vi.fn();
    alert.onUpdate(listener);

    alert.setVariant("warning");

    expect(alert.variant).toBe("warning");
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
