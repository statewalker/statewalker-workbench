import { newAdapter } from "@repo/shared-adapters";
import { BaseClass } from "@repo/shared-baseclass";

/**
 * Low-level interaction model for pointer (mouse/touch) events.
 * DOM bindings write logical pointer state here.
 * Controllers subscribe and react to pointer interactions.
 */
export class PointerInteractionView extends BaseClass {
  action: "click" | "dblclick" | "none" = "none";
  x = 0;
  y = 0;

  click(x: number, y: number): void {
    this.action = "click";
    this.x = x;
    this.y = y;
    this.notify();
  }

  doubleClick(x: number, y: number): void {
    this.action = "dblclick";
    this.x = x;
    this.y = y;
    this.notify();
  }
}

export const [getPointerInteractionView] =
  newAdapter<PointerInteractionView>(
    "model:pointer-interaction",
    () => new PointerInteractionView(),
  );
