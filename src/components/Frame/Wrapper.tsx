import { FrameId } from "../../store/types/Frame";
import { ReactElement } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveFrame } from "../../store/types/Actions";
import {
  selectFrameConfig,
  selectFrameWorkspaceId,
  selectIsFullScreen,
} from "../../store/selectors";
import { directions } from "../../store/types/Direction";
import { ResizeHandle } from "./ResizeHandle";
import { State } from "../../store/types/State";
import classNames from "classnames";

export interface FrameWrapperProps {
  id: FrameId;
  children: ReactElement;
}

export const Wrapper = ({
  id,
  children,
}: FrameWrapperProps): ReactElement | null => {
  const dispatch = useDispatch();
  const config = useSelector((s) => selectFrameConfig(s, id));
  const workspaceId = useSelector((s: State) => selectFrameWorkspaceId(s, id));
  const isFullScreen = useSelector((s: State) =>
    workspaceId ? selectIsFullScreen(s, workspaceId) : false
  );

  if (!config) return null;

  const x = (config.x * 100) / config.width;
  const y = (config.y * 100) / config.height;

  return (
    <div
      className={classNames("workspace-frame-wrapper absolute flex")}
      style={{
        zIndex: config.order,
        transform: isFullScreen ? undefined : `translate(${x}%, ${y}%)`,
        width: isFullScreen ? "100%" : `${config.width}%`,
        height: isFullScreen ? "100%" : `${config.height}%`,
      }}
      onMouseDown={() => dispatch(setActiveFrame(id))}
    >
      {children}
      {directions.map((direction) => (
        <ResizeHandle id={id} direction={direction} key={direction} />
      ))}
    </div>
  );
};
