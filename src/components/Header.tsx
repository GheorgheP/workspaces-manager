import classNames from "classnames";
import { useSelector } from "react-redux";
import { State } from "../store/types/State";
import { useCurrentWorkspace } from "../contexts/CurrentWorkspace";

export function Header() {
  const { id, setId } = useCurrentWorkspace();
  const workspaces = useSelector(
    (s: State) =>
      s.type === "Ready" ? Object.values(s.payload.workspaces) : [],
    (a, b) =>
      a.length === b.length &&
      a.every((v, i) => v.id === b[i].id && v.title === b[i].title)
  );

  return (
    <div className="bg-bunker flex">
      {workspaces.map((tab) => (
        <button
          type={"button"}
          key={tab.id}
          aria-current={tab.id === id ? "page" : undefined}
          onClick={() => setId(tab.id)}
          className={classNames(
            "p-[15px] cursor-pointer bg-transparent border-none text-white/50 text-white/100",
            "hover:bg-cinder/70 [&[aria-current=page]]:bg-cinder"
          )}
        >
          {tab.title}
        </button>
      ))}
    </div>
  );
}
