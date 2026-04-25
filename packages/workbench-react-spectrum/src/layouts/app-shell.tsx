import {
  ActionButton,
  Content,
  Dialog,
  DialogContainer,
  Flex,
  Heading,
  Item,
  Menu,
  MenuTrigger,
  Text,
  View,
} from "@adobe/react-spectrum";
import { newAdapter } from "@statewalker/shared-adapters";
import {
  ComponentRegistryContext,
  ReactComponentRegistry,
} from "@statewalker/workbench-react/component-registry";
import type { ActionView, DialogView, ToastView } from "@statewalker/workbench-views";
import {
  getDialogStackView,
  getPanelManagerView,
  getThemeView,
  getToastStackView,
  getToolbarView,
  getTopMenuView,
  type PanelManagerView,
  type UIModelRegistry,
} from "@statewalker/workbench-views";
import {
  type ComponentType,
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DockProvider } from "./dock-context.js";
import { SpectrumDockLayout } from "./dock-layout.js";

// ─── Shared adapters ────────────────────────────────────

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

// ─── Theme hook (reads from ThemeView model) ───────────

export function useColorScheme() {
  // Fallback for components rendered outside AppShell
  return useContext(ColorSchemeCtx);
}

const ColorSchemeCtx = createContext<{
  colorScheme: "light" | "dark";
  toggle: () => void;
}>({ colorScheme: "dark", toggle: () => {} });

// ─── Model items hook ───────────────────────────────────

function useModelItems<T>(model: UIModelRegistry<T>): T[] {
  const [items, setItems] = useState<T[]>(model.getAll());
  useEffect(() => {
    setItems(model.getAll());
    return model.onUpdate(() => setItems(model.getAll()));
  }, [model]);
  return items;
}

// ─── AppShell ───────────────────────────────────────────

interface AppShellProps {
  context: Record<string, unknown>;
  wrapper?: ComponentType<{ children: ReactNode }>;
}

export function SpectrumAppShell({ context, wrapper: Wrapper }: AppShellProps) {
  const registry = useMemo(() => getComponentRegistry(context), [context]);

  const dialogsModel = getDialogStackView(context);
  const toolbarModel = getToolbarView(context);
  const menuModel = getTopMenuView(context);
  const panelManager = useMemo(() => getPanelManagerView(context), [context]);

  const dialogs = useModelItems(dialogsModel);
  const toolbarActions = useModelItems(toolbarModel) as ActionView[];
  const menus = useModelItems(menuModel) as ActionView[];

  // Theme state — driven by ThemeView model
  const themeModel = useMemo(() => getThemeView(context), [context]);
  const [colorScheme, setColorScheme] = useState<"light" | "dark">(() => themeModel.resolved);
  useEffect(() => {
    setColorScheme(themeModel.resolved);
    return themeModel.onUpdate(() => setColorScheme(themeModel.resolved));
  }, [themeModel]);
  const toggleTheme = () => themeModel.toggle();

  const topDialog = dialogs.length > 0 ? (dialogs[dialogs.length - 1] as DialogView) : undefined;

  const inner = (
    <ComponentRegistryContext.Provider value={registry}>
      <Flex direction="column" height="100%" width="100%">
        <SpectrumMenuBar menus={menus} />
        <View flex UNSAFE_style={{ overflow: "hidden" }}>
          <PanelManagerCtx.Provider value={panelManager}>
            <DockProvider panelManager={panelManager}>
              <SpectrumDockLayout />
            </DockProvider>
          </PanelManagerCtx.Provider>
        </View>
        {toolbarActions.length > 0 && <SpectrumToolbar actions={toolbarActions} />}
        <SpectrumDialogOverlay dialog={topDialog} registry={registry} />
        <SpectrumToastOverlay context={context} />
      </Flex>
    </ComponentRegistryContext.Provider>
  );

  return (
    <ColorSchemeCtx.Provider value={{ colorScheme, toggle: toggleTheme }}>
      {Wrapper ? <Wrapper>{inner}</Wrapper> : inner}
    </ColorSchemeCtx.Provider>
  );
}

// ─── Menu Bar ───────────────────────────────────────────

