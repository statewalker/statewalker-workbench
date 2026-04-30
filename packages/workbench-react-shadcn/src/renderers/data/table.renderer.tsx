import { useUpdates } from "@statewalker/workbench-react/hooks";
import { Icon } from "@statewalker/workbench-react/icons";
import type { TableView as TableViewType } from "@statewalker/workbench-views";

export function TableRenderer({ model }: { model: TableViewType }) {
  useUpdates(model.onUpdate);

  const rows = model.sortedRows;
  const selectable = model.selectionMode !== "none";

  return (
    <div className="w-full overflow-auto">
      <table className="w-full caption-bottom text-sm">
        <thead className="border-b border-border">
          <tr>
            {selectable && (
              <th className="h-10 px-2 text-left align-middle w-10">
                <input
                  type="checkbox"
                  className="cursor-pointer"
                  checked={rows.length > 0 && model.selectedKeys.size === rows.length}
                  onChange={() => {
                    if (model.selectedKeys.size === rows.length) {
                      model.clearSelection();
                    } else {
                      model.selectAll();
                    }
                  }}
                />
              </th>
            )}
            {model.columns.map((col) => (
              <th
                key={col.key}
                className={`h-10 px-2 text-left align-middle font-medium text-muted-foreground ${
                  col.sortable ? "cursor-pointer hover:text-foreground select-none" : ""
                }`}
                style={col.width ? { width: col.width } : undefined}
                onClick={() => {
                  if (!col.sortable) return;
                  // Always update the sort descriptor; consumers
                  // observe via `onSort` (a change notifier).
                  model.sort(col.key);
                }}
              >
                <span className="flex items-center gap-1">
                  {col.label}
                  {model.sortDescriptor?.column === col.key && (
                    <span className="text-xs">
                      {model.sortDescriptor?.direction === "ascending" ? "▲" : "▼"}
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const key = model.rowKey(row);
            const record = row as Record<string, unknown>;
            return (
              <tr
                key={key}
                className={`border-b border-border transition-colors hover:bg-muted/50 cursor-pointer ${
                  model.isSelected(key) ? "bg-muted" : ""
                }`}
                onClick={() => model.activateRow(key)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    model.activateRow(key);
                  }
                }}
                tabIndex={0}
              >
                {selectable && (
                  <td className="px-2 align-middle">
                    <input
                      type="checkbox"
                      className="cursor-pointer"
                      checked={model.isSelected(key)}
                      onChange={() => model.toggleSelection(key)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                )}
                {model.columns.map((col) => {
                  const iconName = col.iconKey ? String(record[col.iconKey] ?? "") : "";
                  const iconColor = col.iconColorKey ? String(record[col.iconColorKey] ?? "") : "";
                  return (
                    <td key={col.key} className="px-2 py-2 align-middle">
                      <span className="flex items-center gap-2">
                        {iconName && (
                          <Icon name={iconName} className={`size-4 shrink-0 ${iconColor}`} />
                        )}
                        <span className="truncate">
                          {col.render
                            ? (col.render(record[col.key], row) as React.ReactNode)
                            : String(record[col.key] ?? "")}
                        </span>
                      </span>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {rows.length === 0 && (
        <div className="py-6 text-center text-sm text-muted-foreground">No data</div>
      )}
    </div>
  );
}
