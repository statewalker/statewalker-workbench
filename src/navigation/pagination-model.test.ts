import { describe, expect, it, vi } from "vitest";
import { PaginationView } from "./pagination-view.js";

describe("PaginationView", () => {
  it("has sensible defaults", () => {
    const p = new PaginationView({});
    expect(p.page).toBe(1);
    expect(p.pageSize).toBe(10);
    expect(p.total).toBe(0);
    expect(p.totalPages).toBe(0);
    expect(p.hasNext).toBe(false);
    expect(p.hasPrevious).toBe(false);
  });

  it("computes totalPages correctly", () => {
    const p = new PaginationView({ total: 25, pageSize: 10 });
    expect(p.totalPages).toBe(3);
  });

  it("totalPages is 0 when pageSize is 0", () => {
    const p = new PaginationView({ total: 10, pageSize: 0 });
    expect(p.totalPages).toBe(0);
  });

  it("hasNext and hasPrevious are correct", () => {
    const p = new PaginationView({ total: 30, pageSize: 10, page: 2 });
    expect(p.hasPrevious).toBe(true);
    expect(p.hasNext).toBe(true);
  });

  it("setPage clamps to valid range and notifies", () => {
    const p = new PaginationView({ total: 30, pageSize: 10 });
    const listener = vi.fn();
    p.onUpdate(listener);

    p.setPage(2);
    expect(p.page).toBe(2);
    expect(listener).toHaveBeenCalledTimes(1);

    p.setPage(100);
    expect(p.page).toBe(3);

    p.setPage(0);
    expect(p.page).toBe(1);
  });

  it("setPage does not notify when page stays same", () => {
    const p = new PaginationView({ total: 10, pageSize: 10, page: 1 });
    const listener = vi.fn();
    p.onUpdate(listener);

    p.setPage(1);
    expect(listener).not.toHaveBeenCalled();
  });

  it("next and previous navigate correctly", () => {
    const p = new PaginationView({ total: 30, pageSize: 10, page: 1 });

    p.next();
    expect(p.page).toBe(2);

    p.next();
    expect(p.page).toBe(3);

    p.next();
    expect(p.page).toBe(3); // stays at last

    p.previous();
    expect(p.page).toBe(2);

    p.setPage(1);
    p.previous();
    expect(p.page).toBe(1); // stays at first
  });

  it("setTotal adjusts page if current page exceeds new total", () => {
    const p = new PaginationView({ total: 50, pageSize: 10, page: 5 });
    const listener = vi.fn();
    p.onUpdate(listener);

    p.setTotal(20);

    expect(p.total).toBe(20);
    expect(p.page).toBe(2);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("setPageSize adjusts page if needed", () => {
    const p = new PaginationView({ total: 50, pageSize: 10, page: 5 });

    p.setPageSize(25);

    expect(p.pageSize).toBe(25);
    expect(p.page).toBe(2);
  });
});
