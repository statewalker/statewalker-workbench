import {
  Cell,
  Column,
  Row,
  TableView as SpectrumTableView,
  TableBody,
  TableHeader,
} from "@adobe/react-spectrum";
import { useUpdates } from "@repo/shared-react/hooks";
import type { TableView } from "@repo/shared-views";

export function TableRenderer({ model }: { model: TableView }) {
  useUpdates(model.onUpdate);
  return (
    <SpectrumTableView
      selectionMode={model.selectionMode}
      selectedKeys={model.selectedKeys}
      density={model.density}
      overflowMode={model.overflowMode}
      sortDescriptor={model.sortDescriptor}
      onSortChange={(desc) => {
        if (desc.column) {
          model.sort(String(desc.column));
        }
      }}
      onSelectionChange={(keys) => {
        if (keys === "all") {
          model.selectAll();
        } else {
          model.selectedKeys = new Set([...keys].map(String));
        }
      }}
    >
      <TableHeader>
        {model.columns.map((col) => (
          <Column
            key={col.key}
            allowsSorting={col.sortable}
            width={col.width as any}
          >
            {col.label}
          </Column>
        ))}
      </TableHeader>
      <TableBody>
        {model.sortedRows.map((row) => (
          <Row key={model.rowKey(row)}>
            {model.columns.map((col) => (
              <Cell key={col.key}>
                {col.render
                  ? String(
                      col.render(
                        (row as Record<string, unknown>)[col.key],
                        row,
                      ) ?? "",
                    )
                  : String((row as Record<string, unknown>)[col.key] ?? "")}
              </Cell>
            ))}
          </Row>
        ))}
      </TableBody>
    </SpectrumTableView>
  );
}
