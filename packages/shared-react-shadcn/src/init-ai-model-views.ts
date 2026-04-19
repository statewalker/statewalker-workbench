import type { ReactComponentRegistry } from "@statewalker/shared-react/component-registry";
import { ModelPickerView } from "@statewalker/shared-views/ai-models";
import { ModelPickerRenderer } from "./renderers/ai-models/model-picker.renderer.js";

export function initAiModelViews(registry: ReactComponentRegistry): () => void {
  return registry.register(ModelPickerView, ModelPickerRenderer);
}
