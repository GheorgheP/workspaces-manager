// region WorkspaceId
declare const _workspaceId: unique symbol;

export type WorkspaceId = string & { [_workspaceId]: "WorkspaceId" };
// endregion
