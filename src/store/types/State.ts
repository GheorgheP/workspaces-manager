import { Workspace } from "./Workspace";
import { WidgetType } from "./WidgetType";
import { WorkspaceId } from "./WorkspaceId";

// region Loading
export interface LoadingPayload {
  widgetTypes: WidgetType[];
}

export interface Loading {
  type: "Loading";
  payload: LoadingPayload;
}

export const loading = (payload: Loading["payload"]): Loading => ({
  type: "Loading",
  payload,
});
// endregion

// region LoadError
export interface LoadErrorPayload extends LoadingPayload {}

export interface LoadError {
  type: "LoadError";
  payload: LoadErrorPayload;
}

export const loadError = (payload: LoadError["payload"]): LoadError => ({
  type: "LoadError",
  payload,
});
// endregion

// region Ready
export interface ReadyPayload extends LoadingPayload {
  workspaces: Record<WorkspaceId, Workspace>;
}

export interface Ready {
  type: "Ready";
  payload: ReadyPayload;
}

export const ready = (payload: Ready["payload"]): Ready => ({
  type: "Ready",
  payload,
});
// endregion

export type State = Loading | LoadError | Ready;

export function isReady(state: State): state is Ready {
  return state.type === "Ready";
}
