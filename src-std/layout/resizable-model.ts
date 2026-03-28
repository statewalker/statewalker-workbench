import { ViewModel } from "../core/index.js";

export interface ResizablePanel {
  key: string;
  content: ViewModel;
  defaultSize: number;
  minSize?: number;
  maxSize?: number;
}

export class ResizableModel extends ViewModel {
  #panels: ResizablePanel[];
  #orientation: "horizontal" | "vertical";

  constructor(options?: {
    key?: string;
    panels?: ResizablePanel[];
    orientation?: "horizontal" | "vertical";
  }) {
    super({ key: options?.key });
    this.#panels = options?.panels ?? [];
    this.#orientation = options?.orientation ?? "horizontal";
  }

  get panels(): ResizablePanel[] {
    return this.#panels;
  }
  set panels(value: ResizablePanel[]) {
    this.#panels = value;
    this.notify();
  }

  get orientation(): "horizontal" | "vertical" {
    return this.#orientation;
  }
  set orientation(value: "horizontal" | "vertical") {
    this.#orientation = value;
    this.notify();
  }

  setPanels(panels: ResizablePanel[]): void {
    this.#panels = panels;
    this.notify();
  }
}
