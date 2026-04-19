import { ViewModel } from "../core/index.js";

export class TextView extends ViewModel {
  #text: string;
  set text(value: string) {
    this.#text = value;
    this.notify();
  }
  get text(): string {
    return this.#text;
  }

  constructor(options: {
    text: string;
    key?: string;
  }) {
    super({ key: options.key });
    this.#text = options.text;
  }

  setText(text: string): void {
    this.text = text;
  }
}
