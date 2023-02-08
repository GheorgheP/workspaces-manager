import { WorkspaceId } from "./types/WorkspaceId";
import { Frame, FrameId } from "./types/Frame";
import { isReady, State } from "./types/State";
import { Widget, WidgetId } from "./types/Widget";
import { WidgetType } from "./types/WidgetType";
import { createSelector } from "reselect";
import { getFrames, getFrameWidgets, isWidgetActive } from "./types/Workspace";
import { shallowEqual } from "react-redux";
import createCachedSelector from "re-reselect";

export const selectWorkspaceFramesIds = createSelector(
  [
    (state: State) => (isReady(state) ? state.payload.workspaces : undefined),
    (state, workspaceId: WorkspaceId) => workspaceId,
  ],
  (workspaces, workspaceId): FrameId[] => {
    if (!workspaces) return [];

    const workspace = workspaces[workspaceId];
    if (!workspace) return [];

    return getFrames(workspace).map((frame) => frame.id);
  },
  {
    memoizeOptions: {
      resultEqualityCheck: shallowEqual,
    },
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
  },
  {
    memoizeOptions: {
      resultEqualityCheck: shallowEqual,
    },
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

    return isWidgetActive(workspace, id);
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

export const selectFrameWidgetsIds = createCachedSelector(
  (s: State, frameId: FrameId) => {
    if (!isReady(s)) return [];

    const workspace = Object.values(s.payload.workspaces).find(
      (w) => w.frames[frameId]
    );
    if (!workspace) return [];

    return getFrameWidgets(workspace, frameId);
  },
  (widgets): WidgetId[] => widgets.map((widget) => widget.id)
)({
  keySelector: (_, frameId) => frameId,
});

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

export const selectFrameWorkspaceId = createSelector(
  [
    (s: State) => (isReady(s) ? s.payload.workspaces : undefined),
    (s: State, frameId: FrameId) => frameId,
  ],
  (workspaces, frameId): WorkspaceId | undefined =>
    Object.values(workspaces ?? {}).find((w) => w.frames[frameId])?.id
);

export const selectIsFullScreen = createSelector(
  [
    (s: State) => (isReady(s) ? s.payload.workspaces : undefined),
    (s: State, id: WorkspaceId) => id,
  ],
  (workspaces, id): boolean => workspaces?.[id].isFullscreen ?? false
);

export const selectWidgetTypes = createSelector(
  (s: State) => s.payload.widgetTypes,
  (types) => types
);
