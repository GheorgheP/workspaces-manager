import { WorkspaceId } from "./types/WorkspaceId";
import { FrameId } from "./types/Frame";
import { isReady, State } from "./types/State";
import { WidgetId } from "./types/Widget";
import { WidgetType } from "./types/WidgetType";

export const selectFrameZIndex =
  (workspaceId: WorkspaceId, frameId: FrameId) =>
  (s: State): number | undefined => {
    switch (s.type) {
      case "Loading":
      case "LoadError":
        return undefined;
      case "Ready":
        const order = s.payload.workspaces[workspaceId]?.frames[frameId]?.order;
        return order ? MAX_Z_INDEX - Math.trunc(order * 1000000000) : undefined;
    }
  };

export const selectActiveWidgetId =
  (workspaceId: WorkspaceId, frameId: FrameId) => (s: State) =>
    isReady(s)
      ? s.payload.workspaces[workspaceId]?.frames[frameId]?.activeWidget
      : undefined;

export const selectWidget =
  (workspaceId: WorkspaceId, widgetId: WidgetId) => (s: State) =>
    isReady(s)
      ? s.payload.workspaces[workspaceId]?.widgets[widgetId]
      : undefined;

export const selectActiveWidget =
  (workspaceId: WorkspaceId, frameId: FrameId) => (s: State) => {
    const widgetId = selectActiveWidgetId(workspaceId, frameId)(s);
    return widgetId ? selectWidget(workspaceId, widgetId)(s) : undefined;
  };

export const selectIsActiveWidget =
  (workspaceId: WorkspaceId, frameId: FrameId, widgetId: WidgetId) =>
  (s: State): boolean => {
    const activeWidgetId = selectActiveWidgetId(workspaceId, frameId)(s);
    return activeWidgetId === widgetId;
  };

export const selectWidgetType =
  (workspaceId: WorkspaceId, widgetId: WidgetId) =>
  (s: State): WidgetType | undefined => {
    return selectWidget(workspaceId, widgetId)(s)?.type;
  };

// Technically CSS doesn't have any limitations to the z-index value, but
// practically, there seems to be a limitation from browsers to int32
// https://stackoverflow.com/questions/491052/minimum-and-maximum-value-of-z-index
const MAX_Z_INDEX = 2147483647;
