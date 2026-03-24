import { ViewModel } from "../view-model.js";

export class PaginationModel extends ViewModel {
  page: number;
  pageSize: number;
  total: number;

  constructor(options: {
    page?: number;
    pageSize?: number;
    total?: number;
    key?: string;
  }) {
    super({ key: options.key });
    this.page = options.page ?? 1;
    this.pageSize = options.pageSize ?? 10;
    this.total = options.total ?? 0;
  }

  get totalPages(): number {
    return this.pageSize > 0 ? Math.ceil(this.total / this.pageSize) : 0;
  }

  get hasNext(): boolean {
    return this.page < this.totalPages;
  }

  get hasPrevious(): boolean {
    return this.page > 1;
  }

  setPage(page: number) {
    const clamped = Math.min(Math.max(1, page), this.totalPages || 1);
    if (clamped !== this.page) {
      this.page = clamped;
      this.notify();
    }
  }

  next() {
    if (this.hasNext) {
      this.setPage(this.page + 1);
    }
  }

  previous() {
    if (this.hasPrevious) {
      this.setPage(this.page - 1);
    }
  }

  setTotal(total: number) {
    this.total = total;
    if (this.page > this.totalPages && this.totalPages > 0) {
      this.page = this.totalPages;
    }
    this.notify();
  }

  setPageSize(pageSize: number) {
    this.pageSize = pageSize;
    if (this.page > this.totalPages && this.totalPages > 0) {
      this.page = this.totalPages;
    }
    this.notify();
  }
}
