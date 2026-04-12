import { newAdapter } from "@repo/shared/adapters";
import { BaseClass } from "@repo/shared/models";

/**
 * Low-level interaction model for drag-and-drop.
 * DOM bindings write drag state here.
 * Controllers subscribe and handle drop logic.
 *
 * Origin and target are opaque identifiers — interpretation is up to the consumer.
 * Metadata carries arbitrary drag payload (items, types, etc.).
 */
export class DndInteractionView extends BaseClass {
  /** Source zone identifier. */
  origin: string | null = null;
  /** Target zone identifier. */
  target: string | null = null;
  /** Whether a drag is currently active. */
  dragging = false;
  /** Arbitrary drag metadata (items, mime types, etc.). */
  metadata: Record<string, unknown> = {};

  /** Pending drop — set on drop, consumed by the controller. */
  pendingDrop: {
    origin: string;
    target: string;
    metadata: Record<string, unknown>;
  } | null = null;

  startDrag(origin: string, metadata?: Record<string, unknown>): void {
    this.origin = origin;
    this.metadata = metadata ?? {};
    this.dragging = true;
    this.notify();
  }

  setTarget(target: string | null): void {
    if (this.target !== target) {
      this.target = target;
      this.notify();
    }
  }

  drop(target: string): void {
    if (!this.origin) return;
    if (this.origin === target) return;

    this.pendingDrop = {
      origin: this.origin,
      target,
      metadata: { ...this.metadata },
    };
    this.endDrag();
    this.notify();
  }

  endDrag(): void {
    this.origin = null;
    this.target = null;
    this.metadata = {};
    this.dragging = false;
  }

  consumeDrop(): typeof this.pendingDrop {
    const drop = this.pendingDrop;
    this.pendingDrop = null;
    return drop;
  }
}

export const [getDndInteractionView] = newAdapter<DndInteractionView>(
  "model:dnd-interaction",
  () => new DndInteractionView(),
);
