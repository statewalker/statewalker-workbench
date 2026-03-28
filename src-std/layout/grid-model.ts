import { ContainerModel } from "../core/index.js";

export class GridModel extends ContainerModel {
  #columns: string | string[];
  #rows: string | string[];
  #areas: string[];
  #gap: string;
  #columnGap: string | undefined;
  #rowGap: string | undefined;

  constructor(options?: {
    key?: string;
    children?: import("../core/index.js").ViewModel[];
    columns?: string | string[];
    rows?: string | string[];
    areas?: string[];
    gap?: string;
    columnGap?: string;
    rowGap?: string;
  }) {
    super({ key: options?.key, children: options?.children });
    this.#columns = options?.columns ?? "1fr";
    this.#rows = options?.rows ?? "auto";
    this.#areas = options?.areas ?? [];
    this.#gap = options?.gap ?? "0";
    this.#columnGap = options?.columnGap;
    this.#rowGap = options?.rowGap;
  }

  get columns(): string | string[] {
    return this.#columns;
  }
  set columns(value: string | string[]) {
    this.#columns = value;
    this.notify();
  }

  get rows(): string | string[] {
    return this.#rows;
  }
  set rows(value: string | string[]) {
    this.#rows = value;
    this.notify();
  }

  get areas(): string[] {
    return this.#areas;
  }
  set areas(value: string[]) {
    this.#areas = value;
    this.notify();
  }

  get gap(): string {
    return this.#gap;
  }
  set gap(value: string) {
    this.#gap = value;
    this.notify();
  }

  get columnGap(): string | undefined {
    return this.#columnGap;
  }
  set columnGap(value: string | undefined) {
    this.#columnGap = value;
    this.notify();
  }

  get rowGap(): string | undefined {
    return this.#rowGap;
  }
  set rowGap(value: string | undefined) {
    this.#rowGap = value;
    this.notify();
  }
}
