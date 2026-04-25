import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { TreeNode, TreeView } from "@statewalker/workbench-views";
import { ChevronDown, ChevronRight, File, Folder, FolderOpen } from "lucide-react";

function TreeNodeItem({ node, model, depth }: { node: TreeNode; model: TreeView; depth: number }) {
  const hasChildren = node.children && node.children.length > 0;
  const expanded = model.isExpanded(node.key);
  const selected = model.selectedKeys.values().next().value === node.key;

  return (
    <div>
      <button
        type="button"
        className={`w-full flex items-center gap-1.5 px-2 py-1 text-sm rounded-md cursor-pointer hover:bg-accent ${selected ? "bg-accent font-medium" : ""}`}
        style={{ paddingLeft: `${depth * 1 + 0.5}rem` }}
        onClick={() => {
          if (hasChildren) {
            model.toggleExpand(node.key);
          }
          model.select(node.key);
        }}
      >
        {hasChildren ? (
          expanded ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          )
        ) : (
          <span className="w-4 shrink-0" />
        )}
        {hasChildren ? (
          expanded ? (
            <FolderOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
          ) : (
            <Folder className="h-4 w-4 shrink-0 text-muted-foreground" />
          )
        ) : (
          <File className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
        <span className="truncate">{node.label}</span>
      </button>
      {hasChildren && expanded && (
        <div>
          {node.children?.map((child) => (
            <TreeNodeItem key={child.key} node={child} model={model} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function TreeRenderer({ model }: { model: TreeView }) {
  useUpdates(model.onUpdate);

  return (
    <div className="p-2">
      {model.roots.map((root) => (
        <TreeNodeItem key={root.key} node={root} model={model} depth={0} />
      ))}
    </div>
  );
}
