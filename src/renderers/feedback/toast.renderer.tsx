import { Flex, Text } from "@adobe/react-spectrum";
import { useUpdates } from "@repo/shared-react/hooks";
import type { ToastView } from "@repo/shared-views";

export function ToastRenderer({ model }: { model: ToastView }) {
  useUpdates(model.onUpdate);
  return (
    <Flex
      direction="row"
      gap="size-100"
      alignItems="center"
      UNSAFE_style={{ padding: "8px 16px" }}
    >
      <Text>{model.message}</Text>
      {model.action && (
        <button
          type="button"
          onClick={() => model.action?.submit()}
          style={{
            cursor: "pointer",
            textDecoration: "underline",
            background: "none",
            border: "none",
            padding: 0,
          }}
        >
          {model.action.label}
        </button>
      )}
    </Flex>
  );
}
