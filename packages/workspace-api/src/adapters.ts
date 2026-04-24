import { newAdapter } from "@statewalker/shared-adapters";
import type { Workspace } from "./types.ts";

export const [getWorkspace, setWorkspace, removeWorkspace] =
  newAdapter<Workspace>("workspace:workspace");
