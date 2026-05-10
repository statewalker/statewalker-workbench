import type { Command, CommandDeclaration, Commands } from "@statewalker/shared-commands";
import type { SlotDeclaration, Slots } from "@statewalker/shared-slots";

const TRACE_KEY = "chat-mini:bus-trace";

function isTraceEnabled(): boolean {
  try {
    return globalThis.localStorage?.getItem(TRACE_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * Install development-only trace logging on the workspace's
 * `Commands` and `Slots` buses. Off by default; enable via
 * `localStorage.setItem("chat-mini:bus-trace", "1")` in the
 * browser console. When disabled, `installBusTrace` returns a
 * no-op disposer and adds NO per-call overhead.
 *
 * Implemented by wrapping `Commands.listen` and `Slots.provide` on
 * the instances passed in. The wrappers log on registration and on
 * claim/dispatch.
 */
export function installBusTrace(intents: Commands, slots: Slots): () => void {
  if (!isTraceEnabled()) return () => {};

  // ── Commands trace ────────────────────────────────────────────
  const originalListen = intents.listen.bind(intents);
  let registerOrder = 0;
  intents.listen = function tracedListen<P, R>(
    decl: CommandDeclaration<P, R>,
    fn: (cmd: Command<P, R>) => true | Promise<R> | void,
  ): () => void {
    const order = registerOrder++;
    const wrapped = (cmd: Command<P, R>): true | Promise<R> | void => {
      const result = fn(cmd);
      if (result !== undefined) {
        console.debug("[chat-mini:bus-trace] command claimed", {
          key: cmd.key,
          payload: cmd.payload,
          listenerOrder: order,
        });
      }
      return result;
    };
    return originalListen(decl, wrapped);
  };

  // ── Slots trace ──────────────────────────────────────────────
  const originalProvide = slots.provide.bind(slots);
  slots.provide = function tracedProvide<T>(decl: SlotDeclaration<T>, value: T): () => void {
    console.debug("[chat-mini:bus-trace] slot provide", { key: decl.key, value });
    const undo = originalProvide(decl, value);
    return () => {
      console.debug("[chat-mini:bus-trace] slot dispose", { key: decl.key, value });
      undo();
    };
  };

  return () => {
    delete (intents as unknown as { listen?: unknown }).listen;
    delete (slots as unknown as { provide?: unknown }).provide;
  };
}
