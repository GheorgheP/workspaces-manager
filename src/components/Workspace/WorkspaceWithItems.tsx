import { useDispatch, useSelector } from "react-redux";
import { State } from "../../store/types/State";
import { Wrapper } from "../Frame/Wrapper";
import { WorkspaceId } from "../../store/types/WorkspaceId";
import { Frame } from "../Frame/Frame";
import { useDrop, XYCoord } from "react-dnd";
import { ItemType } from "../types";
import { selectWorkspaceFramesIds } from "../../store/selectors";
import { moveFrame } from "../../store/types/Actions";
import { FrameId } from "../../store/types/Frame";
import { useRef } from "react";

export interface WorkspaceWithItemsProps {
  id: WorkspaceId;
}
export function WorkspaceWithItems({ id }: WorkspaceWithItemsProps) {
  const dispatch = useDispatch();
  const frames = useSelector((s: State) => selectWorkspaceFramesIds(s, id));
  const prevOffset = useRef<XYCoord>({ x: 0, y: 0 });

  const [, drop] = useDrop<{ frameId: FrameId; type: ItemType }>({
    accept: [ItemType.Tab, ItemType.Frame],
    hover(item, monitor) {
      const client = monitor.getDifferenceFromInitialOffset();
      if (item.type !== ItemType.Frame || !client) return;

      dispatch(
        moveFrame({
          frameId: item.frameId,
          x: client.x - prevOffset.current.x,
          y: client.y - prevOffset.current.y,
        })
      );

      prevOffset.current = client;
    },
    drop(item) {
      if (item.type === ItemType.Frame) {
        prevOffset.current = { x: 0, y: 0 };
      }
    },
  });

  return (
    <div className={"bg-woodsmoke relative"} ref={drop}>
      {frames.map((frameId) => (
        <Wrapper id={frameId} key={frameId}>
          <Frame id={frameId} />
        </Wrapper>
      ))}
    </div>
  );
}
