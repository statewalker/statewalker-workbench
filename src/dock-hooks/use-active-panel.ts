import { createContext, useContext } from "react";

// Generic context for tracking active panel
const ActivePanelCtx = createContext<{
  activePanelKey: string | null;
  setActivePanel: (key: string | null) => void;
} | null>(null);

export const ActivePanelProvider = ActivePanelCtx.Provider;

export function useActivePanel() {
  return useContext(ActivePanelCtx);
}
