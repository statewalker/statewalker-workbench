import { newAdapter } from "@repo/shared/adapters";
import {
  AppContextProvider,
  useAppContext,
} from "@repo/shared-react/app-context";
import {
  ComponentRegistryContext,
  ReactComponentRegistry,
} from "@repo/shared-react/component-registry";
import { Icon, IconRegistryProvider } from "@repo/shared-react/icons";
import type { ActionView, DialogView, ViewModel } from "@repo/shared-views";
import {
  type ActivePanelView,
  type DockPanelView,
  getActivePanelView,
  getDialogStackView,
  getThemeView,
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

  const topDialog =
    dialogs.length > 0 ? dialogs[dialogs.length - 1] : undefined;

  const content = (
    <AppContextProvider value={context}>
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
            <DialogOverlay dialog={topDialog} context={context} />
          </div>
        </ComponentRegistryContext.Provider>
      </IconRegistryProvider>
    </AppContextProvider>
  );

  if (Wrapper) {
    return <Wrapper>{content}</Wrapper>;
  }
  return content;
}

function ThemeToggle() {
  const ctx = useAppContext();
  const theme = useMemo(() => (ctx ? getThemeView(ctx) : null), [ctx]);
  const [dark, setDark] = useState(() => theme?.isDark ?? true);

  useEffect(() => {
    if (!theme) return;
    setDark(theme.isDark);
    return theme.onUpdate(() => setDark(theme.isDark));
  }, [theme]);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="ml-auto size-8"
      onClick={() => theme?.toggle()}
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

const dialogSizePresets: Record<string, string> = {
  xs: "sm:max-w-xs",
  sm: "sm:max-w-sm",
  md: "sm:max-w-lg",
  lg: "sm:max-w-3xl",
  xl: "sm:max-w-5xl",
};

function DialogOverlay({
  dialog,
  context,
}: {
  dialog: DialogView | undefined;
  context: Record<string, unknown>;
}) {
  if (!dialog) return null;

  const title = typeof dialog.header === "string" ? dialog.header : "Dialog";

  const dismiss = () => {
    dialog.close(undefined);
    getDialogStackView(context).remove(dialog);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && dialog.isDismissable) dismiss();
  };

  const handleButton = (btn: (typeof dialog.buttons)[number]) => {
    const result = btn.onClick?.();
    if (result !== false) {
      dialog.close(btn.label);
      getDialogStackView(context).remove(dialog);
    }
  };

  const sizeClass = dialogSizePresets[dialog.size] ?? "";
  const sizeStyle = sizeClass ? undefined : { maxWidth: dialog.size };

  return (
    <Dialog open={true} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={dialog.isDismissable}
        className={`${sizeClass} ${dialog.fullScreen ? "w-screen! h-screen! max-w-none! max-h-none! rounded-none!" : "max-h-[85vh]"} flex flex-col`}
        style={sizeStyle}
        onEscapeKeyDown={
          dialog.closeOnEscape ? undefined : (e) => e.preventDefault()
        }
        onPointerDownOutside={
          dialog.closeOnClickOutside ? undefined : (e) => e.preventDefault()
        }
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="sr-only">{title}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          {dialog.children.map((child: ViewModel) => (
            <RenderChild key={child.key} model={child} />
          ))}
        </div>
        {(dialog.footer || dialog.buttons.length > 0) && (
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end pt-4 border-t">
            {dialog.footer &&
              (typeof dialog.footer === "string" ? (
                <span className="mr-auto text-sm text-muted-foreground">
                  {dialog.footer}
                </span>
              ) : (
                <div className="mr-auto">
                  <RenderChild model={dialog.footer} />
                </div>
              ))}
            {dialog.buttons.map((btn) => (
              <Button
                key={btn.label}
                variant={btn.variant ?? "default"}
                onClick={() => handleButton(btn)}
              >
                {btn.label}
              </Button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function RenderChild({ model }: { model: ViewModel }) {
  const registry = useContext(ComponentRegistryContext);
  const Component = registry.resolve(model);
  if (!Component) return null;
  return <Component model={model} />;
}
