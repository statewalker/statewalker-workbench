import { ActionButton, Flex, Text } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/shared-react/hooks";
import type { PaginationView } from "@statewalker/shared-views";

export function PaginationRenderer({ model }: { model: PaginationView }) {
  useUpdates(model.onUpdate);
  return (
    <Flex direction="row" gap="size-100" alignItems="center">
      <ActionButton
        isDisabled={!model.hasPrevious}
        onPress={() => model.previous()}
      >
        Previous
      </ActionButton>
      <Text>
        {model.page} / {model.totalPages}
      </Text>
      <ActionButton isDisabled={!model.hasNext} onPress={() => model.next()}>
        Next
      </ActionButton>
    </Flex>
  );
}
