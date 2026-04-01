import { type ActionModel, ContainerModel } from "../core/index.js";

export type ActionGroupOrientation = "horizontal" | "vertical";
export type ActionGroupSize = "XS" | "S" | "M" | "L" | "XL";
export type ActionGroupDensity = "compact" | "regular";
export type ActionGroupSelectionMode = "none" | "single" | "multiple";

export class ActionGroupModel extends ContainerModel<ActionModel> {
  #orientation: ActionGroupOrientation = "horizontal";
  set orientation(value: ActionGroupOrientation) {
    this.#orientation = value;
    this.notify();
  }
  get orientation(): ActionGroupOrientation {
    return this.#orientation;
  }

  #size: ActionGroupSize = "M";
  set size(value: ActionGroupSize) {
    this.#size = value;
    this.notify();
  }
  get size(): ActionGroupSize {
    return this.#size;
  }

  #density: ActionGroupDensity = "regular";
  set density(value: ActionGroupDensity) {
    this.#density = value;
    this.notify();
  }
  get density(): ActionGroupDensity {
    return this.#density;
  }

  #isJustified = false;
  set isJustified(value: boolean) {
    this.#isJustified = value;
    this.notify();
  }
  get isJustified(): boolean {
    return this.#isJustified;
  }

  #isQuiet = false;
  set isQuiet(value: boolean) {
    this.#isQuiet = value;
    this.notify();
  }
  get isQuiet(): boolean {
    return this.#isQuiet;
  }

  #isEmphasized = false;
  set isEmphasized(value: boolean) {
    this.#isEmphasized = value;
    this.notify();
  }
  get isEmphasized(): boolean {
    return this.#isEmphasized;
  }

  #selectionMode: ActionGroupSelectionMode = "none";
  set selectionMode(value: ActionGroupSelectionMode) {
    this.#selectionMode = value;
    this.notify();
  }
  get selectionMode(): ActionGroupSelectionMode {
    return this.#selectionMode;
  }

  #selectedKeys: Set<string> = new Set();
  set selectedKeys(value: Set<string>) {
    this.#selectedKeys = value;
    this.notify();
  }
  get selectedKeys(): Set<string> {
    return this.#selectedKeys;
  }

  #disabledKeys: Set<string> = new Set();
  set disabledKeys(value: Set<string>) {
    this.#disabledKeys = value;
    this.notify();
  }
  get disabledKeys(): Set<string> {
    return this.#disabledKeys;
  }

  constructor(options?: {
    children?: ActionModel[];
    orientation?: ActionGroupOrientation;
    size?: ActionGroupSize;
    density?: ActionGroupDensity;
    isJustified?: boolean;
    isQuiet?: boolean;
    isEmphasized?: boolean;
    selectionMode?: ActionGroupSelectionMode;
    selectedKeys?: Set<string>;
    disabledKeys?: Set<string>;
    key?: string;
  }) {
    super({ children: options?.children, key: options?.key });
    this.#orientation = options?.orientation ?? "horizontal";
    this.#size = options?.size ?? "M";
    this.#density = options?.density ?? "regular";
    this.#isJustified = options?.isJustified ?? false;
    this.#isQuiet = options?.isQuiet ?? false;
    this.#isEmphasized = options?.isEmphasized ?? false;
    this.#selectionMode = options?.selectionMode ?? "none";
    this.#selectedKeys = options?.selectedKeys ?? new Set();
    this.#disabledKeys = options?.disabledKeys ?? new Set();
  }
}
