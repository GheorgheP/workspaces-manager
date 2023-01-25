import { useSelector } from "react-redux";
import { State } from "../store/types/State";
import { widgetTypeTitle } from "../store/types/WidgetType";

export function EmptyWorkspace() {
  const widgetTypes = useSelector((s: State) => s.payload.widgetTypes);

  return (
    <div className={"bg-woodsmoke"}>
      <div>
        {widgetTypes.map((widgetType) => (
          <button
            key={widgetType}
            onClick={() => console.log(`Insert ${widgetType}`)}
          >
            {widgetTypeTitle(widgetType)}
          </button>
        ))}
      </div>
    </div>
  );
}
