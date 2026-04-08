import { newAdapter } from "@repo/shared/adapters";
import {
  ComponentRegistryContext,
  ReactComponentRegistry,
} from "@repo/shared-react/component-registry";
import { Icon, IconRegistryProvider } from "@repo/shared-react/icons";
import type { ActionView, DialogView } from "@repo/shared-views";
import {
  type ActivePanelView,
  type DockPanelView,
  getActivePanelView,
  getDialogStackView,
  getKeyboardView,
  getToolbarView,
  getTopMenuView,
  listenPanel,
} from "@repo/shared-views";
import { Moon, Sun } from "lucide-react";
import {
  type ComponentType,
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Button } from "../components/ui/button.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog.js";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "../components/ui/menubar.js";
import { createIconRegistry } from "../icons/init-icons.js";
import { DockProvider, panelsToTreeFromViews } from "./dock-context.js";
import { DockLayout } from "./dock-layout.js";
import { useModelItems } from "./use-model-items.js";

/**
 * Provides the ActivePanelView to dock panel components.
 * The model is the single source of truth for which panel is focused.
 */
const ActivePanelCtx = createContext<ActivePanelView | null>(null);
export function useActivePanelView(): ActivePanelView | null {
  return useContext(ActivePanelCtx);
}

const [getComponentRegistry] = newAdapter<ReactComponentRegistry>(
  "aspect:component-registry",
  () => new ReactComponentRegistry(),
);

export { getComponentRegistry };

interface AppShellProps {
  context: Record<string, unknown>;
  wrapper?: ComponentType<{ children: ReactNode }>;
}

const iconRegistry = createIconRegistry();

export function AppShell({ context, wrapper: Wrapper }: AppShellProps) {
  const registry = useMemo(() => getComponentRegistry(context), [context]);

  const dialogsModel = getDialogStackView(context);
  const toolbarModel = getToolbarView(context);
  const menuModel = getTopMenuView(context);

  const [panels, setPanels] = useState<DockPanelView[]>([]);
  useEffect(() => listenPanel(context, setPanels), [context]);
  const dialogs = useModelItems(dialogsModel);
  const toolbarActions = useModelItems(toolbarModel);
  const menus = useModelItems(menuModel);

  const tree = useMemo(() => panelsToTreeFromViews(panels), [panels]);

  const activePanelModel = getActivePanelView(context);

  // Keyboard listener — dispatches registered key bindings from KeyboardView
  const keyboardModel = getKeyboardView(context);
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent): void {
      // Skip form elements
      const tag = (document.activeElement as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      // Skip when dialog is open
      if (document.querySelector("[role=dialog]")) return;

      // Build key string: "Ctrl+Shift+F3", "ArrowDown", etc.
      const parts: string[] = [];
      if (e.ctrlKey || e.metaKey) parts.push("Ctrl");
      if (e.shiftKey) parts.push("Shift");
      if (e.altKey) parts.push("Alt");
      parts.push(e.key);
      const combo = parts.length > 1 ? parts.join("+") : e.key;

      // Try combo first, then plain key
      const bindings =
        keyboardModel.getBindings(combo).length > 0
          ? keyboardModel.getBindings(combo)
          : keyboardModel.getBindings(e.key);

      for (const binding of bindings) {
        if (binding.preventDefault !== false) {
          e.preventDefault();
        }
        binding.execute();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [keyboardModel]);

  const topDialog =
    dialogs.length > 0 ? dialogs[dialogs.length - 1] : undefined;

  const content = (
    <IconRegistryProvider value={iconRegistry}>
      <ComponentRegistryContext.Provider value={registry}>
        <div className="flex flex-col h-full w-full bg-background text-foreground">
          <AppMenuBar menus={menus} />
          <div className="flex-1 overflow-hidden">
            <ActivePanelCtx.Provider value={activePanelModel}>
              <DockProvider initialLayout={tree}>
                <DockLayout />
              </DockProvider>
            </ActivePanelCtx.Provider>
          </div>
          <Toolbar actions={toolbarActions} />
          <DialogOverlay dialog={topDialog} registry={registry} />
        </div>
      </ComponentRegistryContext.Provider>
    </IconRegistryProvider>
  );

  if (Wrapper) {
    return <Wrapper>{content}</Wrapper>;
  }
  return content;
}

function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );
  return (
    <Button
      variant="ghost"
      size="icon"
      className="ml-auto size-8"
      onClick={() => {
        const isDark = document.documentElement.classList.toggle("dark");
        setDark(isDark);
        try {
          localStorage.setItem("theme", isDark ? "dark" : "light");
        } catch {
          // localStorage unavailable
        }
      }}
      title={dark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {dark ? (
        <Sun className="size-4" aria-hidden="true" />
      ) : (
        <Moon className="size-4" aria-hidden="true" />
      )}
    </Button>
  );
}

function AppMenuBar({ menus }: { menus: ActionView[] }) {
  return (
    <Menubar className="border-0 border-b border-border rounded-none shadow-none bg-card">
      {menus.map((menu) => (
        <MenubarMenu key={menu.actionKey}>
          <MenubarTrigger>
            {menu.icon && <Icon name={menu.icon} className="size-4 mr-1.5" />}
            {menu.label ?? menu.actionKey}
          </MenubarTrigger>
          {menu.children.length > 0 && (
            <MenubarContent>
              {menu.children.map((item) => (
                <MenubarItem
                  key={item.actionKey}
                  disabled={item.disabled}
                  onClick={() => item.submit()}
                >
                  {item.label ?? item.actionKey}
                </MenubarItem>
              ))}
            </MenubarContent>
          )}
        </MenubarMenu>
      ))}
      <ThemeToggle />
    </Menubar>
  );
}

function Toolbar({ actions }: { actions: ActionView[] }) {
  if (actions.length === 0) return null;
  return (
    <div className="flex items-center justify-center gap-1 px-2 py-1.5 overflow-x-auto bg-(--toolbar) border-t border-border">
      {actions.map((action) => {
        // Extract F-key prefix from label (e.g., "F3 View" → key="F3", label="View")
        const labelText = action.label ?? action.actionKey;
        const fKeyMatch = labelText.match(/^(F\d+)\s+(.+)$/);

        return (
          <Button
            variant="ghost"
            key={action.actionKey}
            disabled={action.disabled}
            onClick={() => action.submit()}
            className="flex items-center gap-1 h-auto px-2 py-1 text-sm"
          >
            {fKeyMatch ? (
              <>
                <kbd className="inline-flex items-center justify-center px-1.5 py-0.5 text-[0.65rem] font-mono font-semibold rounded bg-muted text-muted-foreground border border-border/50 min-w-[1.5rem]">
                  {fKeyMatch[1]}
                </kbd>
                <span>{fKeyMatch[2]}</span>
              </>
            ) : (
              <span>{labelText}</span>
            )}
          </Button>
        );
      })}
    </div>
  );
}

function DialogOverlay({
  dialog,
  registry,
}: {
  dialog: DialogView | undefined;
  registry: ReactComponentRegistry;
}) {
  if (!dialog) return null;
  const DialogComponent = registry.resolve(dialog);
  if (!DialogComponent) return null;
  return (
    <Dialog open={true}>
      <DialogContent showCloseButton={false}>
        <DialogHeader className="sr-only">
          <DialogTitle>
            {typeof dialog.header === "string" ? dialog.header : "Dialog"}
          </DialogTitle>
          <DialogDescription>
            {typeof dialog.header === "string" ? dialog.header : ""}
          </DialogDescription>
        </DialogHeader>
        <DialogComponent model={dialog} />
      </DialogContent>
    </Dialog>
  );
}
