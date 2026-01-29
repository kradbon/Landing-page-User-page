import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'user-page.notifications.v1';

function loadEnabled(): boolean {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return true;
    return raw === '1';
  } catch {
    return true;
  }
}

function saveEnabled(enabled: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0');
  } catch {
    // ignore
  }
}

@Injectable({ providedIn: 'root' })
export class NotificationsStore {
  readonly enabled = signal(loadEnabled());

  toggle() {
    this.enabled.update((v) => !v);
    saveEnabled(this.enabled());
  }
}

