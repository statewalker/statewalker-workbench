import type { ReactComponentRegistry } from "@statewalker/workbench-react/component-registry";
import { ModelPickerView } from "@statewalker/workbench-views/ai-models";
import { ModelPickerRenderer } from "./renderers/ai-models/model-picker.renderer.js";

export function initAiModelViews(registry: ReactComponentRegistry): () => void {
  return registry.register(ModelPickerView, ModelPickerRenderer);
}
