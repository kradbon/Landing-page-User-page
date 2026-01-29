import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly message = signal<string | null>(null);

  private timeoutId: number | null = null;

  show(message: string, durationMs = 1800) {
    this.message.set(message);
    if (this.timeoutId !== null) window.clearTimeout(this.timeoutId);
    this.timeoutId = window.setTimeout(() => {
      this.message.set(null);
      this.timeoutId = null;
    }, durationMs);
  }
}

