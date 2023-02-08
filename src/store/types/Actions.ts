// region LoadSuccess
import { ApiWorkspace } from "../../api/Workspace";
import { FrameId } from "./Frame";
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
  };
}

export const moveFrame = (payload: MoveFrame["payload"]): MoveFrame => ({
  type: "MoveFrame",
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
  | AddWidgets
  | MoveWidget
  | MoveFrame;
