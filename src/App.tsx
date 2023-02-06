import { Container } from "./components/Container";
import { Provider } from "react-redux";
import { getStore } from "./store";
import { useEffect } from "react";
import { getWorkspaces } from "./api/Workspace";
import { loadSuccess } from "./store/types/Actions";
import { CurrentWorkspaceProvider } from "./contexts/CurrentWorkspace";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export function App() {
  const store = getStore();

  useEffect(() => {
    getWorkspaces().then((ws) => store.dispatch(loadSuccess(ws)));
  }, [1]);

  return (
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <CurrentWorkspaceProvider>
          <Container />
        </CurrentWorkspaceProvider>
      </DndProvider>
    </Provider>
  );
}
