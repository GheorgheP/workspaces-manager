import { useDispatch, useSelector } from "react-redux";
import { State } from "../../store/types/State";
import { Wrapper } from "../Frame/Wrapper";
import { WorkspaceId } from "../../store/types/WorkspaceId";
import { Frame } from "../Frame/Frame";
import { useDrop, XYCoord } from "react-dnd";
import { Item, ItemFrame, ItemResize, ItemType } from "../types";
import { selectWorkspaceFramesIds } from "../../store/selectors";
import { moveFrame, resizeFrame } from "../../store/types/Actions";
import { useEffect, useRef } from "react";
import { unreachable } from "../../utils/expcetions";

export interface WorkspaceWithItemsProps {
  id: WorkspaceId;
}
export function WorkspaceWithItems({ id }: WorkspaceWithItemsProps) {
  const dispatch = useDispatch();
  const frames = useSelector((s: State) => selectWorkspaceFramesIds(s, id));
  const prevOffset = useRef<XYCoord>({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<DOMRect | null>(null);

  useEffect(() => {
    sizeRef.current = ref.current?.getBoundingClientRect() || null;
  });

  const [, drop] = useDrop<Item>({
    accept: [ItemType.Tab, ItemType.Frame, ItemType.Resize],
    hover(item, monitor) {
      const client = monitor.getDifferenceFromInitialOffset();

      if (!client || !sizeRef.current) return;

      const prev = { ...prevOffset.current };
      prevOffset.current = client;

      switch (item.type) {
        case ItemType.Frame:
          return handleFrameMove(item, client, prev, sizeRef.current);
        case ItemType.Resize: {
          return handleResizeMove(item, client, prev, sizeRef.current);
        }
        case ItemType.Tab:
          return;
        default:
          return unreachable(item);
      }

      function handleFrameMove(
        item: ItemFrame,
        client: XYCoord,
        prevClient: XYCoord,
        size: DOMRect
      ) {
        const cWidth = size.width;
        const cHeight = size.height;
        const xDiff = client.x - prevClient.x;
        const yDiff = client.y - prevClient.y;

        dispatch(
          moveFrame({
            frameId: item.frameId,
            x: (xDiff * 100) / cWidth,
            y: (yDiff * 100) / cHeight,
            pxSize: 100 / cWidth,
          })
        );
      }

      function handleResizeMove(
        item: ItemResize,
        client: XYCoord,
        prevClient: XYCoord,
        size: DOMRect
      ) {
        const cWidth = size.width;
        const cHeight = size.height;
        const xDiff = client.x - prevClient.x;
        const yDiff = client.y - prevClient.y;

        dispatch(
          resizeFrame({
            frameId: item.frameId,
            width: (xDiff * 100) / cWidth,
            height: (yDiff * 100) / cHeight,
            direction: item.direction,
            pxSize: 100 / cWidth,
          })
        );
      }
    },
    drop() {
      prevOffset.current = { x: 0, y: 0 };
    },
  });
  drop(ref);

  return (
    <div className={"bg-woodsmoke relative overflow-x-hidden"} ref={ref}>
      {frames.map((frameId) => (
        <Wrapper id={frameId} key={frameId}>
          <Frame id={frameId} />
        </Wrapper>
      ))}
    </div>
  );
}
