import { WorkspaceId } from "./types/WorkspaceId";
import { Frame, FrameId } from "./types/Frame";
import { isReady, State } from "./types/State";
import { Widget, WidgetId } from "./types/Widget";
import { WidgetType } from "./types/WidgetType";
import { createSelector } from "reselect";

export const selectWorkspaceFramesIds = createSelector(
  [
    (state: State) => (isReady(state) ? state.payload.workspaces : undefined),
    (state, workspaceId: WorkspaceId) => workspaceId,
  ],
  (workspaces, workspaceId): FrameId[] => {
    if (!workspaces) {
      return [];
    }
    const workspace = workspaces[workspaceId];
    if (!workspace) {
      return [];
    }

    return Object.values(workspace.frames).map(({ id }) => id);
  }
);

export const selectFrameConfig = createSelector(
  [
    (state: State) => (isReady(state) ? state.payload.workspaces : undefined),
    (_, id: FrameId) => id,
  ],
  (workspaces, id): Frame["config"] | undefined => {
    if (!workspaces) {
      return undefined;
    }
    const workspace = Object.values(workspaces).find(
      (workspace) => workspace.frames[id]
    );
    if (!workspace) {
      return undefined;
    }

    return workspace.frames[id].config;
  }
);

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

export const selectActiveWidget = createSelector(
  [
    (state: State) => (isReady(state) ? state.payload.workspaces : undefined),
    (state, id: FrameId) => id,
  ],
  (workspaces, id): Widget | undefined => {
    if (!workspaces) return undefined;

    const workspace = Object.values(workspaces).find((w) => w.frames[id]);
    if (!workspace) return undefined;

    const widgetId = workspace.frames[id].activeWidget;
    if (!widgetId) return undefined;

    return workspace.widgets[widgetId];
  }
);

export const selectIsActiveWidget = createSelector(
  [
    (s: State) => (isReady(s) ? s.payload.workspaces : undefined),
    (_, id: WidgetId) => id,
  ],
  (workspaces, id): boolean => {
    if (!workspaces) return false;

    const workspace = Object.values(workspaces).find((w) => w.widgets[id]);
    if (!workspace) return false;

    const widget = workspace.widgets[id];
    if (!widget || !widget.frameId || !workspace.frames[widget.frameId])
      return false;

    return workspace.frames[widget.frameId].activeWidget === id;
  }
);

export const selectWidgetType = createSelector(
  [
    (s: State) => (isReady(s) ? s.payload.workspaces : undefined),
    (_, id: WidgetId) => id,
  ],
  (workspaces, id): WidgetType | undefined => {
    if (!workspaces) return undefined;

    const workspace = Object.values(workspaces).find((w) => w.widgets[id]);
    if (!workspace) return undefined;

    const widget = workspace.widgets[id];
    if (!widget) return undefined;

    return widget.type;
  }
);

export const selectFrameWidgetsIds = createSelector(
  [
    (s: State) => (isReady(s) ? s.payload.workspaces : undefined),
    (s: State, frameId: FrameId) => frameId,
  ],
  (workspaces, frameId): WidgetId[] => {
    if (!workspaces) {
      return [];
    }

    const workspace = Object.values(workspaces).find((w) => w.frames[frameId]);
    if (!workspace) return [];

    return (
      Object.values(workspace.widgets)
        .filter((w): w is Widget => !!w && w.frameId === frameId)
        .map((w) => w.id) ?? []
    );
  }
);

export const selectTabOrder = createSelector(
  [
    (s: State) => (isReady(s) ? s.payload.workspaces : undefined),
    (s: State, widgetId: WidgetId) => widgetId,
  ],
  (workspaces, widgetId): number | undefined => {
    if (!workspaces) {
      return undefined;
    }

    const workspace = Object.values(workspaces).find(
      (w) => w.widgets[widgetId]
    );
    if (!workspace) return undefined;

    const order = workspace?.widgets[widgetId]?.order;

    return order ? Math.trunc(order * 1000000000) : undefined;
  }
);
