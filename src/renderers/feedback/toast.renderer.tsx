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
        <span
          role="button"
          tabIndex={0}
          onClick={() => model.action?.submit()}
          onKeyDown={() => {}}
          style={{ cursor: "pointer", textDecoration: "underline" }}
        >
          {model.action.label}
        </span>
      )}
    </Flex>
  );
}
