import { validateSpec } from "@json-render/core";
import { describe, expect, it } from "vitest";
import { makeLocalModelsTabSpec } from "./local-models-tab-spec.js";

describe("makeLocalModelsTabSpec", () => {
  const spec = makeLocalModelsTabSpec();
  const result = validateSpec(spec);

  it("is structurally valid", () => {
    expect(result.valid).toBe(true);
    const errors = result.issues.filter((i) => i.severity === "error");
    expect(errors).toEqual([]);
  });

  it("contains no Dialog elements", () => {
    const dialogs = Object.values(spec.elements).filter((el) => el.type === "Dialog");
    expect(dialogs).toHaveLength(0);
  });
});
