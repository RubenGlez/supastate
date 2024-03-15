import { useEffect, useState } from "react";

type Serializable =
  | string
  | number
  | boolean
  | null
  | Serializable[]
  | { [key: string]: Serializable };

type State<T extends Serializable> = T;

type Action<T extends Serializable> =
  | { type: "SET_STATE"; payload: T }
  | { type: "UPDATE_STATE"; updater: (state: T) => T };

export function createSupastate<T extends Serializable>(initialState: T) {
  // Each hook has it's own in-memory-state and a set of listeners
  let memoryState: State<T> = initialState;
  const listeners = new Set<(state: State<T>) => void>();

  function reducer(state: State<T>, action: Action<T>): State<T> {
    switch (action.type) {
      case "SET_STATE":
        return action.payload;
      case "UPDATE_STATE":
        return action.updater(state);
      default:
        return state;
    }
  }

  function dispatch(action: Action<T>) {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener) => listener(memoryState));
  }

  const useSupastate = () => {
    const [state, setState] = useState<State<T>>(memoryState);

    useEffect(() => {
      // Listen the changes in this specific instance of memoryState
      const listener = (newState: State<T>) => setState(newState);
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    }, []);

    const set = (payload: T) => dispatch({ type: "SET_STATE", payload });
    const update = (updater: (state: T) => T) =>
      dispatch({ type: "UPDATE_STATE", updater });

    return { state, set, update };
  };

  return useSupastate;
}
