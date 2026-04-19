import { onChange } from "@statewalker/shared-baseclass";
import { ViewModel } from "../core/view-model.js";

/**
 * Generic navigation model — manages a single route identifier.
 *
 * Controllers set the route ID when the active view changes.
 * Views bind this model to the URL hash fragment or other routing mechanisms.
 */
export class NavigationView extends ViewModel {
  #routeId = "";
  #routeIdCounter = 0;

  get routeId(): string {
    return this.#routeId;
  }

  /**
   * Set the current route ID. Notifies listeners only when the value changes.
   */
  setRouteId(routeId: string): void {
    if (this.#routeId === routeId) return;
    this.#routeId = routeId;
    this.#routeIdCounter++;
    this.notify();
  }

  /**
   * Subscribe to route ID changes. The callback fires only when routeId actually changes.
   */
  onRouteIdChanged = (cb: () => void): (() => void) => {
    return onChange(this.onUpdate, cb, () => this.#routeIdCounter);
  };
}
