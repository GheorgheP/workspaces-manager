import { WorkspaceId } from "./WorkspaceId";
import { Widget } from "./Widget";
import * as Frame from "./Frame";
import { FrameId } from "./Frame";

export interface Workspace {
  id: WorkspaceId;
  title: string;
  order: number;
  frames: Record<FrameId, Frame.Frame>;
  widgets: Record<Widget["id"], Widget | undefined>;
}
