import { useUpdates } from "@statewalker/workbench-react/hooks";
import type { CardView as CardViewType } from "@statewalker/workbench-views";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/index.js";
import { RenderModel } from "../_shared/render-slot.js";
import { ActionButton } from "../actions/action-button.renderer.js";

export function CardRenderer({ model }: { model: CardViewType }) {
  useUpdates(model.onUpdate);

  const hasFooter = model.footer !== undefined || model.actions.length > 0;

  return (
    <Card>
      {model.header && (
        <CardHeader>
          <CardTitle>
            {typeof model.header === "string" ? model.header : <RenderModel model={model.header} />}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>
        {model.children.map((child) => (
          <RenderModel key={child.key} model={child} />
        ))}
      </CardContent>
      {hasFooter && (
        <CardFooter>
          {model.footer &&
            (typeof model.footer === "string" ? (
              model.footer
            ) : (
              <RenderModel model={model.footer} />
            ))}
          {model.actions.length > 0 && (
            <div className="flex gap-2 ml-auto">
              {model.actions.map((action) => (
                <ActionButton key={action.actionKey} action={action} />
              ))}
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
