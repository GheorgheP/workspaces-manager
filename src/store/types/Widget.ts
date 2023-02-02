import { WidgetConfig, WidgetType } from "./WidgetType";
import { v4 as uuid } from "uuid";

// region WidgetId
declare const _widgetId: unique symbol;

export type WidgetId = string & { [_widgetId]: "WidgetId" };

export const newWidgetId = (): WidgetId => uuid() as WidgetId;
// endregion

export interface WidgetBase<T extends WidgetType = WidgetType> {
  type: T;
  config: WidgetConfig<T>;
}

export interface Widget<T extends WidgetType = WidgetType>
  extends WidgetBase<T> {
  id: WidgetId;
}
