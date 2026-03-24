import { describe, expect, it } from "vitest";
import { ActionModel } from "../action-model.js";
import { EmptyModel } from "./empty-model.js";

describe("EmptyModel", () => {
  it("has sensible defaults", () => {
    const empty = new EmptyModel({ title: "No data" });
    expect(empty.title).toBe("No data");
    expect(empty.icon).toBeUndefined();
    expect(empty.description).toBeUndefined();
    expect(empty.action).toBeUndefined();
  });

  it("accepts all options", () => {
    const action = new ActionModel({ key: "add", label: "Add Item" });
    const empty = new EmptyModel({
      icon: "inbox",
      title: "Nothing here",
      description: "Try adding something",
      action,
      key: "e1",
    });
    expect(empty.key).toBe("e1");
    expect(empty.icon).toBe("inbox");
    expect(empty.title).toBe("Nothing here");
    expect(empty.description).toBe("Try adding something");
    expect(empty.action).toBe(action);
  });
});
