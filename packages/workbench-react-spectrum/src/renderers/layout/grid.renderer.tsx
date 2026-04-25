import { Grid } from "@adobe/react-spectrum";
import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { GridView } from "@statewalker/workbench-views";
import { RenderModel } from "../_shared/render-slot.js";

export function GridRenderer({ model }: { model: GridView }) {
  useUpdates(model.onUpdate);
  return (
    <Grid
      columns={model.columns}
      rows={model.rows}
      areas={model.areas.length > 0 ? model.areas : undefined}
      gap={model.gap}
      columnGap={model.columnGap}
      rowGap={model.rowGap}
    >
      {model.children.map((child) => (
        <RenderModel key={child.key} model={child} />
      ))}
    </Grid>
  );
}
