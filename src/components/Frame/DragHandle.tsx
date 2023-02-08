import classNames from "classnames";
import { useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { WidgetId } from "../../store/types/Widget";
import { ItemType } from "../types";
import { moveWidget, toggleFullScreen } from "../../store/types/Actions";
import { getEmptyImage } from "react-dnd-html5-backend";
import { FrameId } from "../../store/types/Frame";

export interface DragHandleProps {
  id: FrameId;
}

export function DragHandle({ id }: DragHandleProps) {
  const dispatch = useDispatch();
  const dragHandleRef = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop<{ id: WidgetId }>({
    accept: ItemType.Tab,
    hover(w) {
      dispatch(
        moveWidget({
          widgetId: w.id,
          position: {
            type: "end",
            frameId: id,
          },
        })
      );
    },
  });
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: ItemType.Frame,
    item: {
      frameId: id,
      type: ItemType.Frame,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  drop(drag(dragHandleRef));

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  return (
    <div
      data-draggable-handle=""
      className={classNames("grow min-w-[15px]", {
        "cursor-grab": !isDragging,
        "cursor-grabbing": isDragging,
      })}
      ref={dragHandleRef}
      onDoubleClick={() => dispatch(toggleFullScreen(id))}
    />
  );
}
