import { useRef, useSyncExternalStore } from "react";

type Listener = () => void;

export function createStore<T>(initialState: T) {
  let state = initialState;
  const listeners = new Set<Listener>();

  function getState() {
    return state;
  }

  function setState(next: T | ((prev: T) => T)) {
    state = typeof next === "function" ? (next as (prev: T) => T)(state) : next;
    listeners.forEach((listener) => listener());
  }

  function subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  return { getState, setState, subscribe };
}

export function useStore<T, S>(store: { getState: () => T; subscribe: (l: Listener) => () => void }, selector: (state: T) => S) {
  const lastRef = useRef<{ selected: S } | null>(null);

  const getSnapshot = () => {
    const selected = selector(store.getState());
    const last = lastRef.current;
    if (last && shallowEqual(selected, last.selected)) {
      return last.selected;
    }
    lastRef.current = { selected };
    return selected;
  };

  return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}

function shallowEqual(a: unknown, b: unknown) {
  if (Object.is(a, b)) return true;
  if (!a || !b) return false;
  if (typeof a !== "object" || typeof b !== "object") return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i += 1) {
      if (!Object.is(a[i], b[i])) return false;
    }
    return true;
  }
  if (Array.isArray(a) || Array.isArray(b)) return false;
  const aKeys = Object.keys(a as Record<string, unknown>);
  const bKeys = Object.keys(b as Record<string, unknown>);
  if (aKeys.length !== bKeys.length) return false;
  for (const key of aKeys) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (!Object.is((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])) return false;
  }
  return true;
}
