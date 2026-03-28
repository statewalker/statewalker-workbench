import { type ActionModel, ViewModel } from "../core/index.js";

export class FileTriggerModel extends ViewModel {
  readonly action: ActionModel;

  #acceptedFileTypes: string[] = [];
  set acceptedFileTypes(value: string[]) {
    this.#acceptedFileTypes = value;
    this.notify();
  }
  get acceptedFileTypes(): string[] {
    return this.#acceptedFileTypes;
  }

  #allowsMultiple = false;
  set allowsMultiple(value: boolean) {
    this.#allowsMultiple = value;
    this.notify();
  }
  get allowsMultiple(): boolean {
    return this.#allowsMultiple;
  }

  constructor(options: {
    action: ActionModel;
    acceptedFileTypes?: string[];
    allowsMultiple?: boolean;
    key?: string;
  }) {
    super({ key: options.key });
    this.action = options.action;
    this.#acceptedFileTypes = options.acceptedFileTypes ?? [];
    this.#allowsMultiple = options.allowsMultiple ?? false;
  }
}
