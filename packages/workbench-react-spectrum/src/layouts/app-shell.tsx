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
import type { ActionView, DialogView } from "@statewalker/workbench-views";
import {
  type ActivePanelView,
  type DockPanelView,
  getActivePanelView,
  getDialogStackView,
  getThemeView,
  getToolbarView,
  getTopMenuView,
  listenPanel,
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
import { DockProvider, panelsToTreeFromViews } from "./dock-context.js";
import { SpectrumDockLayout } from "./dock-layout.js";

// ─── Shared adapters ────────────────────────────────────

const ActivePanelCtx = createContext<ActivePanelView | null>(null);
export function useActivePanelView(): ActivePanelView | null {
  return useContext(ActivePanelCtx);
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

  const [panels, setPanels] = useState<DockPanelView[]>([]);
  useEffect(() => listenPanel(context, setPanels), [context]);
  const dialogs = useModelItems(dialogsModel);
  const toolbarActions = useModelItems(toolbarModel) as ActionView[];
  const menus = useModelItems(menuModel) as ActionView[];

  const tree = useMemo(() => panelsToTreeFromViews(panels), [panels]);
  const activePanelModel = getActivePanelView(context);

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
          <ActivePanelCtx.Provider value={activePanelModel}>
            <DockProvider initialLayout={tree}>
              <SpectrumDockLayout />
            </DockProvider>
          </ActivePanelCtx.Provider>
        </View>
        {toolbarActions.length > 0 && <SpectrumToolbar actions={toolbarActions} />}
        <SpectrumDialogOverlay dialog={topDialog} registry={registry} />
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
