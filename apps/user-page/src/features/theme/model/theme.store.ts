import { Injectable, signal } from '@angular/core';

export type ThemeId = 'light' | 'dark';

const STORAGE_KEY = 'user-page.theme.v1';

function loadTheme(): ThemeId {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === 'light' || raw === 'dark') return raw;
  } catch {
    // ignore
  }

  try {
    return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

function applyTheme(theme: ThemeId) {
  try {
    document.documentElement.classList.toggle('dark', theme === 'dark');
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

@Injectable({ providedIn: 'root' })
export class ThemeStore {
  readonly theme = signal<ThemeId>(loadTheme());

  constructor() {
    applyTheme(this.theme());
  }

  setTheme(theme: ThemeId) {
    this.theme.set(theme);
    applyTheme(theme);
    saveTheme(theme);
  }

  toggle() {
    this.setTheme(this.theme() === 'dark' ? 'light' : 'dark');
  }
}

