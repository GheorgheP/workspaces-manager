import { createStore, Store } from "redux";
import { reducer } from "./reducer";
import { State } from "./types/State";
import { Actions } from "./types/Actions";
import { devToolsEnhancer } from "redux-devtools-extension";

export function getStore(): Store<State, Actions> {
  return createStore(reducer, devToolsEnhancer({}));
}
