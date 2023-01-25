import { Container } from "./components/Container";
import { Provider } from "react-redux";
import { getStore } from "./store";
import { useEffect } from "react";
import { getWorkspaces } from "./api/Workspace";
import { loadSuccess } from "./store/types/Actions";
import { CurrentWorkspaceProvider } from "./contexts/CurrentWorkspace";

export function App() {
  const store = getStore();

  useEffect(() => {
    getWorkspaces().then((ws) => store.dispatch(loadSuccess(ws)));
  }, [1]);

  return (
    <Provider store={store}>
      <CurrentWorkspaceProvider>
        <Container />
      </CurrentWorkspaceProvider>
    </Provider>
  );
}
