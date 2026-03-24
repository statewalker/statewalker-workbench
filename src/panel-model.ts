import { ViewModel } from "./view-model.js";

export class PanelModel extends ViewModel {
  label: string;
  icon: string | undefined;
  content: ViewModel;
  area: string;

  constructor(options: {
    label: string;
    icon?: string;
    content: ViewModel;
    key?: string;
    area?: string;
  }) {
    super({ key: options.key });
    this.label = options.label;
    this.icon = options.icon;
    this.content = options.content;
    this.area = options.area ?? "center";
  }
}
