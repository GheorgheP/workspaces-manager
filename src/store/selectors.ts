import { WorkspaceId } from "./types/WorkspaceId";
import { FrameId } from "./types/Frame";
import { isReady, State } from "./types/State";
import { Widget, WidgetId } from "./types/Widget";
import { WidgetType } from "./types/WidgetType";
import { createSelector } from "reselect";

export const selectFrameZIndex =
  (workspaceId: WorkspaceId, frameId: FrameId) =>
  (s: State): number | undefined => {
    switch (s.type) {
      case "Loading":
      case "LoadError":
        return undefined;
      case "Ready":
        return s.payload.workspaces[workspaceId]?.frames[frameId]?.order;
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

export const selectFrameWidgetsIds = createSelector(
  [
    (s: State) => (isReady(s) ? s.payload.workspaces : undefined),
    (s: State, workspaceId: WorkspaceId) => workspaceId,
    (s: State, _: WorkspaceId, frameId: FrameId) => frameId,
  ],
  (workspaces, workspaceId, frameId): WidgetId[] => {
    if (!workspaces) {
      return [];
    }

    return (
      Object.values(workspaces[workspaceId]?.widgets ?? {})
        .filter((w): w is Widget => !!w && w.frameId === frameId)
        .map((w) => w.id) ?? []
    );
  }
);

export const selectTabOrder = createSelector(
  [
    (s: State) => (isReady(s) ? s.payload.workspaces : undefined),
    (s: State, workspaceId: WorkspaceId) => workspaceId,
    (s: State, _: WorkspaceId, widgetId: WidgetId) => widgetId,
  ],
  (workspaces, workspaceId, widgetId): number | undefined => {
    if (!workspaces) {
      return undefined;
    }
    const order = workspaces[workspaceId]?.widgets[widgetId]?.order;

    return order ? Math.trunc(order * 1000000000) : undefined;
  }
);
