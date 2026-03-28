import { ViewModel } from "../core/index.js";

export class PaginationModel extends ViewModel {
  #page: number;
  #pageSize: number;
  #total: number;

  constructor(options?: {
    key?: string;
    page?: number;
    pageSize?: number;
    total?: number;
  }) {
    super({ key: options?.key });
    this.#page = options?.page ?? 1;
    this.#pageSize = options?.pageSize ?? 10;
    this.#total = options?.total ?? 0;
  }

  get page(): number {
    return this.#page;
  }
  set page(value: number) {
    this.#page = value;
    this.notify();
  }

  get pageSize(): number {
    return this.#pageSize;
  }
  set pageSize(value: number) {
    this.#pageSize = value;
    this.notify();
  }

  get total(): number {
    return this.#total;
  }
  set total(value: number) {
    this.#total = value;
    this.notify();
  }

  get totalPages(): number {
    return this.#pageSize > 0 ? Math.ceil(this.#total / this.#pageSize) : 0;
  }

  get hasNext(): boolean {
    return this.#page < this.totalPages;
  }

  get hasPrevious(): boolean {
    return this.#page > 1;
  }

  setPage(page: number): void {
    this.#page = Math.max(1, Math.min(page, this.totalPages));
    this.notify();
  }

  next(): void {
    if (this.hasNext) {
      this.#page++;
      this.notify();
    }
  }

  previous(): void {
    if (this.hasPrevious) {
      this.#page--;
      this.notify();
    }
  }

  setTotal(total: number): void {
    this.#total = total;
    this.notify();
  }

  setPageSize(pageSize: number): void {
    this.#pageSize = pageSize;
    this.notify();
  }
}
