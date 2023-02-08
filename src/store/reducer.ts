import { isReady, Loading, State } from "./types/State";
import { Actions } from "./types/Actions";
import { unreachable } from "../utils/expcetions";
import { WorkspaceId } from "./types/WorkspaceId";
import * as Workspace from "./types/Workspace";
import {
  addWidget,
  getFreeWidgets,
  maximize,
  maxWidgetOrder,
  minimize,
  removeFrame,
  removeWidget,
  setActiveFrame,
  setActiveWidget,
} from "./types/Workspace";
import * as Frame from "./types/Frame";
import { newWidgetId, Widget, WidgetId } from "./types/Widget";
import produce from "immer";
import { first, last } from "lodash";
import {
  getNextItem,
  getPrevItem,
  getWidgetDefaultConfig,
  resizeFrame,
  snapFramePosition,
} from "./utils";
import { isT } from "../utils/value";

const initialState: Loading = {
  type: "Loading",
  payload: {
    widgetTypes: ["chart", "info", "news", "matrix", "screener"],
  },
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case "LoadSuccess":
      return state.type === "Loading"
        ? {
            type: "Ready",
            payload: {
              workspaces: action.payload.reduce(
                (acc: Record<WorkspaceId, Workspace.Workspace>, apiItem, i) => {
                  acc[apiItem.id] = {
                    id: apiItem.id,
                    title: apiItem.title,
                    order: (i + 1) / (action.payload.length + 1),
                    widgets: apiItem.widgets.reduce(
                      (acc: Record<WidgetId, Widget>, item, i) => {
                        acc[item.id] = {
                          ...item,
                          order: (i + 1) / (apiItem.widgets.length + 1),
                          frameId: apiItem.frames.find((f) =>
                            f.widgets.includes(item.id)
                          )?.id,
                        };
                        return acc;
                      },
                      {}
                    ),
                    isFullscreen: apiItem.fullscreen,
                    frames: apiItem.frames.reduce(
                      (acc: Record<Frame.FrameId, Frame.Frame>, frame, i) => {
                        acc[frame.id] = {
                          id: frame.id,
                          config: { ...frame.config, order: i },
                          activeWidget: frame.widgets[0],
                        };

                        return acc;
                      },
                      {}
                    ),
                  };
                  return acc;
                },
                {}
              ),
              widgetTypes: state.payload.widgetTypes,
            },
          }
        : state;
    case "LoadError":
      return state.type === "Loading"
        ? {
            type: "LoadError",
            payload: {
              widgetTypes: state.payload.widgetTypes,
            },
          }
        : state;
    case "SetActiveFrame":
      return isReady(state)
        ? produce(state, (draft) => {
            const workspace = Object.values(draft.payload.workspaces).find(
              (w) => w.frames[action.payload]
            );
            if (!workspace) return;

            draft.payload.workspaces[workspace.id] = setActiveFrame(
              workspace,
              action.payload
            );
          })
        : state;
    case "RemoveFrame":
      return isReady(state)
        ? produce(state, (draft) => {
            const workspace = Object.values(draft.payload.workspaces).find(
              (w) => w.frames[action.payload]
            );
            if (!workspace) return;

            const frame = workspace.frames[action.payload];
            if (!frame) return;

            draft.payload.workspaces[workspace.id] = removeFrame(
              workspace,
              action.payload
            );
          })
        : state;
    case "RemoveWidget":
      return isReady(state)
        ? produce(state, (draft) => {
            const workspace = Object.values(draft.payload.workspaces).find(
              (w) => w.widgets[action.payload]
            );
            if (!workspace) return;

            draft.payload.workspaces[workspace.id] = removeWidget(
              workspace,
              action.payload
            );
          })
        : state;
    case "SetActiveWidget":
      return isReady(state)
        ? produce(state, (draft) => {
            const workspaces = draft.payload.workspaces;
            const workspace = Object.values(workspaces).find(
              (w) => w.widgets[action.payload]
            );
            if (!workspace) return;

            workspaces[workspace.id] = setActiveWidget(
              workspace,
              action.payload
            );
          })
        : state;
    case "AddWidget":
      return isReady(state)
        ? produce(state, (draft) => {
            const workspace =
              draft.payload.workspaces[action.payload.workspaceId];
            if (!workspace) return;

            const widget: Widget = getFreeWidgets(workspace).find(
              (w) => w.type === action.payload.type
            ) ?? {
              frameId: undefined,
              order: (maxWidgetOrder(workspace) + 1) / 2,
              type: action.payload.type,
              id: newWidgetId(),
              config: getWidgetDefaultConfig(action.payload.type),
            };

            draft.payload.workspaces[action.payload.workspaceId] = addWidget(
              workspace,
              widget
            );
          })
        : state;
    case "MoveWidget": {
      return isReady(state)
        ? produce(state, (draft) => {
            const widgetId = action.payload.widgetId;
            const workspace = Object.values(draft.payload.workspaces).find(
              (w) => w.widgets[action.payload.widgetId]
            );
            if (!workspace) return;

            const fromFrame = workspace.widgets[widgetId]?.frameId;

            switch (action.payload.position.type) {
              case "start":
              case "end": {
                const type = action.payload.position.type;
                const frameId = action.payload.position.frameId;
                const toFrame = workspace.frames[frameId];
                if (!fromFrame || !toFrame) return;

                const widget = workspace.widgets[widgetId];
                if (!widget) return;

                const sorted = Object.values(workspace.widgets)
                  .filter(isT)
                  .sort((a, b) => (a.order < b.order ? -1 : 1));
                const referenceWidget = { start: first, end: last }[type](
                  sorted
                );
                const coefficient = { start: 0, end: 1 }[type];

                if (!referenceWidget) return;

                widget.frameId = toFrame.id;
                widget.order = (referenceWidget.order + coefficient) / 2;

                return;
              }
              case "after":
              case "before": {
                const targetWidgetId = action.payload.position.targetWidgetId;
                const type = action.payload.position.type;

                if (widgetId === targetWidgetId) return;

                const toFrame = workspace.widgets[targetWidgetId]?.frameId;
                if (!fromFrame) return;

                const widget = workspace.widgets[widgetId];
                const targetWidget = workspace.widgets[targetWidgetId];
                if (!targetWidget || !widget) return;

                const otherWidget = otherWidgetMap[type](
                  Object.values(workspace.widgets).filter(
                    (w): w is Widget => !!w && w.frameId === toFrame
                  ),
                  targetWidget.id
                );

                if (otherWidget?.id === widget.id) return;

                const otherOrder = otherWidget?.order ?? defaultOrder[type];
                widget.frameId = toFrame;
                widget.order = (targetWidget.order + otherOrder) / 2;

                if (
                  Object.values(workspace.widgets).filter(
                    (w) => w && w.frameId === fromFrame
                  ).length === 0
                ) {
                  delete workspace.frames[fromFrame];
                }
              }
            }
          })
        : state;
    }
    case "MoveFrame": {
      return isReady(state)
        ? produce(state, (draft) => {
            const workspace = Object.values(draft.payload.workspaces).find(
              (w) => w.frames[action.payload.frameId]
            );
            if (!workspace || workspace.isFullscreen) return;

            const frame = workspace.frames[action.payload.frameId];
            if (!frame) return;

            const otherConfigs = Object.values(workspace.frames)
              .filter((f) => f.id !== frame.id)
              .map((f) => ({ ...f.config }))
              .concat([
                {
                  x: 0,
                  y: 0,
                  width: 100,
                  height: 100,
                  order: 0,
                },
              ]);

            const x = Math.min(
              Math.max(
                frame.config.x + action.payload.x,
                // Allow frame going out of the workspace container, but not entirely
                -(frame.config.width * 0.9)
              ),
              99
            );
            const y = Math.min(
              Math.max(frame.config.y + action.payload.y, 0),
              frame.config.y + frame.config.height
            );
            const d = action.payload.pxSize * 10;

            frame.config = {
              ...frame.config,
              ...snapFramePosition(
                { ...frame.config, x, y },
                otherConfigs,
                d,
                "both"
              ),
            };
          })
        : state;
    }
    case "ResizeFrame": {
      return isReady(state)
        ? produce(state, (draft) => {
            const workspace = Object.values(draft.payload.workspaces).find(
              (w) => w.frames[action.payload.frameId]
            );
            if (!workspace || workspace.isFullscreen) return;

            const frame = workspace.frames[action.payload.frameId];
            if (!frame) return;

            const otherConfigs = Object.values(workspace.frames)
              .filter((f) => f.id !== frame.id)
              .map((f) => ({ ...f.config }))
              .concat([
                {
                  x: 0,
                  y: 0,
                  width: 100,
                  height: 100,
                  order: 0,
                },
              ]);

            frame.config = resizeFrame(
              frame.config,
              otherConfigs,
              action.payload.width,
              action.payload.height,
              action.payload.direction,
              action.payload.pxSize * 10
            );
          })
        : state;
    }
    case "Maximize": {
      return isReady(state)
        ? produce(state, (draft) => {
            const workspace = Object.values(draft.payload.workspaces).find(
              (w) => w.frames[action.payload]
            );
            if (!workspace) return;

            draft.payload.workspaces[workspace.id] = maximize(
              workspace,
              action.payload
            );
          })
        : state;
    }
    case "Minimize": {
      return isReady(state)
        ? produce(state, (draft) => {
            const workspace = Object.values(draft.payload.workspaces).find(
              (w) => w.frames[action.payload]
            );
            if (!workspace) return;

            draft.payload.workspaces[workspace.id] = minimize(workspace);
          })
        : state;
    }
    case "ToggleFullScreen": {
      return isReady(state)
        ? produce(state, (draft) => {
            const workspace = Object.values(draft.payload.workspaces).find(
              (w) => w.frames[action.payload]
            );
            if (!workspace) return;

            draft.payload.workspaces[workspace.id] = workspace.isFullscreen
              ? minimize(workspace)
              : maximize(workspace, action.payload);
          })
        : state;
    }
    default:
      unreachable(action);
      return state;
  }
}

const otherWidgetMap = {
  after: getNextItem,
  before: getPrevItem,
};
const defaultOrder = {
  after: 1,
  before: 0,
};
