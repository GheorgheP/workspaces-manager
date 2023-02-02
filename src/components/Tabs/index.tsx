import { WorkspaceId } from "../../store/types/WorkspaceId";
import { FrameId } from "../../store/types/Frame";
import { ReactElement } from "react";
import { useSelector } from "react-redux";
import { isReady, State } from "../../store/types/State";
import { Widget } from "../../store/types/Widget";
import { Tab } from "./Tab";
import RGL, { WidthProvider } from "react-grid-layout";

const GridLayout = WidthProvider(RGL);

export interface TabsProps {
  workspaceId: WorkspaceId;
  frameId: FrameId;
}

export function Tabs({ frameId, workspaceId }: TabsProps): ReactElement {
  const tabs = useSelector(
    (s: State) => {
      return isReady(s)
        ? Object.values(
            s.payload.workspaces[workspaceId]?.frames[frameId]?.widgets ?? {}
          )
            .sort((a, b) => (b.order < a.order ? -1 : 1))
            .map((w) => s.payload.workspaces[workspaceId].widgets[w.id])
            .filter((w): w is Widget => !!w)
            .map((w) => w.id)
        : [];
    },
    (a, b) => a.length === b.length && a.every((v, i) => v === b[i])
  );

  return (
    <GridLayout
      className="flex w-[50%]"
      useCSSTransforms
      isDroppable
      cols={tabs.length}
      maxRows={1}
      rowHeight={32}
      onLayoutChange={console.log}
      onDrop={console.log}
      compactType={"horizontal"}
      draggableHandle={"[data-tab-draggable-handle]"}
      layout={tabs.map((id, i) => ({ i: id, x: i, y: 0, w: 1, h: 1 }))}
    >
      {tabs.map((id) => (
        <div key={id}>
          <Tab workspaceId={workspaceId} frameId={frameId} widgetId={id} />
        </div>
      ))}
    </GridLayout>
  );
}
