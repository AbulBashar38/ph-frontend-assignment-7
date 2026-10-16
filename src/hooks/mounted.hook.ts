import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// false during server render and hydration, true after: for UI that depends on browser-only storage
export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
