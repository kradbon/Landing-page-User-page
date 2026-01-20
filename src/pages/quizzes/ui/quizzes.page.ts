import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CourseStore } from '@entities/course/model/course.store';
import { OrgStore } from '@features/org/model/org.store';
import { ToastService } from '@shared/ui/toast/toast.service';
import { I18nStore } from '@shared/i18n/i18n.store';

@Component({
  selector: 'page-quizzes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="grid gap-5">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-2xl font-extrabold tracking-tight text-slate-900">{{ i18n.t('heading.quizzes') }}</h1>
          <div class="mt-1 text-sm font-semibold text-slate-500">{{ i18n.t('message.quizzes_intro') }}</div>
        </div>
        <label class="flex items-center gap-2 flex-wrap">
          <span class="text-sm font-extrabold text-slate-500">{{ i18n.t('label.course') }}</span>
          <select
            class="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-900 outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
            [ngModel]="activeCourseId()"
            (ngModelChange)="setActiveCourse($event)"
          >
            @for (course of courses(); track course.id) {
              <option [value]="course.id">{{ course.title }}</option>
            }
          </select>
        </label>
      </div>

      @if (!isB2b()) {
        <div class="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm grid gap-2 place-items-center text-center">
          <div class="text-base font-extrabold text-slate-900">{{ i18n.t('message.coming_soon') }}</div>
          <div class="text-sm font-semibold text-slate-500">{{ i18n.t('message.b2b_only_quizzes') }}</div>
          <button
            class="h-10 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-900 hover:bg-slate-50"
            type="button"
            (click)="switchToB2b()"
          >
            {{ i18n.t('action.switch_to_b2b') }}
          </button>
        </div>
      } @else if (loading()) {
        <div class="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm grid place-items-center">
          <div class="text-sm font-extrabold text-slate-500">{{ i18n.t('message.loading_quizzes') }}</div>
        </div>
      } @else if (!activeCourse()) {
        <div class="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm grid place-items-center">
          <div class="text-base font-extrabold text-slate-900">{{ i18n.t('message.no_course_selected') }}</div>
        </div>
      } @else {
        <div class="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div class="flex items-center justify-between gap-3 px-5 py-4">
            <div class="min-w-0">
              <div class="truncate text-sm font-extrabold text-slate-900">{{ activeCourse()!.title }}</div>
              <div class="mt-1 text-sm font-semibold text-slate-500">
                {{ i18n.t('ui.course_progress', { percent: activeCourse()!.progress }) }}
              </div>
            </div>
          </div>

          <div class="overflow-auto">
            <table class="min-w-full">
              <thead class="sticky top-0 bg-white">
                <tr class="border-y border-slate-100">
                  <th class="px-5 py-3 text-left text-[11px] font-extrabold tracking-[0.12em] uppercase text-slate-400">
                    {{ i18n.t('label.quiz') }}
                  </th>
                  <th class="px-5 py-3 text-left text-[11px] font-extrabold tracking-[0.12em] uppercase text-slate-400">
                    {{ i18n.t('label.questions') }}
                  </th>
                  <th class="px-5 py-3 text-left text-[11px] font-extrabold tracking-[0.12em] uppercase text-slate-400">
                    {{ i18n.t('label.score') }}
                  </th>
                  <th class="px-5 py-3 text-left text-[11px] font-extrabold tracking-[0.12em] uppercase text-slate-400">
                    {{ i18n.t('label.status') }}
                  </th>
                  <th class="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (quiz of activeCourse()!.quizzes; track quiz.id) {
                  <tr>
                    <td class="px-5 py-4 text-sm font-extrabold text-slate-900">{{ quiz.title }}</td>
                    <td class="px-5 py-4 text-sm font-semibold text-slate-500">{{ quiz.questionsCount }}</td>
                    <td class="px-5 py-4 text-sm font-semibold text-slate-500">
                      {{ quiz.completed ? quiz.scorePercent + '%' : i18n.t('ui.not_available') }}
                    </td>
                    <td class="px-5 py-4">
                      <span
                        class="inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold"
                        [class.bg-emerald-50]="quiz.completed"
                        [class.text-emerald-700]="quiz.completed"
                        [class.bg-rose-50]="!quiz.completed"
                        [class.text-rose-700]="!quiz.completed"
                      >
                        {{ quizStatusLabel(quiz.completed) }}
                      </span>
                    </td>
                    <td class="px-5 py-4 text-right">
                      @if (!quiz.completed) {
                        <button
                          class="h-10 rounded-2xl bg-emerald-600 px-4 text-sm font-bold text-white hover:bg-emerald-500"
                          type="button"
                          (click)="startQuiz(activeCourse()!.id, quiz.id)"
                        >
                          {{ i18n.t('action.start') }}
                        </button>
                      } @else {
                        <button
                          class="h-10 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-900 hover:bg-slate-50"
                          type="button"
                          (click)="toast.show(i18n.t('toast.review_not_implemented'))"
                        >
                          {{ i18n.t('action.review') }}
                        </button>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </section>
  `,
})
export class QuizzesPage {
  private readonly courseStore = inject(CourseStore);
  private readonly orgStore = inject(OrgStore);
  readonly toast = inject(ToastService);
  readonly i18n = inject(I18nStore);

  readonly courses = this.courseStore.courses;
  readonly activeCourse = this.courseStore.activeCourse;
  readonly activeCourseId = this.courseStore.activeCourseId;
  readonly loading = this.courseStore.loading;
  readonly isB2b = this.orgStore.isB2b;

  setActiveCourse(courseId: string) {
    this.courseStore.setActiveCourse(courseId);
  }

  async startQuiz(courseId: string, quizId: string) {
    await this.courseStore.completeQuiz(courseId, quizId);
    this.toast.show(this.i18n.t('toast.quiz_submitted'));
  }

  quizStatusLabel(completed: boolean) {
    return completed ? this.i18n.t('status.completed') : this.i18n.t('status.not_started');
  }

  switchToB2b() {
    this.orgStore.setOrg('B2B Tenant');
  }
}