function SpectrumMenuBar({ menus }: { menus: ActionView[] }) {
  const { colorScheme, toggle } = useColorScheme();
  return (
    <Flex
      alignItems="center"
      gap="size-25"
      UNSAFE_style={{
        paddingInline: 8,
        minHeight: 36,
        borderBottom: "1px solid var(--spectrum-alias-border-color-mid, rgba(255,255,255,0.1))",
      }}
    >
      {menus.map((menu) => (
        <MenuTrigger key={menu.actionKey}>
          <ActionButton isQuiet>
            <Text>{menu.label ?? menu.actionKey}</Text>
          </ActionButton>
          <Menu
            onAction={(key) => {
              const item = menu.children.find((c) => c.actionKey === key);
              item?.submit();
            }}
          >
            {menu.children.map((item) => (
              <Item key={item.actionKey}>{item.label ?? item.actionKey}</Item>
            ))}
          </Menu>
        </MenuTrigger>
      ))}
      <View flex />
      <ActionButton isQuiet onPress={toggle} aria-label="Toggle theme">
        <Text>{colorScheme === "dark" ? "☀" : "🌙"}</Text>
      </ActionButton>
    </Flex>
  );
}

// ─── Toolbar ────────────────────────────────────────────

function SpectrumToolbar({ actions }: { actions: ActionView[] }) {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      gap="size-50"
      UNSAFE_style={{
        paddingInline: 8,
        paddingBlock: 4,
        borderTop: "1px solid var(--spectrum-alias-border-color-mid, rgba(255,255,255,0.1))",
      }}
    >
      {actions.map((action) => (
        <ActionButton
          key={action.actionKey}
          isQuiet
          isDisabled={action.disabled}
          onPress={() => action.submit()}
        >
          <Text>{action.label ?? action.actionKey}</Text>
        </ActionButton>
      ))}
    </Flex>
  );
}

// ─── Dialog Overlay ─────────────────────────────────────

function SpectrumDialogOverlay({
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
    <DialogContainer onDismiss={() => {}}>
      <Dialog>
        <Heading>{typeof dialog.header === "string" ? dialog.header : "Dialog"}</Heading>
        <Content>
          <DialogComponent model={dialog} />
        </Content>
      </Dialog>
    </DialogContainer>
  );
}

// ─── Toast Overlay ──────────────────────────────────────

const toastBorderColor: Record<string, string> = {
  positive: "var(--spectrum-global-color-green-500, #2d9d5c)",
  negative: "var(--spectrum-global-color-red-500, #d7373f)",
  info: "var(--spectrum-global-color-blue-500, #2680eb)",
  neutral: "var(--spectrum-alias-border-color-mid, rgba(255,255,255,0.2))",
};

function SpectrumToastOverlay({ context }: { context: Record<string, unknown> }) {
  const stack = useMemo(() => getToastStackView(context), [context]);
  const toasts = useModelItems(stack);
  if (toasts.length === 0) return null;
  return (
    <View
      position="fixed"
      bottom="size-200"
      right="size-200"
      UNSAFE_style={{ zIndex: 50, pointerEvents: "none" }}
    >
      <Flex direction="column-reverse" gap="size-100">
        {toasts.map((toast) => (
          <SpectrumToastCard
            key={toast.key}
            toast={toast}
            onDismiss={() => stack.remove(toast)}
          />
        ))}
      </Flex>
    </View>
  );
}

function SpectrumToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastView;
  onDismiss: () => void;
}) {
  const [, force] = useState({});
  useEffect(() => toast.onUpdate(() => force({})), [toast]);

  useEffect(() => {
    if (toast.timeout <= 0) return;
    const id = setTimeout(onDismiss, toast.timeout);
    return () => clearTimeout(id);
  }, [toast.timeout, onDismiss]);

  function handleAction() {
    toast.action?.submit();
    if (toast.shouldCloseOnAction) onDismiss();
  }

  return (
    <div
      role="alert"
      style={{
        pointerEvents: "auto",
        boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
        borderLeft: `4px solid ${toastBorderColor[toast.variant] ?? toastBorderColor.neutral}`,
      }}
    >
      <View
        borderColor="default"
        borderWidth="thin"
        borderRadius="medium"
        backgroundColor="gray-100"
        padding="size-200"
      >
        <Flex alignItems="center" gap="size-200">
          <View flex>
            <Text>{toast.message}</Text>
          </View>
          {toast.action && (
            <ActionButton
              isQuiet
              isDisabled={toast.action.disabled}
              onPress={handleAction}
            >
              <Text>{toast.action.label ?? toast.action.actionKey}</Text>
            </ActionButton>
          )}
          <ActionButton isQuiet onPress={onDismiss} aria-label="Dismiss notification">
            <Text>✕</Text>
          </ActionButton>
        </Flex>
      </View>
    </div>
  );
}
