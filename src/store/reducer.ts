import { isReady, Loading, State } from "./types/State";
import { Actions } from "./types/Actions";
import { unreachable } from "../utils/expcetions";
import { WorkspaceId } from "./types/WorkspaceId";
import { Workspace } from "./types/Workspace";
import { Frame, FrameId, newFrameId } from "./types/Frame";
import { newWidgetId, Widget, WidgetId } from "./types/Widget";
import produce from "immer";
import { groupBy } from "lodash";
import { getWidgetDefaultConfig, getWidgetSize } from "./utils";

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
                (acc: Record<WorkspaceId, Workspace>, item, i) => {
                  acc[item.id] = {
                    id: item.id,
                    title: item.title,
                    order: (i + 1) / (action.payload.length + 1),
                    widgets: item.widgets.reduce(
                      (acc: Record<WidgetId, Widget>, item) => {
                        acc[item.id] = item;
                        return acc;
                      },
                      {}
                    ),
                    frames: item.frames.reduce(
                      (acc: Record<FrameId, Frame>, frame, i) => {
                        acc[frame.id] = {
                          id: frame.id,
                          config: frame.config,
                          order: (i + 1) / (item.frames.length + 1),
                          activeWidget: frame.widgets[0],
                          widgets: frame.widgets.reduce(
                            (
                              acc: Record<
                                WidgetId,
                                { id: WidgetId; order: number }
                              >,
                              id,
                              i
                            ) => {
                              acc[id] = {
                                id,
                                order: (i + 1) / (frame.widgets.length + 1),
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
            const minOrder = Math.min(
              ...Object.values(workspace.frames).map((frame) => frame.order)
            );
            if (!frame || frame.order === minOrder) return;

            frame.order = minOrder / 2;

            // Need to review in future and come up with a better solution
            // The idea is if you change the order very often, the number is so small that we cannot
            // deduce the zIndex value from it. So we need to reset the orders for all frames
            if (frame.order < 0.00000001) {
              const frames = Object.values(workspace.frames).sort(
                (a, b) => a.order - b.order
              );
              frames.forEach((frame, i) => {
                frame.order = (i + 1) / (frames.length + 1);
              });
            }
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
              Object.values(workspace.widgets),
              (widget) => widget.type
            );
            Object.values(frame.widgets)
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

            const frame = workspace.frames[action.payload.frameId];
            if (!frame) return;

            const widget =
              workspace.widgets[frame.widgets[action.payload.widgetId].id];
            if (!widget) return;

            delete frame.widgets[action.payload.widgetId];

            if (Object.keys(frame.widgets).length === 0) {
              delete workspace.frames[action.payload.frameId];
            }

            if (
              Object.values(workspace.widgets).filter(
                (w) => w.type === widget.type
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

            const frame = workspace.frames[action.payload.frameId];
            if (!frame) return;

            const widget = frame.widgets[action.payload.widgetId].id;
            if (!widget) return;

            if (frame.activeWidget !== widget) {
              frame.activeWidget = widget;
            }
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

            const minOrder = Math.min(
              ...Object.values(workspace.frames).map((w) => w.order)
            );

            action.payload.widgets.reduce(
              (prevOrder, { type, position }, i) => {
                const frameId = newFrameId();
                const widgetId = newWidgetId();
                const order = prevOrder / 2;
                const size = getWidgetSize(type);
                const config =
                  Object.values(workspace.widgets).find((w) => w.type === type)
                    ?.config ?? getWidgetDefaultConfig(type);

                workspace.widgets[widgetId] = { id: widgetId, type, config };
                workspace.frames[frameId] = {
                  id: frameId,
                  order,
                  widgets: {
                    [widgetId]: {
                      id: widgetId,
                      order: 0.5,
                    },
                  },
                  activeWidget: widgetId,
                  config: {
                    width: size.minWidth,
                    height: size.minHeight,
                    x: position?.x ?? i * 5,
                    y: position?.y ?? i * 5,
                  },
                };

                return order;
              },
              minOrder
            );
          })
        : state;
    default:
      unreachable(action);
      return state;
  }
}
