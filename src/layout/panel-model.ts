import { BaseClass } from "@repo/shared/models";
import type { ViewModel } from "../view-model.js";

export interface PanelContent {
  key: string;
  label: string;
  icon?: string;
  model: ViewModel;
  closable?: boolean;
}

/**
 * Observable model for a single named panel slot.
 *
 * Holds published content (tabs), tracks the active tab and focus state.
 * UI components subscribe via `useUpdates(panel.onUpdate)`.
 */
export class LayoutPanelModel extends BaseClass {
  readonly name: string;
  private _contents: PanelContent[] = [];
  private _activeKey: string | null = null;
  private _focused = false;

  constructor(name: string) {
    super();
    this.name = name;
  }

  get contents(): readonly PanelContent[] {
    return this._contents;
  }

  get activeKey(): string | null {
    return this._activeKey;
  }

  get focused(): boolean {
    return this._focused;
  }

  getActiveContent(): PanelContent | undefined {
    return (
      this._contents.find((c) => c.key === this._activeKey) ?? this._contents[0]
    );
  }

  findContent(key: string): PanelContent | undefined {
    return this._contents.find((c) => c.key === key);
  }

  get isEmpty(): boolean {
    return this._contents.length === 0;
  }

  /**
   * Publish content into this panel. Returns an unpublish function.
   */
  publish(content: PanelContent): () => void {
    this._contents = [...this._contents, content];
    this._activeKey = content.key;
    this.notify();
    return () => this.unpublish(content.key);
  }

  /**
   * Remove published content by key.
   */
  unpublish(contentKey: string): void {
    const idx = this._contents.findIndex((c) => c.key === contentKey);
    if (idx < 0) return;
    this._contents = this._contents.filter((c) => c.key !== contentKey);
    if (this._activeKey === contentKey) {
      this._activeKey = this._contents[0]?.key ?? null;
    }
    this.notify();
  }

  /**
   * Set the active tab by content key.
   */
  activateTab(contentKey: string): void {
    if (this._activeKey !== contentKey) {
      this._activeKey = contentKey;
      this.notify();
    }
  }

  /**
   * Set focus state. Called by LayoutModel when the active panel changes.
   */
  setFocused(focused: boolean): void {
    if (this._focused !== focused) {
      this._focused = focused;
      this.notify();
    }
  }
}
