import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '@shared/ui/toast/toast.service';
import { I18nStore } from '@shared/i18n/i18n.store';

@Component({
  selector: 'page-dida',
  standalone: true,
  template: `
    <section class="grid gap-4">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-2xl font-extrabold tracking-tight text-slate-900">{{ i18n.t('heading.dida') }}</h1>
          <div class="text-sm font-semibold text-slate-500">{{ i18n.t('message.dida_intro') }}</div>
        </div>
        <button
          class="h-11 rounded-2xl bg-emerald-600 px-4 text-sm font-bold text-white hover:bg-emerald-500"
          type="button"
          (click)="startPractice()"
        >
          {{ i18n.t('action.start_practice') }}
        </button>
      </div>
      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <ul class="list-disc pl-5 text-sm font-semibold text-slate-700 grid gap-2">
          <li>{{ i18n.t('message.practice_step_1') }}</li>
          <li>{{ i18n.t('message.practice_step_2') }}</li>
          <li>{{ i18n.t('message.practice_step_3') }}</li>
          <li>{{ i18n.t('message.practice_step_4') }}</li>
        </ul>
        <div class="mt-5 flex flex-wrap gap-2">
          <button
            class="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-900 hover:bg-slate-50"
            type="button"
            (click)="goToTutor()"
          >
            {{ i18n.t('action.ask_ai_tutor') }}
          </button>
          <button
            class="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-900 hover:bg-slate-50"
            type="button"
            (click)="goToNotebook()"
          >
            {{ i18n.t('action.open_notebook') }}
          </button>
        </div>
      </div>
    </section>
  `,
})
export class DidaPage {
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  readonly i18n = inject(I18nStore);

  startPractice() {
    this.toast.show(this.i18n.t('toast.dida_started'));
  }

  goToTutor() {
    void this.router.navigateByUrl('/ai-tutor');
  }

  goToNotebook() {
    void this.router.navigateByUrl('/notebook');
  }
}
