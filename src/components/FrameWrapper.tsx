import { FrameId } from "../store/types/Frame";
import { ComponentProps, forwardRef, memo, ReactElement } from "react";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { WorkspaceId } from "../store/types/WorkspaceId";
import {
  removeFrame,
  setActiveFrame,
  updateWidgetConfig,
} from "../store/types/Actions";
import { WidgetComponent } from "./Widgets";
import { selectActiveWidget, selectFrameZIndex } from "../store/selectors";
import { Tabs } from "./Tabs";

export interface FrameWrapperProps extends ComponentProps<"div"> {
  workspaceId: WorkspaceId;
  frameId: FrameId;
}

export const FrameWrapper = memo(
  forwardRef<HTMLDivElement, FrameWrapperProps>(
    (
      { frameId, workspaceId, ...props }: FrameWrapperProps,
      ref
    ): ReactElement => {
      const dispatch = useDispatch();
      const zIndex = useSelector(selectFrameZIndex(workspaceId, frameId));

      return (
        <div
          {...props}
          ref={ref}
          className={classNames("workspace-frame-wrapper", props.className)}
          style={{ ...props.style, zIndex }}
          onMouseDown={(e) => {
            dispatch(setActiveFrame({ workspaceId, frameId }));
            props?.onMouseDown?.(e);
          }}
        >
          <Frame workspaceId={workspaceId} frameId={frameId} />
          {props.children}
        </div>
      );
    }
  )
);

export interface FrameProps {
  workspaceId: WorkspaceId;
  frameId: FrameId;
}

const Frame = memo(({ frameId, workspaceId }: FrameProps): ReactElement => {
  const dispatch = useDispatch();
  return (
    <div className="w-[100%] flex flex-col">
      <div className="bg-bunker flex rounded-t-[8px]">
        <Tabs workspaceId={workspaceId} frameId={frameId} />
        <div data-draggable-handle="" className="grow cursor-grab" />
        <button onClick={() => dispatch(removeFrame({ workspaceId, frameId }))}>
          X
        </button>
      </div>
      <div className="flex bg-shark flex-grow w-[100%] shadow-[0_0_0_1px_rgba(40,43,48,1)_inset]">
        <FrameContent workspaceId={workspaceId} frameId={frameId} />
      </div>
    </div>
  );
});

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
