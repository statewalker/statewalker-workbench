import { ViewModel } from "../core/index.js";

export class KbdView extends ViewModel {
  readonly keys: string;

  constructor(options: {
    keys: string;
    key?: string;
  }) {
    super({ key: options.key });
    this.keys = options.keys;
  }
}
