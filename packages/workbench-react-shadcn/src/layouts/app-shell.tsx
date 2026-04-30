import { newAdapter } from "@statewalker/shared-adapters";
import { AppContextProvider, useAppContext } from "@statewalker/workbench-react/app-context";
import {
  ComponentRegistryContext,
  ReactComponentRegistry,
} from "@statewalker/workbench-react/component-registry";
import { useUpdates } from "@statewalker/workbench-react/hooks";
import { Icon, IconRegistryProvider } from "@statewalker/workbench-react/icons";
import type { ActionView, DialogView, ToastView, ViewModel } from "@statewalker/workbench-views";
import {
  getDialogStackView,
  getPanelManagerView,
  getThemeView,
  getToastStackView,
  getToolbarView,
  getTopMenuView,
  type PanelManagerView,
} from "@statewalker/workbench-views";
import { Moon, Sun, X } from "lucide-react";
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
import { TooltipProvider } from "../components/ui/tooltip.js";
import { createIconRegistry } from "../icons/init-icons.js";
import { DockProvider } from "./dock-context.js";
import { DockLayout } from "./dock-layout.js";
import { useModelItems } from "./use-model-items.js";

/**
 * Provides the PanelManagerView to dock panel components.
 * The model is the single source of truth for which tab is active/focused.
 */
const PanelManagerCtx = createContext<PanelManagerView | null>(null);
export function usePanelManagerView(): PanelManagerView | null {
  return useContext(PanelManagerCtx);
}

/** @deprecated Use usePanelManagerView instead. */
export function useActivePanelView(): PanelManagerView | null {
  return useContext(PanelManagerCtx);
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
  const panelManager = useMemo(() => getPanelManagerView(context), [context]);

  const dialogs = useModelItems(dialogsModel);
  const toolbarActions = useModelItems(toolbarModel);
  const menus = useModelItems(menuModel);

  const topDialog = dialogs.length > 0 ? dialogs[dialogs.length - 1] : undefined;

  const content = (
    <TooltipProvider>
      <AppContextProvider value={context}>
        <IconRegistryProvider value={iconRegistry}>
          <ComponentRegistryContext.Provider value={registry}>
            <div className="flex flex-col h-full w-full bg-background text-foreground">
              <AppMenuBar menus={menus} />
              <div className="flex-1 overflow-hidden">
                <PanelManagerCtx.Provider value={panelManager}>
                  <DockProvider panelManager={panelManager}>
                    <DockLayout />
                  </DockProvider>
                </PanelManagerCtx.Provider>
              </div>
              <Toolbar actions={toolbarActions} />
              <DialogOverlay dialog={topDialog} context={context} />
              <ToastOverlay context={context} />
            </div>
          </ComponentRegistryContext.Provider>
        </IconRegistryProvider>
      </AppContextProvider>
    </TooltipProvider>
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
        <MenuEntry key={menu.actionKey} menu={menu} />
      ))}
      <ThemeToggle />
    </Menubar>
  );
}

function MenuEntry({ menu }: { menu: ActionView }) {
  // Subscribe so changes to this menu (label, disabled, children added/removed)
  // re-render the entry.
  useUpdates(menu.onUpdate);

  if (menu.children.length === 0) {
    // Leaf action — render as a plain button. radix `MenubarTrigger`
    // always toggles its (empty) menu on click and swallows the
    // `onClick` payload, so a top-level action without children would
    // appear unresponsive. A Button inside the Menubar styles the
    // same way and fires `submit()` cleanly.
    return (
      <Button
        variant="ghost"
        size="sm"
        disabled={menu.disabled}
        onClick={() => menu.submit()}
        className="h-8 px-3 text-sm font-medium"
      >
        {menu.icon && <Icon name={menu.icon} className="size-4 mr-1.5" />}
        {menu.label ?? menu.actionKey}
      </Button>
    );
  }

  return (
    <MenubarMenu>
      <MenubarTrigger>
        {menu.icon && <Icon name={menu.icon} className="size-4 mr-1.5" />}
        {menu.label ?? menu.actionKey}
      </MenubarTrigger>
      <MenubarContent>
        {menu.children.map((item) => (
          <MenubarItem key={item.actionKey} disabled={item.disabled} onClick={() => item.submit()}>
            {item.icon && <Icon name={item.icon} className="size-4 mr-1.5" />}
            {item.label ?? item.actionKey}
          </MenubarItem>
        ))}
      </MenubarContent>
    </MenubarMenu>
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

  const headerText = typeof dialog.header === "string" ? dialog.header : undefined;
  // Radix DialogContent requires an accessible title, even when no
  // visible header is rendered; fall back to "Dialog" only for a11y.
  const a11yTitle = headerText ?? "Dialog";

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
        onEscapeKeyDown={dialog.closeOnEscape ? undefined : (e) => e.preventDefault()}
        onPointerDownOutside={dialog.closeOnClickOutside ? undefined : (e) => e.preventDefault()}
      >
        {headerText !== undefined ? (
          <DialogHeader>
            <DialogTitle>{headerText}</DialogTitle>
            <DialogDescription className="sr-only">{headerText}</DialogDescription>
          </DialogHeader>
        ) : (
          <DialogTitle className="sr-only">{a11yTitle}</DialogTitle>
        )}
        <div className="flex-1 overflow-y-auto">
          {dialog.children.map((child: ViewModel) => (
            <RenderChild key={child.key} model={child} />
          ))}
        </div>
        {(dialog.footer || dialog.buttons.length > 0) && (
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end pt-4 border-t">
            {dialog.footer &&
              (typeof dialog.footer === "string" ? (
                <span className="mr-auto text-sm text-muted-foreground">{dialog.footer}</span>
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

const toastVariantClasses: Record<string, string> = {
  positive: "border-green-500",
  negative: "border-red-500",
  info: "border-blue-500",
  neutral: "border-border",
};

function ToastOverlay({ context }: { context: Record<string, unknown> }) {
  const stack = useMemo(() => getToastStackView(context), [context]);
  const toasts = useModelItems(stack);
  if (toasts.length === 0) return null;
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-2">
      {toasts.map((toast) => (
        <ToastCard key={toast.key} toast={toast} onDismiss={() => stack.remove(toast)} />
      ))}
    </div>
  );
}

function ToastCard({ toast, onDismiss }: { toast: ToastView; onDismiss: () => void }) {
  useUpdates(toast.onUpdate);

  useEffect(() => {
    if (toast.timeout <= 0) return;
    const id = setTimeout(onDismiss, toast.timeout);
    return () => clearTimeout(id);
  }, [toast.timeout, onDismiss]);

  const variantClass = toastVariantClasses[toast.variant] ?? toastVariantClasses.neutral;

  function handleAction() {
    toast.action?.submit();
    if (toast.shouldCloseOnAction) onDismiss();
  }

  return (
    <div
      role="alert"
      className={`pointer-events-auto flex items-center gap-3 rounded-lg border bg-card p-4 shadow-lg ${variantClass}`}
    >
      <span className="flex-1 text-sm">{toast.message}</span>
      {toast.action && (
        <Button variant="ghost" size="sm" disabled={toast.action.disabled} onClick={handleAction}>
          {toast.action.label ?? toast.action.actionKey}
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="size-6"
        onClick={onDismiss}
        aria-label="Dismiss notification"
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}
