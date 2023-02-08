import { FrameId } from "../../store/types/Frame";
import { useDispatch, useSelector } from "react-redux";
import {
  selectFrameWorkspaceId,
  selectIsFullScreen,
} from "../../store/selectors";
import { State } from "../../store/types/State";
import { toggleFullScreen } from "../../store/types/Actions";

export interface MaximizeButtonProps {
  id: FrameId;
}

export function MaximizeButton({ id }: MaximizeButtonProps) {
  const dispatch = useDispatch();
  const workspaceId = useSelector((s: State) => selectFrameWorkspaceId(s, id));
  const isFullscreen = useSelector((s: State) =>
    workspaceId ? selectIsFullScreen(s, workspaceId) : false
  );

  return (
    <button onClick={() => dispatch(toggleFullScreen(id))}>
      {isFullscreen ? "_" : "🗖"}
    </button>
  );
}
