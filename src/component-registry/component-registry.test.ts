import { describe, expect, it } from "vitest";
import { ReactComponentRegistry } from "./index.js";

// Minimal stubs — we only test lookup logic, not React rendering.
const stubComponent = (tag: string) =>
  Object.assign(() => null, { displayName: tag });

class Base {}
class Child extends Base {}
class GrandChild extends Child {}
class Unrelated {}

describe("ReactComponentRegistry", () => {
  it("resolves exact constructor match", () => {
    const registry = new ReactComponentRegistry();
    const renderer = stubComponent("BaseRenderer");
    registry.register(Base, renderer);

    expect(registry.resolve(new Base())).toBe(renderer);
  });

  it("resolves parent class when child has no registration", () => {
    const registry = new ReactComponentRegistry();
    const renderer = stubComponent("BaseRenderer");
    registry.register(Base, renderer);

    expect(registry.resolve(new Child())).toBe(renderer);
  });

  it("resolves grandparent class via prototype chain", () => {
    const registry = new ReactComponentRegistry();
    const renderer = stubComponent("BaseRenderer");
    registry.register(Base, renderer);

    expect(registry.resolve(new GrandChild())).toBe(renderer);
  });

  it("prefers exact match over parent", () => {
    const registry = new ReactComponentRegistry();
    const baseRenderer = stubComponent("BaseRenderer");
    const childRenderer = stubComponent("ChildRenderer");
    registry.register(Base, baseRenderer);
    registry.register(Child, childRenderer);

    expect(registry.resolve(new Child())).toBe(childRenderer);
    expect(registry.resolve(new GrandChild())).toBe(childRenderer);
    expect(registry.resolve(new Base())).toBe(baseRenderer);
  });

  it("returns undefined for unregistered class", () => {
    const registry = new ReactComponentRegistry();
    registry.register(Base, stubComponent("BaseRenderer"));

    expect(registry.resolve(new Unrelated())).toBeUndefined();
  });

  it("stops at Object — does not match plain objects", () => {
    const registry = new ReactComponentRegistry();
    // Nothing registered
    expect(registry.resolve({})).toBeUndefined();
    expect(registry.resolve(new Base())).toBeUndefined();
  });

  it("cleanup removes registration and fallback stops working", () => {
    const registry = new ReactComponentRegistry();
    const renderer = stubComponent("BaseRenderer");
    const cleanup = registry.register(Base, renderer);

    expect(registry.resolve(new Child())).toBe(renderer);

    cleanup();

    expect(registry.resolve(new Child())).toBeUndefined();
    expect(registry.resolve(new Base())).toBeUndefined();
  });
});
