import { FrameId } from "../../store/types/Frame";
import { memo, ReactElement } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tabs } from "../Tabs";
import { removeFrame, updateWidgetConfig } from "../../store/types/Actions";
import { selectActiveWidget } from "../../store/selectors";
import { WidgetComponent } from "../Widgets";
import { DragHandle } from "./DragHandle";
import { MaximizeButton } from "./MaximizeButton";

export interface FrameProps {
  id: FrameId;
}

export const Frame = memo(({ id }: FrameProps): ReactElement => {
  const dispatch = useDispatch();

  return (
    <div className="w-[100%] flex flex-col frame">
      <div className="bg-bunker flex rounded-t-[8px]">
        <Tabs id={id} />
        <DragHandle id={id} />
        <MaximizeButton id={id} />
        <button onClick={() => dispatch(removeFrame(id))}>X</button>
      </div>
      <div className="flex bg-shark flex-grow w-[100%] shadow-[0_0_0_1px_rgba(40,43,48,1)_inset]">
        <FrameContent id={id} />
      </div>
    </div>
  );
});

interface FrameContentProps {
  id: FrameId;
}
function FrameContent({ id }: FrameContentProps) {
  const w = useSelector((s) => selectActiveWidget(s, id));
  const dispatch = useDispatch();

  if (!w) {
    return null;
  }

  return (
    <WidgetComponent
      type={w.type}
      config={w.config}
      onChange={(config) => {
        dispatch(updateWidgetConfig({ widgetId: w.id, config }));
      }}
    />
  );
}
