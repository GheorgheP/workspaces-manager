import { WorkspaceId } from "../../store/types/WorkspaceId";
import { FrameId } from "../../store/types/Frame";
import { ReactElement } from "react";
import { useSelector } from "react-redux";
import { State } from "../../store/types/State";
import { Tab } from "./Tab";
import { selectFrameWidgetsIds } from "../../store/selectors";

export interface TabsProps {
  workspaceId: WorkspaceId;
  frameId: FrameId;
}

export function Tabs({ frameId, workspaceId }: TabsProps): ReactElement {
  const tabs = useSelector((s: State) =>
    selectFrameWidgetsIds(s, workspaceId, frameId)
  );

  return (
    <div className={"flex"}>
      {tabs.map((id) => (
        <Tab
          key={id}
          workspaceId={workspaceId}
          frameId={frameId}
          widgetId={id}
        />
      ))}
    </div>
  );
}
