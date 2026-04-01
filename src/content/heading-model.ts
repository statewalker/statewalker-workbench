import { ViewModel } from "../core/index.js";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export class HeadingModel extends ViewModel {
  #text: string;
  set text(value: string) {
    this.#text = value;
    this.notify();
  }
  get text(): string {
    return this.#text;
  }

  #level: HeadingLevel = 2;
  set level(value: HeadingLevel) {
    this.#level = value;
    this.notify();
  }
  get level(): HeadingLevel {
    return this.#level;
  }

  constructor(options: {
    text: string;
    level?: HeadingLevel;
    key?: string;
  }) {
    super({ key: options.key });
    this.#text = options.text;
    this.#level = options.level ?? 2;
  }

  setText(text: string): void {
    this.text = text;
  }
}
