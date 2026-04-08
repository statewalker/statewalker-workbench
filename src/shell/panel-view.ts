import { newAdapter } from "@repo/shared/adapters";
import {
  createModelPoint,
  UIModelRegistry,
} from "../core/ui-model-registry.js";
import { ViewModel } from "../core/view-model.js";

export class DockPanelView extends ViewModel {
  label: string;
  icon: string | undefined;
  content: ViewModel;
  area: string;
  closable: boolean;
  onClose?: () => void;

  constructor(options: {
    label: string;
    icon?: string;
    content: ViewModel;
    key?: string;
    area?: string;
    closable?: boolean;
    onClose?: () => void;
  }) {
    super({ key: options.key });
    this.label = options.label;
    this.icon = options.icon;
    this.content = options.content;
    this.area = options.area ?? "center";
    this.closable = options.closable ?? false;
    this.onClose = options.onClose;
  }
}

const [getPanelRegistry] = newAdapter<UIModelRegistry<DockPanelView>>(
  "aspect:panel-registry",
  () => new UIModelRegistry<DockPanelView>(),
);

export const [publishPanel, listenPanel] =
  createModelPoint<DockPanelView>(getPanelRegistry);
