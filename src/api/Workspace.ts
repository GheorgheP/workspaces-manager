import { WorkspaceId } from "../store/types/WorkspaceId";
import { WidgetId } from "../store/types/Widget";
import { FrameId } from "../store/types/Frame";
import { WidgetConfig, WidgetType } from "../store/types/WidgetType";

export interface ApiWidget<T extends WidgetType> {
  id: WidgetId;
  type: T;
  config: WidgetConfig<T>;
}

export interface ApiFrame {
  id: FrameId;
  widgets: WidgetId[];
  config: {
    width: number;
    height: number;
    x: number;
    y: number;
  };
}

export interface ApiWorkspace {
  id: WorkspaceId;
  title: string;
  frames: ApiFrame[];
  widgets: ApiWidget<WidgetType>[];
}

export async function getWorkspaces(): Promise<ApiWorkspace[]> {
  return [
    {
      id: "workspace-1" as WorkspaceId,
      title: "Workspace 1",
      widgets: [
        {
          id: "w-news" as WidgetId,
          type: "news",
          config: {
            provider: "twitter",
            limit: 10,
          },
        },
        {
          id: "w-chart" as WidgetId,
          type: "chart",
          config: {
            tickers: ["AMZN.US"],
            type: "line",
            range: [0, 1],
          },
        },
        {
          id: "w-chart-2" as WidgetId,
          type: "chart",
          config: {
            tickers: ["TSLA.US"],
            type: "line",
            range: [0, 1],
          },
        },
      ],
      frames: [
        {
          id: "frame-1" as FrameId,
          widgets: ["w-news" as WidgetId, "w-chart" as WidgetId],
          config: {
            width: 250,
            height: 200,
            x: 0,
            y: 0,
          },
        },
        {
          id: "frame-2" as FrameId,
          widgets: ["w-chart-2" as WidgetId],
          config: {
            width: 180,
            height: 200,
            x: 600,
            y: 400,
          },
        },
      ],
    },
  ];
}
