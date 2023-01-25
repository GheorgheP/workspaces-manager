import { Sidebar } from "./Sidebar";
import { Workspace } from "./Workspace";
import { Header } from "./Header";
import { useCurrentWorkspace } from "../contexts/CurrentWorkspace";

export function Container() {
  const { id } = useCurrentWorkspace();
  return (
    <div
      className={"grid grid-cols-with-sidebar grid-rows-with-header w-[100%]"}
    >
      <div className={"contents"}>
        <div className="bg-bunker" />
        <div>
          <Header />
        </div>
      </div>
      <div className="contents">
        <Sidebar />
        {id && <Workspace id={id} />}
      </div>
    </div>
  );
}
