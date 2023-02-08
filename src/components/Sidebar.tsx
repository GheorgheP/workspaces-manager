import { useDispatch, useSelector } from "react-redux";
import { widgetTypeTitle } from "../store/types/WidgetType";
import { addWidget } from "../store/types/Actions";
import { useCurrentWorkspace } from "../contexts/CurrentWorkspace";
import { createSelector } from "reselect";
import { selectWidgetTypes } from "../store/selectors";

export function Sidebar() {
  const { id: workspaceId } = useCurrentWorkspace();
  const dispatch = useDispatch();
  const items = useSelector(widgetTypesWithTitle);

  return (
    <div className="sidebar bg-shark p-2 flex flex-col">
      {items.map((item) => (
        <div
          draggable
          key={item.id}
          className="hover:bg-arsenic py-2 px-4 rounded-[20px] cursor-pointer text-white/50 hover:text-white"
          onClick={() =>
            workspaceId && dispatch(addWidget({ workspaceId, type: item.id }))
          }
        >
          {item.name}
        </div>
      ))}
    </div>
  );
}

const widgetTypesWithTitle = createSelector(selectWidgetTypes, (types) =>
  types.map((type) => ({
    id: type,
    name: widgetTypeTitle(type),
  }))
);
