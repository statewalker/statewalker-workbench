import { BaseClass } from "@repo/shared-baseclass";

const counters = new Map<string, number>();

function generateKey(className: string): string {
  const count = (counters.get(className) ?? 0) + 1;
  counters.set(className, count);
  return `${className}-${count}`;
}

export class ViewModel extends BaseClass {
  readonly key: string;

  constructor(options?: { key?: string }) {
    super();
    this.key = options?.key ?? generateKey(this.constructor.name);
  }
}
