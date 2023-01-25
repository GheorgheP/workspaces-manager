import { WorkspaceId } from "./WorkspaceId";
import { Widget } from "./Widget";
import { Frame, FrameId } from "./Frame";

export interface Workspace {
  id: WorkspaceId;
  title: string;
  order: number;
  frames: Record<FrameId, Frame>;
  widgets: Record<Widget["id"], Widget>;
}
