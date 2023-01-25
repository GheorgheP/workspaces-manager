import { WidgetId } from "./Widget";

// region FrameId
declare const _frameId: unique symbol;

export type FrameId = string & { [_frameId]: "FrameId" };
// endregion

export interface Frame {
  id: FrameId;
  order: number;
  widgets: Record<WidgetId, { id: WidgetId; order: number }>;
  activeWidget: WidgetId;
  config: {
    width: number;
    height: number;
    x: number;
    y: number;
  };
}
