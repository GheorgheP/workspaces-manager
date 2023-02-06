import { FrameId } from "../../store/types/Frame";
import { ComponentProps, forwardRef, memo, ReactElement } from "react";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { WorkspaceId } from "../../store/types/WorkspaceId";
import { setActiveFrame } from "../../store/types/Actions";
import { selectFrameZIndex } from "../../store/selectors";

export interface FrameWrapperProps extends ComponentProps<"div"> {
  workspaceId: WorkspaceId;
  frameId: FrameId;
}

export const Wrapper = memo(
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
          {props.children}
        </div>
      );
    }
  )
);
