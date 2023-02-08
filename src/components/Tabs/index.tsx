import { FrameId } from "../../store/types/Frame";
import { ReactElement } from "react";
import { useSelector } from "react-redux";
import { State } from "../../store/types/State";
import { Tab } from "./Tab";
import { selectFrameWidgetsIds } from "../../store/selectors";

export interface TabsProps {
  id: FrameId;
}

export function Tabs({ id }: TabsProps): ReactElement {
  const tabs = useSelector((s: State) => selectFrameWidgetsIds(s, id));

  return (
    <div className={"flex"}>
      {tabs.map((id) => (
        <Tab key={id} id={id} />
      ))}
    </div>
  );
}
