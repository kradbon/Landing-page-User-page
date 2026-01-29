import { createStore, useStore } from "@/portal/store";

export type ThemeId = "light" | "dark";

const STORAGE_KEY = "user-page.theme.v1";

function loadTheme(): ThemeId {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === "light" || raw === "dark") return raw;
  } catch {
    // ignore
  }
  try {
    return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

function applyTheme(theme: ThemeId) {
  try {
    document.documentElement.classList.toggle("dark", theme === "dark");
  } catch {
    // ignore
  }
}

function saveTheme(theme: ThemeId) {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // ignore
  }
}

const store = createStore<{ theme: ThemeId }>({ theme: typeof window === "undefined" ? "light" : loadTheme() });

export function useTheme() {
  return useStore(store, (state) => state.theme);
}

export function setTheme(theme: ThemeId) {
  store.setState({ theme });
  applyTheme(theme);
  saveTheme(theme);
}

export function toggleTheme() {
  const next = store.getState().theme === "dark" ? "light" : "dark";
  setTheme(next);
}

if (typeof window !== "undefined") {
  applyTheme(store.getState().theme);
}

