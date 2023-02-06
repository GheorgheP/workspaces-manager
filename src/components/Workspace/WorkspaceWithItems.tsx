import RGL, { Layout, WidthProvider } from "react-grid-layout";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../../store/types/State";
import { Wrapper } from "../Frame/Wrapper";
import { WorkspaceId } from "../../store/types/WorkspaceId";
import { FrameId } from "../../store/types/Frame";
import { updateFrameConfig } from "../../store/types/Actions";
import { Frame } from "../Frame/Frame";

const GridLayout = WidthProvider(RGL);

export interface WorkspaceWithItemsProps {
  id: WorkspaceId;
}
export function WorkspaceWithItems({ id }: WorkspaceWithItemsProps) {
  const dispatch = useDispatch();
  const layouts = useSelector(
    (s: State) => {
      switch (s.type) {
        case "Loading":
        case "LoadError":
          return [];
        case "Ready":
          return Object.values(s.payload.workspaces[id].frames).map(
            (w): Layout => ({
              i: w.id,
              x: w.config.x,
              y: w.config.y,
              w: w.config.width,
              h: w.config.height,
              resizeHandles: ["s", "w", "e", "n", "sw", "nw", "se", "ne"],
            })
          );
      }
    },
    (a, b) => {
      return (
        a.length === b.length &&
        a.every(
          (v, i) =>
            v.i === b[i].i &&
            v.x === b[i].x &&
            v.y === b[i].y &&
            v.w === b[i].w &&
            v.h === b[i].h
        )
      );
    }
  );

  return (
    <div className={"bg-woodsmoke relative"}>
      <GridLayout
        allowOverlap
        useCSSTransforms
        measureBeforeMount
        isBounded
        cols={200}
        rowHeight={5}
        layout={layouts}
        margin={[0, 0]}
        onDragStop={(...[, , v]) => {
          dispatch(
            updateFrameConfig({
              workspaceId: id,
              frameId: v.i as FrameId,
              config: {
                x: v.x,
                y: v.y,
                width: v.w,
                height: v.h,
              },
            })
          );
        }}
        onResizeStop={(...[, , v]) => {
          dispatch(
            updateFrameConfig({
              workspaceId: id,
              frameId: v.i as FrameId,
              config: {
                x: v.x,
                y: v.y,
                width: v.w,
                height: v.h,
              },
            })
          );
        }}
        draggableHandle={"[data-draggable-handle]"}
      >
        {layouts?.map((l) => (
          <Wrapper workspaceId={id} frameId={l.i as FrameId} key={l.i}>
            <Frame workspaceId={id} frameId={l.i as FrameId} />
          </Wrapper>
        ))}
      </GridLayout>
    </div>
  );
}
