import { WorkspaceId } from "./WorkspaceId";
import { Widget, WidgetId } from "./Widget";
import * as Frame from "./Frame";
import { FrameId } from "./Frame";
import { isT } from "../../utils/value";
import produce from "immer";
import { getWidgetSize } from "../utils";

export interface Workspace {
  id: WorkspaceId;
  title: string;
  order: number;
  frames: Record<FrameId, Frame.Frame>;
  widgets: Record<Widget["id"], Widget | undefined>;
  isFullscreen: boolean;
}

export function getTopFrame(workspace: Workspace): Frame.Frame | undefined {
  return Object.values(workspace.frames).reduce(
    (acc, frame) =>
      frame.config.order > (acc?.config.order ?? 0) ? frame : acc,
    undefined as Frame.Frame | undefined
  );
}

export function getFrames(workspace: Workspace): Frame.Frame[] {
  return workspace.isFullscreen
    ? [getTopFrame(workspace)].filter(isT)
    : Object.values(workspace.frames);
}

export function getFrameWidgets(
  workspace: Workspace,
  frameId: FrameId
): Widget[] {
  if (workspace.isFullscreen && getTopFrame(workspace)?.id === frameId) {
    return Object.values(workspace.widgets).filter(
      (w): w is Widget => !!w && !!w.frameId
    );
  } else {
    return Object.values(workspace.widgets).filter(
      (w): w is Widget => !!w && w.frameId === frameId
    );
  }
}

export function getWidgetFrame(
  workspace: Workspace,
  widgetId: WidgetId
): Frame.Frame | undefined {
  const widget = workspace.widgets[widgetId];
  return !widget || !widget.frameId
    ? undefined
    : workspace.isFullscreen
    ? getTopFrame(workspace)
    : workspace.frames[widget.frameId];
}

export function isWidgetActive(
  workspace: Workspace,
  widgetId: WidgetId
): boolean {
  const widget = workspace.widgets[widgetId];
  if (!widget || !widget.frameId) return false;

  const frame = getWidgetFrame(workspace, widgetId);

  return frame?.activeWidget === widget.id;
}

export function setActiveWidget(
  workspace: Workspace,
  widgetId: WidgetId
): Workspace {
  const frame = getWidgetFrame(workspace, widgetId);
  if (!frame) return workspace;

  return {
    ...workspace,
    frames: {
      ...workspace.frames,
      [frame.id]: {
        ...frame,
        activeWidget: widgetId,
      },
    },
  };
}

export const removeWidget = (w: Workspace, id: WidgetId): Workspace => {
  const widget = w.widgets[id];
  if (!widget) return w;

  return _removeEmptyFrames(_removeWidget(w, id));
};

export const removeFrame = (
  workspace: Workspace,
  frameId: FrameId
): Workspace => {
  const frame = workspace.frames[frameId];
  if (!frame) return workspace;

  const w = getFrameWidgets(workspace, frameId).reduce(
    (workspace, widget) => removeWidget(workspace, widget.id),
    workspace
  );

  return _removeEmptyFrames(w);
};

export const maximize = (w: Workspace, frameId: FrameId): Workspace =>
  produce(w, (workspace) => {
    if (workspace.isFullscreen) return workspace;

    const frame = workspace.frames[frameId];
    if (!frame) return workspace;

    const maxOrder = Math.max(
      ...Object.values(workspace.frames).map((frame) => frame.config.order)
    );

    workspace.isFullscreen = true;

    if (maxOrder !== frame.config.order) {
      frame.config.order = maxOrder + 1;
    }
  });

export const minimize = produce<Workspace>((w): Workspace => {
  if (!w.isFullscreen) return w;

  const topFrame = getTopFrame(w);
  if (!topFrame) return w;

  const wFrame = w.widgets[topFrame.activeWidget]?.frameId;

  if (wFrame !== topFrame.id) {
    const firstW = Object.values(w.widgets)
      .filter((w): w is Widget => !!w && w.frameId === topFrame.id)
      .sort((a, b) => a.order - b.order)[0];

    if (firstW) {
      topFrame.activeWidget = firstW.id;
    } else {
      delete w.frames[topFrame.id];
    }
  }

  w.isFullscreen = false;

  return w;
});

export const setActiveFrame = (w: Workspace, frameId: FrameId): Workspace =>
  produce(w, (workspace) => {
    if (workspace.isFullscreen) return workspace;

    const frame = workspace.frames[frameId];

    if (!frame) return workspace;

    const topFrame = getTopFrame(workspace);

    if (topFrame?.id === frameId) return workspace;

    frame.config.order = (topFrame?.config.order ?? 0) + 1;
  });

export function addWidget(workspace: Workspace, widget: Widget): Workspace {
  const frame: Frame.Frame = workspace.isFullscreen
    ? getTopFrame(workspace)!
    : {
        id: Frame.newFrameId(),
        activeWidget: widget.id,
        config: {
          order: getTopFrame(workspace)?.config.order ?? 0,
          width: getWidgetSize(widget.type).minWidth,
          height: getWidgetSize(widget.type).minHeight,
          x: 10,
          y: 10,
        },
      };

  return {
    ...workspace,
    widgets: {
      ...workspace.widgets,
      [widget.id]: { ...widget, frameId: frame.id },
    },
    frames: { ...workspace.frames, [frame.id]: frame },
  };
}

export function getFreeWidgets(workspace: Workspace): Widget[] {
  return Object.values(workspace.widgets).filter(
    (w): w is Widget => !!w && !w.frameId
  );
}

// region internals
function _removeWidget(w: Workspace, id: WidgetId): Workspace {
  const widget = w.widgets[id];
  if (!widget) return w;

  const canRemove =
    Object.values(w.widgets).filter((w) => w && w.type === widget.type).length >
    1;

  if (canRemove) {
    const newWidgets = { ...w.widgets };
    delete newWidgets[id];
    return { ...w, widgets: newWidgets };
  }

  return {
    ...w,
    widgets: {
      ...w.widgets,
      [id]: {
        ...widget,
        frameId: undefined,
      },
    },
  };
}

function _removeEmptyFrames(w: Workspace): Workspace {
  const activeFrames = Object.values(w.widgets)
    .map((w) => w?.frameId)
    .filter(isT);
  const newW: Workspace = {
    ...w,
    frames: Object.fromEntries(
      Object.entries(w.frames).filter(([id]) =>
        activeFrames.includes(id as FrameId)
      )
    ),
  };

  if (newW.isFullscreen && !getTopFrame(newW)) {
    return {
      ...newW,
      isFullscreen: false,
    };
  }

  return newW;
}

export function maxWidgetOrder(w: Workspace): number {
  return Math.max(...Object.values(w.widgets).map((w) => w?.order ?? 0), 0);
}
// endregion
