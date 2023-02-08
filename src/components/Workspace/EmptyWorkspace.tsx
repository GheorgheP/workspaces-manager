import { useDispatch, useSelector } from "react-redux";
import { State } from "../../store/types/State";
import { WidgetType, widgetTypeTitle } from "../../store/types/WidgetType";
import { useState } from "react";
import { WorkspaceId } from "../../store/types/WorkspaceId";
import { fillEmptyWorkspace } from "../../store/types/Actions";

export function EmptyWorkspace({ id }: { id: WorkspaceId }) {
  const dispatch = useDispatch();
  const widgetTypes = useSelector((s: State) => s.payload.widgetTypes);
  const [widgets, setWidgets] = useState<WidgetType[]>([]);

  return (
    <div className={"bg-woodsmoke"}>
      <div className="flex flex-col gap-[10px] pl-[20px] pt-[20px]">
        {widgetTypes.map((widgetType) => (
          <label className="text-white" key={widgetType}>
            <input
              checked={widgets.includes(widgetType)}
              type={"checkbox"}
              key={widgetType}
              onChange={() =>
                setWidgets((widgets) =>
                  widgets.includes(widgetType)
                    ? widgets.filter((w) => w !== widgetType)
                    : [...widgets, widgetType]
                )
              }
            />
            {widgetTypeTitle(widgetType)}
          </label>
        ))}
        <div>
          <button
            type={"button"}
            onClick={() =>
              dispatch(fillEmptyWorkspace({ workspaceId: id, widgets }))
            }
          >
            Add widgets
          </button>
        </div>
      </div>
    </div>
  );
}
