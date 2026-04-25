import { createContext, useContext } from "react";

/**
 * Shared React context for the application context bag.
 * Provided by AppShell — available to all components in the tree.
 */
const AppCtx = createContext<Record<string, unknown> | null>(null);

export const AppContextProvider = AppCtx.Provider;

export function useAppContext(): Record<string, unknown> | null {
  return useContext(AppCtx);
}
