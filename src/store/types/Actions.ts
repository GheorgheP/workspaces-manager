// region LoadSuccess
import { ApiWorkspace } from "../../api/Workspace";
import { Frame, FrameId } from "./Frame";
import { WorkspaceId } from "./WorkspaceId";
import { WidgetId } from "./Widget";
import { WidgetConfig, WidgetType } from "./WidgetType";

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
  payload: {
    workspaceId: WorkspaceId;
    frameId: FrameId;
  };
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
  payload: {
    workspaceId: WorkspaceId;
    frameId: FrameId;
  };
}

export const removeFrame = (payload: RemoveFrame["payload"]): RemoveFrame => ({
  type: "RemoveFrame",
  payload,
});
// endregion

// region RemoveWidget
export interface RemoveWidget {
  type: "RemoveWidget";
  payload: {
    workspaceId: WorkspaceId;
    frameId: FrameId;
    widgetId: WidgetId;
  };
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
  payload: {
    workspaceId: WorkspaceId;
    frameId: FrameId;
    widgetId: WidgetId;
  };
}

export const setActiveWidget = (
  payload: SetActiveWidget["payload"]
): SetActiveWidget => ({
  type: "SetActiveWidget",
  payload,
});
// endregion

// region UpdateFrameConfig
export interface UpdateFrameConfig {
  type: "UpdateFrameConfig";
  payload: {
    workspaceId: WorkspaceId;
    frameId: FrameId;
    config: Frame["config"];
  };
}

export const updateFrameConfig = (
  payload: UpdateFrameConfig["payload"]
): UpdateFrameConfig => ({
  type: "UpdateFrameConfig",
  payload,
});
// endregion

// region UpdateWidgetConfig
export interface UpdateWidgetConfig {
  type: "UpdateWidgetConfig";
  payload: {
    workspaceId: WorkspaceId;
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

// region AddWidgets
export interface AddWidgets {
  type: "AddWidgets";
  payload: {
    workspaceId: WorkspaceId;
    widgets: Array<{
      type: WidgetType;
      position?: {
        x: number;
        y: number;
      };
    }>;
  };
}

export const addWidgets = (payload: AddWidgets["payload"]): AddWidgets => ({
  type: "AddWidgets",
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
  | UpdateFrameConfig
  | AddWidgets;
