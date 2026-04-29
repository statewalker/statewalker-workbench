import { Checkbox, Flex, Text } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/workbench-react/hooks";
import { Icon } from "@statewalker/workbench-react/icons";
import type { TableView } from "@statewalker/workbench-views";

/**
 * Simple table renderer — avoids Spectrum's TableView virtualizer
 * which has known issues with React 19.
 */
export function TableRenderer({ model }: { model: TableView }) {
  useUpdates(model.onUpdate);
  const rows = model.sortedRows;
  const selectable = model.selectionMode !== "none";

  return (
    <Flex direction="column" width="100%" UNSAFE_style={{ overflow: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {selectable && (
              <th style={{ padding: "6px 8px", textAlign: "left", width: 32 }}>
                <Checkbox
                  isSelected={rows.length > 0 && model.selectedKeys.size === rows.length}
                  onChange={(checked) => {
                    if (checked) model.selectAll();
                    else model.selectedKeys = new Set();
                  }}
                  aria-label="Select all"
                />
              </th>
            )}
            {model.columns.map((col) => (
              <th
                key={col.key}
                style={{
                  padding: "6px 12px",
                  textAlign: "left",
                  cursor: col.sortable ? "pointer" : "default",
                  width: col.width,
                  fontWeight: 600,
                }}
                onClick={col.sortable ? () => model.sort(col.key) : undefined}
              >
                <Text UNSAFE_style={{ fontWeight: 600 }}>
                  {col.label}
                  {model.sortDescriptor?.column === col.key &&
                    (model.sortDescriptor.direction === "ascending" ? " ▲" : " ▼")}
                </Text>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const key = model.rowKey(row);
            const selected = model.selectedKeys.has(key);
            return (
              <tr
                key={key}
                style={{
                  background: selected ? "var(--spectrum-alias-highlight-selected)" : undefined,
                }}
              >
                {selectable && (
                  <td style={{ padding: "4px 8px" }}>
                    <Checkbox
                      isSelected={selected}
                      onChange={() => {
                        const next = new Set(model.selectedKeys);
                        if (selected) next.delete(key);
                        else next.add(key);
                        model.selectedKeys = next;
                      }}
                      aria-label={`Select row ${key}`}
                    />
                  </td>
                )}
                {model.columns.map((col) => {
                  const record = row as Record<string, unknown>;
                  const iconName = col.iconKey ? String(record[col.iconKey] ?? "") : "";
                  const iconColor = col.iconColorKey ? String(record[col.iconColorKey] ?? "") : "";
                  return (
                    <td key={col.key} style={{ padding: "4px 12px" }}>
                      <Flex direction="row" alignItems="center" gap="size-100">
                        {iconName && <Icon name={iconName} className={iconColor} />}
                        <Text>
                          {col.render
                            ? String(col.render(record[col.key], row) ?? "")
                            : String(record[col.key] ?? "")}
                        </Text>
                      </Flex>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </Flex>
  );
}
