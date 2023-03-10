import { WidgetId } from "../../store/types/Widget";
import { memo, useMemo, useRef } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  selectIsActiveWidget,
  selectTabOrder,
  selectWidgetType,
} from "../../store/selectors";
import classNames from "classnames";
import {
  MoveWidget,
  moveWidget,
  removeWidget,
  setActiveWidget,
} from "../../store/types/Actions";
import { widgetTypeTitle } from "../../store/types/WidgetType";
import { State } from "../../store/types/State";
import { useDrag, useDrop } from "react-dnd";
import { ItemType } from "../types";
import { distinctUntilChanged, Subject } from "rxjs";

export interface TabProps {
  id: WidgetId;
}

export const Tab = memo(({ id }: TabProps) => {
  const dispatch = useDispatch();
  const dispatcher = useMemo(() => {
    const dispatcher$ = new Subject<MoveWidget>();
    dispatcher$.pipe(distinctUntilChanged(shallowEqual)).subscribe(dispatch);

    return (a: MoveWidget) => dispatcher$.next(a);
  }, []);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = useSelector((s) => selectIsActiveWidget(s, id));
  const type = useSelector((s) => selectWidgetType(s, id));
  const order = useSelector((s: State) => selectTabOrder(s, id)) as number;

  const [, drop] = useDrop<Item, void>({
    accept: ItemType.Tab,
    hover(item, monitor) {
      if (!ref.current || item.id === id) {
        return;
      }

      // Determine rectangle on screen
      const rect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY = (rect.bottom - rect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      // Get pixels to the top
      const hoverClientY = clientOffset.y - rect.top;

      if (hoverClientY === hoverMiddleY) {
        return;
      }

      const position = hoverClientY < hoverMiddleY ? "before" : "after";

      dispatcher(
        moveWidget({
          widgetId: item.id,
          position: { type: position, targetWidgetId: id },
        })
      );
    },
  });
  const [, drag] = useDrag<Item>({
    type: ItemType.Tab,
    item: { id, order },
  });

  drag(drop(ref));

  return type ? (
    <div
      ref={ref}
      className={classNames(
        "text-white font-bold text-[10px] px-[12px] py-[10px] flex gap-[8px] items-stretch",
        {
          "bg-shark": isActive,
          "border-balticSea": isActive,
        }
      )}
      data-tab-draggable-handle="true"
      style={{ order }}
    >
      <span
        className={classNames(
          "cursor-pointer flex-grow uppercase flex items-center",
          {
            "opacity-30": !isActive,
          }
        )}
        onClick={() => dispatch(setActiveWidget(id))}
      >
        {widgetTypeTitle(type)}
      </span>
      <button type="button" onClick={() => dispatch(removeWidget(id))}>
        X
      </button>
    </div>
  ) : null;
});

interface Item {
  id: WidgetId;
  order: number;
}
