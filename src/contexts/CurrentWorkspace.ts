import {
  createContext,
  createElement,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import { WorkspaceId } from "../store/types/WorkspaceId";

export interface CurrentWorkspacePayload {
  id: WorkspaceId | undefined;
  setId: (id: WorkspaceId) => void;
}

const CurrentWorkspace = createContext<CurrentWorkspacePayload>({
  id: undefined,
  setId: () => {},
});

export function useCurrentWorkspace(): CurrentWorkspacePayload {
  return useContext(CurrentWorkspace);
}

export function CurrentWorkspaceProvider({ children }: PropsWithChildren<{}>) {
  const [id, setId] = useState<WorkspaceId | undefined>();
  return createElement(
    CurrentWorkspace.Provider,
    { value: { id, setId } },
    children
  );
}
