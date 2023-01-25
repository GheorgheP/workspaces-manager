// region WidgetId
import { WidgetConfig, WidgetType } from "./WidgetType";

declare const _widgetId: unique symbol;

export type WidgetId = string & { [_widgetId]: "WidgetId" };
// endregion

export interface Widget<T extends WidgetType = WidgetType> {
  id: WidgetId;
  type: T;
  config: WidgetConfig<T>;
}
