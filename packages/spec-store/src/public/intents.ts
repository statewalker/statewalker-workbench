import { defineCommand } from "@statewalker/shared-commands";
import type { Spec, SpecPatch } from "./types.js";

export interface CreateSpecPayload {
  catalogId: string;
  spec: Spec;
  meta?: Record<string, unknown>;
}

export interface CreateSpecResult {
  specId: string;
}

export const CreateSpecCommand = defineCommand<CreateSpecPayload, CreateSpecResult>("spec:create", () => {});

export interface PatchSpecPayload {
  specId: string;
  patch: SpecPatch;
}

export const PatchSpecCommand = defineCommand<PatchSpecPayload, void>("spec:patch", () => {});
