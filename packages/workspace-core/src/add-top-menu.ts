import {
  ActionView,
  type ActionViewConfig,
  type MainMenu,
} from "@statewalker/workbench-views";

const settingsMenuOptions: ActionViewConfig = {
  key: "settings",
  label: "Settings",
  icon: "settings",
};

/**
 * Add an action to the shared "Settings" top-level menu. The menu container
 * is created on first use and removed when its last item is removed.
 * Returns a disposer that removes the item (and the container if it becomes
 * empty).
 */
export function addSettingsMenuItem(
  topMenu: MainMenu,
  item: ActionView | ActionViewConfig,
): () => void {
  let settings = topMenu
    .getAll()
    .find((m) => m.actionKey === settingsMenuOptions.key) as
    | ActionView
    | undefined;
  if (!settings) {
    settings = new ActionView(settingsMenuOptions);
    topMenu.add(settings);
  }
  const container = settings;
  const actionItem = item instanceof ActionView ? item : new ActionView(item);
  container.children = [...container.children, actionItem];
  container.notify();
  return () => {
    container.children = container.children.filter((c) => c !== actionItem);
    container.notify();
    if (container.children.length === 0) {
      topMenu.remove(container);
    }
  };
}
