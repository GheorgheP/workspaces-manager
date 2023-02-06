import { WorkspaceId } from "../../store/types/WorkspaceId";
import { FrameId } from "../../store/types/Frame";
import { memo, ReactElement } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tabs } from "../Tabs";
import {
  moveWidget,
  removeFrame,
  updateWidgetConfig,
} from "../../store/types/Actions";
import { selectActiveWidget } from "../../store/selectors";
import { WidgetComponent } from "../Widgets";
import { useDrop } from "react-dnd";
import { ItemType } from "../types";
import { WidgetId } from "../../store/types/Widget";

export interface FrameProps {
  workspaceId: WorkspaceId;
  frameId: FrameId;
}

export const Frame = memo(
  ({ frameId, workspaceId }: FrameProps): ReactElement => {
    const dispatch = useDispatch();

    const [, drop] = useDrop<{ id: WidgetId }>({
      accept: ItemType.Tab,
      hover({ id }) {
        dispatch(
          moveWidget({
            widgetId: id,
            workspaceId,
            position: {
              type: "end",
              frameId,
            },
          })
        );
      },
    });

    return (
      <div className="w-[100%] flex flex-col">
        <div className="bg-bunker flex rounded-t-[8px]">
          <Tabs workspaceId={workspaceId} frameId={frameId} />
          <div
            data-draggable-handle=""
            className="grow cursor-grab"
            ref={drop}
          />
          <button
            onClick={() => dispatch(removeFrame({ workspaceId, frameId }))}
          >
            X
          </button>
        </div>
        <div className="flex bg-shark flex-grow w-[100%] shadow-[0_0_0_1px_rgba(40,43,48,1)_inset]">
          <FrameContent workspaceId={workspaceId} frameId={frameId} />
        </div>
      </div>
    );
  }
);

interface FrameContentProps {
  workspaceId: WorkspaceId;
  frameId: FrameId;
}
function FrameContent({ workspaceId, frameId }: FrameContentProps) {
  const w = useSelector(selectActiveWidget(workspaceId, frameId));
  const dispatch = useDispatch();

  if (!w) {
    return null;
  }

  return (
    <WidgetComponent
      type={w.type}
      config={w.config}
      onChange={(config) => {
        dispatch(updateWidgetConfig({ workspaceId, widgetId: w.id, config }));
      }}
    />
  );
}
