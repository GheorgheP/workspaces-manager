import { useSelector } from "react-redux";
import { State } from "../store/types/State";
import { WorkspaceWithItems } from "./WorkspaceWithItems";
import { EmptyWorkspace } from "./EmptyWorkspace";
import { ReactElement } from "react";
import { Loading } from "./Loading";
import { unreachable } from "../utils/expcetions";
import { WorkspaceId } from "../store/types/WorkspaceId";

export function Workspace({ id }: { id: WorkspaceId }): ReactElement {
  const hasFrames = useSelector(
    (s: State): "loading" | "with-items" | "empty" => {
      switch (s.type) {
        case "Loading":
        case "LoadError":
          return "loading";
        case "Ready": {
          const frames = s.payload.workspaces[id]?.frames;

          if (frames === undefined) return "empty";

          if (Object.keys(frames).length === 0) return "empty";

          return "with-items";
        }
      }
    }
  );

  if (hasFrames === "loading") return <Loading />;
  if (hasFrames === "empty") return <EmptyWorkspace />;
  if (hasFrames === "with-items") return <WorkspaceWithItems id={id} />;

  unreachable(hasFrames);
  return <div>Unknown state</div>;
}
