import { useEffect, useState } from "react";

type Payload = {
  key: string;
  value: string | number | boolean;
};

type State = Record<string, Payload["value"]>;

enum ActionType {
  ADD_ITEM = "ADD_ITEM",
  UPDATE_ITEM = "UPDATE_ITEM",
  DELETE_ITEM = "DELETE_ITEM",
  DELETE_ALL = "DELETE_ALL",
}

type Action =
  | { type: ActionType.ADD_ITEM; key: Payload["key"]; value: Payload["value"] }
  | {
      type: ActionType.UPDATE_ITEM;
      key: Payload["key"];
      value: Payload["value"];
    }
  | { type: ActionType.DELETE_ITEM; key: Payload["key"] }
  | { type: ActionType.DELETE_ALL };

const listeners = new Set<(state: State) => void>();

let memoryState: State = {};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.ADD_ITEM:
      return { ...state, [action.key]: action.value };
    case ActionType.UPDATE_ITEM:
      return action.key in state
        ? { ...state, [action.key]: action.value }
        : state;
    case ActionType.DELETE_ITEM:
      return action.key in state
        ? (() => {
            const { [action.key]: _, ...rest } = state;
            return rest;
          })()
        : state;
    case ActionType.DELETE_ALL:
      return {};
    default:
      return state;
  }
};

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

export const useSupastate = () => {
  const [state, setState] = useState(memoryState);

  useEffect(() => {
    listeners.add(setState);
    return () => {
      listeners.delete(setState);
    };
  }, []);

  const actionCreators = {
    addItem: (key: Payload["key"], value: Payload["value"]) =>
      dispatch({ type: ActionType.ADD_ITEM, key, value }),
    updateItem: (key: Payload["key"], value: Payload["value"]) =>
      dispatch({ type: ActionType.UPDATE_ITEM, key, value }),
    deleteItem: (key: Payload["key"]) =>
      dispatch({ type: ActionType.DELETE_ITEM, key }),
    deleteAll: () => dispatch({ type: ActionType.DELETE_ALL }),
  };

  return { state, ...actionCreators };
};
