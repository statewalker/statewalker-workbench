import { describe, expect, it, vi } from "vitest";
import { ActionModel } from "../actions/action-model.js";
import { type FieldConfig, FormModel } from "./form-model.js";

function makeForm(fields: FieldConfig[] = []) {
  return new FormModel({
    fields,
    actions: [new ActionModel({ key: "submit", label: "Submit" })],
  });
}

describe("FormModel", () => {
  it("stores fields and actions", () => {
    const form = makeForm([{ key: "name", label: "Name" }]);
    expect(form.fields).toHaveLength(1);
    expect(form.actions).toHaveLength(1);
    expect(form.values).toEqual({});
    expect(form.messages).toEqual({});
  });

  it("setValue stores value and notifies", () => {
    const form = makeForm([{ key: "name", label: "Name" }]);
    const listener = vi.fn();
    form.onUpdate(listener);

    form.setValue("name", "Alice");

    expect(form.getValue("name")).toBe("Alice");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("setValue supports boolean for checkbox/switch fields", () => {
    const form = makeForm([{ key: "agree", label: "Agree", type: "checkbox" }]);
    form.setValue("agree", true);
    expect(form.getValue("agree")).toBe(true);
  });

  it("getValues returns a copy", () => {
    const form = makeForm([{ key: "a", label: "A" }]);
    form.setValue("a", "1");
    const vals = form.getValues();
    vals.a = "changed";
    expect(form.getValue("a")).toBe("1");
  });

  it("setMessage and getMessage work", () => {
    const form = makeForm([{ key: "email", label: "Email" }]);
    form.setMessage("email", { text: "Required", severity: "error" });
    expect(form.getMessage("email")?.text).toBe("Required");

    form.setMessage("email", undefined);
    expect(form.getMessage("email")).toBeUndefined();
  });

  it("setMessages replaces all messages", () => {
    const form = makeForm([{ key: "a", label: "A" }]);
    form.setMessages({ a: { text: "Bad", severity: "error" } });
    expect(form.hasErrors()).toBe(true);
  });

  it("hasErrors returns false when no error messages", () => {
    const form = makeForm([{ key: "a", label: "A" }]);
    form.setMessages({ a: { text: "Note", severity: "info" } });
    expect(form.hasErrors()).toBe(false);
  });

  it("reset clears values and messages", () => {
    const form = makeForm([{ key: "a", label: "A" }]);
    form.setValue("a", "x");
    form.setMessage("a", { text: "err", severity: "error" });

    form.reset();

    expect(form.getValues()).toEqual({});
    expect(form.messages).toEqual({});
  });

  it("onFieldsUpdate fires only when values change", () => {
    const form = makeForm([{ key: "a", label: "A" }]);
    const listener = vi.fn();
    form.onFieldsUpdate(listener);

    form.setMessage("a", { text: "x", severity: "info" });
    expect(listener).not.toHaveBeenCalled();

    form.setValue("a", "v");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("getFieldsByGroup groups fields", () => {
    const form = makeForm([
      { key: "a", label: "A", type: "checkbox", group: "prefs" },
      { key: "b", label: "B", type: "checkbox", group: "prefs" },
      { key: "c", label: "C", type: "text" },
      { key: "d", label: "D", type: "radio", group: "choice" },
    ]);

    const groups = form.getFieldsByGroup();
    expect(groups.get("prefs")).toHaveLength(2);
    expect(groups.get("choice")).toHaveLength(1);
    expect(groups.get(undefined)).toHaveLength(1);
  });

  it("field config supports new types with options", () => {
    const form = makeForm([
      {
        key: "color",
        label: "Color",
        type: "select",
        options: [
          { label: "Red", value: "red" },
          { label: "Blue", value: "blue" },
        ],
      },
      {
        key: "volume",
        label: "Volume",
        type: "slider",
        min: 0,
        max: 100,
        step: 5,
      },
    ]);
    const colorField = form.fields.find((f) => f.key === "color");
    expect(colorField?.options).toHaveLength(2);
    const sliderField = form.fields.find((f) => f.key === "volume");
    expect(sliderField?.min).toBe(0);
    expect(sliderField?.max).toBe(100);
    expect(sliderField?.step).toBe(5);
  });

  it("field config supports disabled flag", () => {
    const form = makeForm([
      { key: "locked", label: "Locked", type: "text", disabled: true },
    ]);
    expect(form.fields[0]?.disabled).toBe(true);
  });
});
