import { FrameId } from "../store/types/Frame";
import { WidgetId } from "../store/types/Widget";
import { Direction } from "../store/types/Direction";

export enum ItemType {
  Frame = "frame",
  Tab = "tab",
  Resize = "resize",
}

export interface ItemFrame {
  type: ItemType.Frame;
  frameId: FrameId;
}

export interface ItemTab {
  type: ItemType.Tab;
  widgetId: WidgetId;
}

export interface ItemResize {
  type: ItemType.Resize;
  frameId: FrameId;
  direction: Direction;
}

export type Item = ItemFrame | ItemTab | ItemResize;
