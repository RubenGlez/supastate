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
  | { type: "UPDATE_STATE"; updater: (state: T) => T }
  | { type: "RESET_STATE" };

interface SupastateOptions {
  persist?: boolean;
  key?: string;
}

export function createSupastate<T extends Serializable>(
  initialState: T,
  options?: SupastateOptions
) {
  const { persist, key } = {
    persist: false,
    key: `supastate_${new Date().getTime()}_${Math.random()
      .toString(36)
      .slice(2, 9)}`,
    ...options,
  };

  const loadState = (): State<T> => {
    if (!persist) return initialState;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialState;
    } catch (error) {
      console.log(error);
      return initialState;
    }
  };

  let memoryState: State<T> = loadState();
  const listeners = new Set<(state: State<T>) => void>();

  const saveState = (state: State<T>) => {
    if (!persist) return;
    try {
      const stateToSave = JSON.stringify(state);
      window.localStorage.setItem(key!, stateToSave);
    } catch (error) {
      console.log(error);
    }
  };

  function reducer(state: State<T>, action: Action<T>): State<T> {
    switch (action.type) {
      case "SET_STATE":
        return action.payload;
      case "UPDATE_STATE":
        return action.updater(state);
      case "RESET_STATE":
        return initialState;
      default:
        return state;
    }
  }

  function dispatch(action: Action<T>) {
    memoryState = reducer(memoryState, action);
    saveState(memoryState);
    listeners.forEach((listener) => listener(memoryState));
  }

  const useSupastate = () => {
    const [state, setState] = useState<State<T>>(memoryState);

    useEffect(() => {
      const listener = (newState: State<T>) => setState(newState);
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    }, []);

    // Is this (set) really useful?
    const set = (payload: T) => dispatch({ type: "SET_STATE", payload });
    const update = (updater: (state: T) => T) =>
      dispatch({ type: "UPDATE_STATE", updater });
    const reset = () => dispatch({ type: "RESET_STATE" });

    return { state, set, update, reset };
  };

  return useSupastate;
}
