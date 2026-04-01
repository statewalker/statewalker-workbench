import { View } from "@adobe/react-spectrum";
import { useUpdates } from "@repo/shared-react/hooks";
import type { JsonView } from "@repo/shared-views";

export function JsonRenderer({ model }: { model: JsonView }) {
  useUpdates(model.onUpdate);
  return (
    <View>
      {model.label && (
        <div style={{ fontWeight: "bold", marginBottom: 4 }}>{model.label}</div>
      )}
      <pre
        style={{
          margin: 0,
          padding: 8,
          overflow: "auto",
          fontSize: 12,
          fontFamily: "monospace",
          background: "var(--spectrum-gray-100)",
          borderRadius: 4,
        }}
      >
        {JSON.stringify(model.data, null, 2)}
      </pre>
    </View>
  );
}
