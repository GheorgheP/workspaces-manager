// region LoadSuccess
import { ApiWorkspace } from "../../api/Workspace";
import { FrameId } from "./Frame";
import { WorkspaceId } from "./WorkspaceId";
import { WidgetId } from "./Widget";
import { WidgetConfig, WidgetType } from "./WidgetType";
import { Direction } from "./Direction";

export interface LoadSuccess {
  type: "LoadSuccess";
  payload: ApiWorkspace[];
}

export const loadSuccess = (payload: LoadSuccess["payload"]): LoadSuccess => ({
  type: "LoadSuccess",
  payload,
});
// endregion

// region LoadError
export interface LoadError {
  type: "LoadError";
}

export const loadError = (): LoadError => ({
  type: "LoadError",
});
// endregion

// region SetActiveFrame
export interface SetActiveFrame {
  type: "SetActiveFrame";
  payload: FrameId;
}

export const setActiveFrame = (
  payload: SetActiveFrame["payload"]
): SetActiveFrame => ({
  type: "SetActiveFrame",
  payload,
});
// endregion

// region RemoveFrame
export interface RemoveFrame {
  type: "RemoveFrame";
  payload: FrameId;
}

export const removeFrame = (payload: RemoveFrame["payload"]): RemoveFrame => ({
  type: "RemoveFrame",
  payload,
});
// endregion

// region RemoveWidget
export interface RemoveWidget {
  type: "RemoveWidget";
  payload: WidgetId;
}

export const removeWidget = (
  payload: RemoveWidget["payload"]
): RemoveWidget => ({
  type: "RemoveWidget",
  payload,
});
// endregion

// region SetActiveWidget
export interface SetActiveWidget {
  type: "SetActiveWidget";
  payload: WidgetId;
}

export const setActiveWidget = (
  payload: SetActiveWidget["payload"]
): SetActiveWidget => ({
  type: "SetActiveWidget",
  payload,
});
// endregion

// region UpdateWidgetConfig
export interface UpdateWidgetConfig {
  type: "UpdateWidgetConfig";
  payload: {
    widgetId: WidgetId;
    config: WidgetConfig<WidgetType>;
  };
}

export const updateWidgetConfig = (
  payload: UpdateWidgetConfig["payload"]
): UpdateWidgetConfig => ({
  type: "UpdateWidgetConfig",
  payload,
});
// endregion

// region AddWidget
export interface AddWidget {
  type: "AddWidget";
  payload: {
    workspaceId: WorkspaceId;
    type: WidgetType;
  };
}

export const addWidget = (payload: AddWidget["payload"]): AddWidget => ({
  type: "AddWidget",
  payload,
});
// endregion

// region AddWidgetAt
export interface AddWidgetAt {
  type: "AddWidgetAt";
  payload: {
    widgetType: WidgetType;
    x: number;
    y: number;
  };
}

export const addWidgetAt = (payload: AddWidgetAt["payload"]): AddWidgetAt => ({
  type: "AddWidgetAt",
  payload,
});
// endregion

// region FillEmptyWorkspace
export interface FillEmptyWorkspace {
  type: "FillEmptyWorkspace";
  payload: {
    workspaceId: WorkspaceId;
    widgets: WidgetType[];
  };
}

export const fillEmptyWorkspace = (
  payload: FillEmptyWorkspace["payload"]
): FillEmptyWorkspace => ({
  type: "FillEmptyWorkspace",
  payload,
});
// endregion

// region MoveWidget
export interface MoveWidget {
  type: "MoveWidget";
  payload: {
    widgetId: WidgetId;
    position:
      | {
          type: "start" | "end";
          frameId: FrameId;
        }
      | {
          type: "before" | "after";
          targetWidgetId: WidgetId;
        };
  };
}

export const moveWidget = (payload: MoveWidget["payload"]): MoveWidget => ({
  type: "MoveWidget",
  payload,
});
// endregion

// region MoveFrame
export interface MoveFrame {
  type: "MoveFrame";
  payload: {
    frameId: FrameId;
    x: number;
    y: number;
    pxSize: number;
  };
}

export const moveFrame = (payload: MoveFrame["payload"]): MoveFrame => ({
  type: "MoveFrame",
  payload,
});
// endregion

// region ResizeFrame
export interface ResizeFrame {
  type: "ResizeFrame";
  payload: {
    frameId: FrameId;
    width: number;
    height: number;
    direction: Direction;
    pxSize: number;
  };
}

export const resizeFrame = (payload: ResizeFrame["payload"]): ResizeFrame => ({
  type: "ResizeFrame",
  payload,
});
// endregion

// region Maximize
export interface Maximize {
  type: "Maximize";
  payload: FrameId;
}

export const maximize = (payload: Maximize["payload"]): Maximize => ({
  type: "Maximize",
  payload,
});
// endregion

// region Minimize
export interface Minimize {
  type: "Minimize";
  payload: FrameId;
}

export const minimize = (payload: Minimize["payload"]): Minimize => ({
  type: "Minimize",
  payload,
});
// endregion

// region ToggleFullScreen
export interface ToggleFullScreen {
  type: "ToggleFullScreen";
  payload: FrameId;
}

export const toggleFullScreen = (
  payload: ToggleFullScreen["payload"]
): ToggleFullScreen => ({
  type: "ToggleFullScreen",
  payload,
});
// endregion

export type Actions =
  | LoadSuccess
  | LoadError
  | SetActiveFrame
  | RemoveFrame
  | RemoveWidget
  | SetActiveWidget
  | AddWidget
  | AddWidgetAt
  | FillEmptyWorkspace
  | MoveWidget
  | MoveFrame
  | ResizeFrame
  | Maximize
  | Minimize
  | ToggleFullScreen;
