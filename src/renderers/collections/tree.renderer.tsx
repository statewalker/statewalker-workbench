import { ActionButton, Flex, Text, View } from "@adobe/react-spectrum";
import { useUpdates } from "@repo/shared-react/hooks";
import type { TreeNode, TreeView as TreeViewType } from "@repo/shared-views";

function TreeNodeItem({
  node,
  model,
  depth,
}: {
  node: TreeNode;
  model: TreeViewType;
  depth: number;
}) {
  const isExpanded = model.isExpanded(node.key);
  const isSelected = model.isSelected(node.key);
  const hasChildren = node.children && node.children.length > 0;
  return (
    <div>
      <Flex
        direction="row"
        gap="size-50"
        alignItems="center"
        UNSAFE_style={{ paddingLeft: `${depth * 16}px` }}
      >
        {hasChildren ? (
          <ActionButton isQuiet onPress={() => model.toggleExpand(node.key)}>
            {isExpanded ? "\u25BC" : "\u25B6"}
          </ActionButton>
        ) : (
          <View width="size-300" />
        )}
        <Text
          UNSAFE_style={{
            fontWeight: isSelected ? "bold" : "normal",
            cursor: "pointer",
          }}
        >
          <span
            onClick={() => model.select(node.key)}
            onKeyDown={() => {}}
            role="treeitem"
            tabIndex={0}
          >
            {node.label}
          </span>
        </Text>
      </Flex>
      {hasChildren && isExpanded && (
        <div>
          {node.children?.map((child) => (
            <TreeNodeItem
              key={child.key}
              node={child}
              model={model}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function TreeRenderer({ model }: { model: TreeViewType }) {
  useUpdates(model.onUpdate);
  return (
    <div role="tree">
      {model.roots.map((root) => (
        <TreeNodeItem key={root.key} node={root} model={model} depth={0} />
      ))}
    </div>
  );
}
