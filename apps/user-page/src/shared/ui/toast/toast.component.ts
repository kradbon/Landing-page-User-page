import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'shared-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (message()) {
      <div
        class="fixed bottom-4 right-4 z-50 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg"
      >
        {{ message() }}
      </div>
    }
  `,
})
export class ToastComponent {
  readonly message = inject(ToastService).message;
}

