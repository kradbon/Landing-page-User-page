import { createStore, useStore } from "@/portal/store";

const STORAGE_KEY = "user-page.notifications.v1";

function loadEnabled(): boolean {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return true;
    return raw === "1";
  } catch {
    return true;
  }
}

function saveEnabled(enabled: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, enabled ? "1" : "0");
  } catch {
    // ignore
  }
}

const store = createStore<{ enabled: boolean }>({ enabled: typeof window === "undefined" ? true : loadEnabled() });

export function useNotificationsEnabled() {
  return useStore(store, (state) => state.enabled);
}

export function toggleNotifications() {
  const next = !store.getState().enabled;
  store.setState({ enabled: next });
  saveEnabled(next);
}

