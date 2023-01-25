import { WorkspaceId } from "../../store/types/WorkspaceId";
import { FrameId } from "../../store/types/Frame";
import { WidgetId } from "../../store/types/Widget";
import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsActiveWidget, selectWidgetType } from "../../store/selectors";
import classNames from "classnames";
import { removeWidget, setActiveWidget } from "../../store/types/Actions";
import { widgetTypeTitle } from "../../store/types/WidgetType";

export interface FrameTabProps {
  workspaceId: WorkspaceId;
  frameId: FrameId;
  widgetId: WidgetId;
}

export const FrameTab = memo(
  ({ frameId, widgetId, workspaceId }: FrameTabProps) => {
    const dispatch = useDispatch();
    const isActive = useSelector(
      selectIsActiveWidget(workspaceId, frameId, widgetId)
    );
    const type = useSelector(selectWidgetType(workspaceId, widgetId));

    return type ? (
      <div
        className={classNames(
          "text-white font-bold text-[10px] px-[12px] py-[10px] flex gap-[8px] items-stretch",
          {
            "bg-shark": isActive,
            "border-balticSea": isActive,
          }
        )}
      >
        <span
          className={classNames(
            "cursor-pointer flex-grow uppercase flex items-center",
            {
              "opacity-30": !isActive,
            }
          )}
          onClick={() =>
            dispatch(setActiveWidget({ workspaceId, frameId, widgetId }))
          }
        >
          {widgetTypeTitle(type)}
        </span>
        <button
          type="button"
          onClick={() =>
            dispatch(removeWidget({ workspaceId, frameId, widgetId }))
          }
        >
          X
        </button>
      </div>
    ) : null;
  }
);
