import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AiTutorStore } from '@features/ai-tutor/model/ai-tutor.store';
import { ToastService } from '@shared/ui/toast/toast.service';
import { I18nStore } from '@shared/i18n/i18n.store';

@Component({
  selector: 'page-ai-tutor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="grid gap-5 min-h-0">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-2xl font-extrabold tracking-tight text-slate-900">{{ i18n.t('heading.ai_tutor') }}</h1>
          <div class="mt-1 text-sm font-semibold text-slate-500">{{ i18n.t('message.ai_tutor_intro') }}</div>
        </div>
        <button
          class="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-900 hover:bg-slate-50"
          type="button"
          (click)="reset()"
        >
          {{ i18n.t('action.new_chat') }}
        </button>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col min-h-0">
        <div class="flex-1 min-h-0 overflow-auto p-5 grid gap-3">
          @for (msg of messages(); track msg.id) {
            <div class="flex" [class.justify-end]="msg.role === 'user'">
              <div
                class="max-w-[75%] rounded-3xl border px-4 py-3 text-sm font-semibold"
                [class.border-slate-200]="msg.role !== 'user'"
                [class.bg-white]="msg.role !== 'user'"
                [class.text-slate-800]="msg.role !== 'user'"
                [class.border-emerald-600]="msg.role === 'user'"
                [class.bg-emerald-600]="msg.role === 'user'"
                [class.text-white]="msg.role === 'user'"
              >
                <div class="text-[11px] font-extrabold opacity-70 mb-1">
                  {{ msg.role === 'user' ? i18n.t('label.you') : i18n.t('label.tutor') }}
                </div>
                <div class="whitespace-pre-wrap">{{ msg.content }}</div>
              </div>
            </div>
          }
        </div>

        <div class="border-t border-slate-100 bg-slate-50 p-3 flex items-center gap-2">
          <input
            class="h-11 flex-1 rounded-2xl border border-slate-200 bg-white px-4 font-semibold outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
            type="text"
            [placeholder]="i18n.t('placeholder.ai_tutor')"
            [ngModel]="input()"
            (ngModelChange)="input.set($event)"
            (keydown.enter)="send()"
          />
          <button
            class="h-11 rounded-2xl bg-slate-900 px-4 text-sm font-bold text-white hover:bg-slate-800"
            type="button"
            (click)="send()"
          >
            {{ i18n.t('action.send') }}
          </button>
        </div>
      </div>
    </section>
  `,
})
export class AiTutorPage {
  private readonly store = inject(AiTutorStore);
  private readonly toast = inject(ToastService);
  readonly i18n = inject(I18nStore);

  readonly messages = this.store.messages;
  readonly input = this.store.input;

  reset() {
    this.store.reset();
    this.toast.show(this.i18n.t('toast.new_chat'));
  }

  send() {
    this.store.send(this.input());
  }
}
