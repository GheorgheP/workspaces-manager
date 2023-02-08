import { FrameId } from "../../store/types/Frame";
import classNames from "classnames";
import { useDrag } from "react-dnd";
import { ItemType } from "../types";
import { memo, useEffect } from "react";
import { getEmptyImage } from "react-dnd-html5-backend";

export interface ResizeHandleProps {
  id: FrameId;
  direction: "nw" | "n" | "ne" | "e" | "sw" | "s" | "se" | "w";
}

export const ResizeHandle = memo(({ id, direction }: ResizeHandleProps) => {
  const [, drag, preview] = useDrag({
    type: ItemType.Resize,
    item: {
      type: ItemType.Resize,
      frameId: id,
      direction,
    },
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  return (
    <div
      ref={drag}
      className={classNames(getResizeDirectionClass(direction), "absolute")}
    />
  );
});

function getResizeDirectionClass(direction: ResizeHandleProps["direction"]) {
  switch (direction) {
    case "nw":
      return "cursor-nw-resize w-2 h-2 top-0 left-0 z-20";
    case "n":
      return "cursor-n-resize w-full h-2 top-0 left-0 z-10";
    case "ne":
      return "cursor-ne-resize w-2 h-2 top-0 right-0 z-20";
    case "e":
      return "cursor-e-resize w-2 h-full top-0 right-0 z-10";
    case "sw":
      return "cursor-sw-resize w-2 h-2 bottom-0 left-0 z-20";
    case "s":
      return "cursor-s-resize w-full h-2 bottom-0 left-0 z-10";
    case "se":
      return "cursor-se-resize w-2 h-2 bottom-0 right-0 z-20";
    case "w":
      return "cursor-w-resize w-2 h-full top-0 left-0 z-10";
  }
}
