import { ContainerView } from "../core/index.js";

export class SidebarView extends ContainerView {
  #side: "left" | "right";
  #isOpen: boolean;
  #collapsedWidth: string;
  #expandedWidth: string;

  constructor(options?: {
    key?: string;
    children?: import("../core/index.js").ViewModel[];
    side?: "left" | "right";
    isOpen?: boolean;
    collapsedWidth?: string;
    expandedWidth?: string;
  }) {
    super({ key: options?.key, children: options?.children });
    this.#side = options?.side ?? "left";
    this.#isOpen = options?.isOpen ?? true;
    this.#collapsedWidth = options?.collapsedWidth ?? "0";
    this.#expandedWidth = options?.expandedWidth ?? "16rem";
  }

  get side(): "left" | "right" {
    return this.#side;
  }
  set side(value: "left" | "right") {
    this.#side = value;
    this.notify();
  }

  get isOpen(): boolean {
    return this.#isOpen;
  }
  set isOpen(value: boolean) {
    this.#isOpen = value;
    this.notify();
  }

  get collapsedWidth(): string {
    return this.#collapsedWidth;
  }
  set collapsedWidth(value: string) {
    this.#collapsedWidth = value;
    this.notify();
  }

  get expandedWidth(): string {
    return this.#expandedWidth;
  }
  set expandedWidth(value: string) {
    this.#expandedWidth = value;
    this.notify();
  }

  setOpen(open: boolean): void {
    this.#isOpen = open;
    this.notify();
  }

  toggle(): void {
    this.#isOpen = !this.#isOpen;
    this.notify();
  }
}
