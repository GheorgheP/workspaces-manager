import { FrameId } from "../../store/types/Frame";
import classNames from "classnames";
import { useDrag } from "react-dnd";
import { ItemType } from "../types";
import { memo } from "react";

export interface ResizeHandleProps {
  id: FrameId;
  direction: "nw" | "n" | "ne" | "e" | "sw" | "s" | "se" | "w";
}

export const ResizeHandle = memo(({ id, direction }: ResizeHandleProps) => {
  const [, drag] = useDrag({
    type: ItemType.Resize,
    item: {
      frameId: id,
      direction,
    },
  });

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
      return "cursor-nw-resize w-4 h-4 top-0 left-0";
    case "n":
      return "cursor-n-resize w-full h-4 top-0 left-0";
    case "ne":
      return "cursor-ne-resize w-4 h-4 top-0 right-0";
    case "e":
      return "cursor-e-resize w-4 h-4 top-0 right-0";
    case "sw":
      return "cursor-sw-resize w-4 h-4 bottom-0 left-0";
    case "s":
      return "cursor-s-resize w-4 h-4 bottom-0 left-0";
    case "se":
      return "cursor-se-resize w-4 h-4 bottom-0 right-0";
    case "w":
      return "cursor-w-resize w-4 h-4 top-0 left-0";
  }
}
