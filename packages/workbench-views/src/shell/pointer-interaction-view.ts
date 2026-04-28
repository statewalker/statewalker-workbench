import { newAdapter } from "@statewalker/shared-adapters";
import { BaseClass } from "@statewalker/shared-baseclass";

/**
 * Pointer token — workspace-scoped low-level interaction model for pointer
 * (mouse / touch) events. Apps reach the workspace-scoped instance via
 * `workspace.requireAdapter(Pointer)`; the workspace's adapter system
 * accepts any plain class, so this token does not need to import or
 * implement `WorkspaceAdapter`. DOM bindings write logical pointer state
 * here; controllers subscribe and react to the latest action.
 */
export class Pointer extends BaseClass {
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

export { Pointer as PointerInteractionView };

export const [getPointerInteractionView] = newAdapter<Pointer>(
  "model:pointer-interaction",
  () => new Pointer(),
);
