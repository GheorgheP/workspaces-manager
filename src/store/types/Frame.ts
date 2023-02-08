import { WidgetId } from "./Widget";
import { v4 as uuid } from "uuid";

// region FrameId
declare const _frameId: unique symbol;

export type FrameId = string & { [_frameId]: "FrameId" };

export const newFrameId = (): FrameId => uuid() as FrameId;
// endregion

export interface Frame {
  id: FrameId;
  activeWidget: WidgetId;
  config: {
    width: number;
    height: number;
    x: number;
    y: number;
    order: number;
  };
}
