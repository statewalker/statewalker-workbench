import { newAdapter } from "@repo/shared/adapters";
import {
  createModelPoint,
  UIModelRegistry,
} from "../core/ui-model-registry.js";
import type { CommandModel } from "./command-model.js";

export class CommandRegistryModel extends UIModelRegistry<CommandModel> {
  findByKey(key: string): CommandModel | undefined {
    return this.getAll().find((cmd) => cmd.key === key);
  }

  execute(key: string): boolean {
    const cmd = this.findByKey(key);
    if (cmd?.isEnabled()) {
      cmd.execute();
      return true;
    }
    return false;
  }
}

export const [getCommandRegistryModel] = newAdapter<CommandRegistryModel>(
  "aspect:commands",
  () => new CommandRegistryModel(),
);

export const [publishCommand, listenCommand] = createModelPoint<CommandModel>(
  getCommandRegistryModel,
);
