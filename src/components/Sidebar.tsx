import { useDispatch, useSelector } from "react-redux";
import { isReady, State } from "../store/types/State";
import { widgetTypeTitle } from "../store/types/WidgetType";
import { addWidgets } from "../store/types/Actions";
import { useCurrentWorkspace } from "../contexts/CurrentWorkspace";

export function Sidebar() {
  const { id: workspaceId } = useCurrentWorkspace();
  const dispatch = useDispatch();
  const items = useSelector((state: State) =>
    (isReady(state) ? state.payload.widgetTypes : []).map((type) => ({
      id: type,
      name: widgetTypeTitle(type),
    }))
  );

  return (
    <div className="sidebar bg-shark p-2 flex flex-col">
      {items.map((item) => (
        <div
          draggable
          key={item.id}
          className="hover:bg-arsenic py-2 px-4 rounded-[20px] cursor-pointer text-white/50 hover:text-white"
          onClick={() =>
            workspaceId &&
            dispatch(
              addWidgets({
                workspaceId,
                widgets: [{ type: item.id }],
              })
            )
          }
        >
          {item.name}
        </div>
      ))}
    </div>
  );
}
