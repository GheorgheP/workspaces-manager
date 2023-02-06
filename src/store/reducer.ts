import { isReady, Loading, State } from "./types/State";
import { Actions } from "./types/Actions";
import { unreachable } from "../utils/expcetions";
import { WorkspaceId } from "./types/WorkspaceId";
import * as Workspace from "./types/Workspace";
import * as Frame from "./types/Frame";
import { FrameId, newFrameId } from "./types/Frame";
import { newWidgetId, Widget, WidgetId } from "./types/Widget";
import produce from "immer";
import { first, groupBy, last } from "lodash";
import {
  getNextItem,
  getPrevItem,
  getWidgetDefaultConfig,
  getWidgetSize,
} from "./utils";
import { isT } from "../utils/value";
import { WidgetType } from "./types/WidgetType";

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
                    frames: apiItem.frames.reduce(
                      (acc: Record<Frame.FrameId, Frame.Frame>, frame, i) => {
                        acc[frame.id] = {
                          id: frame.id,
                          config: frame.config,
                          order: i,
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
            const workspace =
              draft.payload.workspaces[action.payload.workspaceId];
            if (!workspace) return;

            const frame = workspace.frames[action.payload.frameId];
            const maxOrder = Math.max(
              ...Object.values(workspace.frames).map((frame) => frame.order)
            );
            if (!frame || frame.order === maxOrder) return;

            frame.order = maxOrder + 1;
          })
        : state;
    case "RemoveFrame":
      return isReady(state)
        ? produce(state, (draft) => {
            const workspace =
              draft.payload.workspaces[action.payload.workspaceId];
            if (!workspace) return;

            const frame = workspace.frames[action.payload.frameId];
            if (!frame) return;

            const grouped = groupBy(
              Object.values(workspace.widgets).filter(isT),
              (widget) => widget.type
            );
            Object.values(workspace.widgets)
              .filter(isT)
              .filter((widget) => widget.frameId === action.payload.frameId)
              .map((w) => workspace.widgets[w.id])
              .filter((w): w is Widget => !!w)
              .filter((w) => grouped[w.type].length > 1)
              .map((w) => w.id)
              .forEach((id) => {
                delete workspace.widgets[id];
              });

            delete workspace.frames[action.payload.frameId];
          })
        : state;
    case "RemoveWidget":
      return isReady(state)
        ? produce(state, (draft) => {
            const workspace =
              draft.payload.workspaces[action.payload.workspaceId];
            if (!workspace) return;

            const widget = workspace.widgets[action.payload.widgetId];
            if (!widget) return;

            const frame = widget.frameId
              ? workspace.frames[widget.frameId]
              : undefined;
            if (!frame) return;

            const count = Object.values(workspace.widgets).filter(
              (w) => w && w.frameId === frame.id
            ).length;
            if (count < 2) {
              delete workspace.frames[frame.id];
              widget.frameId = undefined;
            }

            if (
              Object.values(workspace.widgets).filter(
                (w) => w && w.type === widget.type
              ).length > 1
            ) {
              delete workspace.widgets[widget.id];
            }
          })
        : state;
    case "SetActiveWidget":
      return isReady(state)
        ? produce(state, (draft) => {
            const workspace =
              draft.payload.workspaces[action.payload.workspaceId];
            if (!workspace) return;

            const widget = workspace.widgets[action.payload.widgetId];
            if (!widget || !widget.frameId) return;

            const frame = workspace.frames[widget.frameId];
            if (!frame) return;

            frame.activeWidget = widget.id;
          })
        : state;
    case "UpdateFrameConfig":
      return isReady(state)
        ? produce(state, (draft) => {
            const workspace =
              draft.payload.workspaces[action.payload.workspaceId];
            if (!workspace) return;

            const frame = workspace.frames[action.payload.frameId];
            if (!frame) return;

            frame.config = action.payload.config;
          })
        : state;
    case "AddWidgets":
      return isReady(state)
        ? produce(state, (draft) => {
            const workspace =
              draft.payload.workspaces[action.payload.workspaceId];
            if (!workspace) return;

            const frameMaxOrder = Math.max(
              ...Object.values(workspace.frames).map((w) => w.order),
              0
            );
            const widgetMaxOrder = Math.max(
              ...Object.values(workspace.widgets)
                .filter(isT)
                .map((w) => w.order),
              0
            );

            function getOrCreateWidget(
              type: WidgetType,
              frameId: FrameId,
              order: number
            ): Widget {
              const existing = Object.values(workspace.widgets).find(
                (w) => w && w.type === type && w.frameId === undefined
              );

              return (
                existing || {
                  id: newWidgetId(),
                  type,
                  frameId,
                  order,
                  config:
                    Object.values(workspace.widgets)
                      .filter(isT)
                      .find((w) => w.type === type)?.config ??
                    getWidgetDefaultConfig(type),
                }
              );
            }

            action.payload.widgets.reduce(
              ([fOrder, wOrder], { type, position }, i) => {
                const frameId = newFrameId();
                const widgetId = newWidgetId();
                const size = getWidgetSize(type);
                const frame: Frame.Frame = {
                  id: frameId,
                  order: fOrder + 1,
                  activeWidget: widgetId,
                  config: {
                    width: size.minWidth,
                    height: size.minHeight,
                    x: position?.x ?? i * 5,
                    y: position?.y ?? i * 5,
                  },
                };
                const widget = getOrCreateWidget(
                  type,
                  frameId,
                  (wOrder + 1) / 2
                );

                workspace.widgets[widget.id] = widget;
                workspace.frames[frame.id] = frame;

                return [frame.order, widget.order];
              },
              [frameMaxOrder, widgetMaxOrder]
            );
          })
        : state;
    case "MoveWidget": {
      return isReady(state)
        ? produce(state, (draft) => {
            const widgetId = action.payload.widgetId;
            const workspace =
              draft.payload.workspaces[action.payload.workspaceId];
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
