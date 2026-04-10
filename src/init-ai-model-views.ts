import type { ReactComponentRegistry } from "@repo/shared-react/component-registry";
import { ModelPickerView } from "@repo/shared-views/ai-models";
import { ModelPickerRenderer } from "./renderers/ai-models/model-picker.renderer.js";

export function initAiModelViews(registry: ReactComponentRegistry): () => void {
  return registry.register(ModelPickerView, ModelPickerRenderer);
}
