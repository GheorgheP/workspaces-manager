import { FrameId } from "../../store/types/Frame";
import { ReactElement } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveFrame } from "../../store/types/Actions";
import { selectFrameConfig } from "../../store/selectors";
import { directions } from "../../store/types/Direction";
import { ResizeHandle } from "./ResizeHandle";

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

  if (!config) return null;

  return (
    <div
      className={"workspace-frame-wrapper absolute flex"}
      style={{
        zIndex: config.order,
        transform: `translate(${config.x}px, ${config.y}px)`,
        width: config.width,
        height: config.height,
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
