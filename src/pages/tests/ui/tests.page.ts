import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CourseStore } from '@entities/course/model/course.store';
import { OrgStore } from '@features/org/model/org.store';
import { ToastService } from '@shared/ui/toast/toast.service';
import { I18nStore } from '@shared/i18n/i18n.store';

@Component({
  selector: 'page-tests',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  template: `
    <section class="grid gap-5">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-2xl font-extrabold tracking-tight text-slate-900">{{ i18n.t('heading.tests') }}</h1>
          <div class="mt-1 text-sm font-semibold text-slate-500">{{ i18n.t('message.tests_intro') }}</div>
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
          <div class="text-sm font-semibold text-slate-500">{{ i18n.t('message.b2b_only_tests') }}</div>
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
          <div class="text-sm font-extrabold text-slate-500">{{ i18n.t('message.loading_tests') }}</div>
        </div>
      } @else if (!activeCourse()) {
        <div class="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm grid place-items-center">
          <div class="text-base font-extrabold text-slate-900">{{ i18n.t('message.no_course_selected') }}</div>
        </div>
      } @else {
        <div class="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div class="px-5 py-4 border-b border-slate-100">
            <div class="text-sm font-extrabold text-slate-900">{{ activeCourse()!.title }}</div>
            <div class="mt-1 text-sm font-semibold text-slate-500">
              {{ i18n.t('ui.course_progress', { percent: activeCourse()!.progress }) }}
            </div>
          </div>
          <div class="p-5 grid gap-3">
            @for (test of activeCourse()!.tests; track test.id) {
              <div class="rounded-2xl border border-slate-200 bg-white p-4 flex items-start justify-between gap-4 flex-wrap">
                <div class="min-w-0">
                  <div class="text-sm font-extrabold text-slate-900">{{ test.title }}</div>
                  <div class="mt-1 text-sm font-semibold text-slate-500">
                    {{
                      i18n.t('ui.due', {
                        date: (test.dueDate | date: 'MMM dd, yyyy') ?? i18n.t('ui.not_set'),
                      })
                    }}
                  </div>
                  <div class="mt-2 flex flex-wrap gap-2">
                    <span
                      class="inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold"
                      [class.bg-emerald-50]="test.status === 'Submitted'"
                      [class.text-emerald-700]="test.status === 'Submitted'"
                      [class.bg-sky-50]="test.status === 'In progress'"
                      [class.text-sky-700]="test.status === 'In progress'"
                      [class.bg-slate-100]="test.status === 'Not started'"
                      [class.text-slate-700]="test.status === 'Not started'"
                    >
                      {{ statusLabel(test.status) }}
                    </span>
                    <span class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-extrabold text-slate-700">
                      {{ i18n.t('ui.score', { score: test.status === 'Submitted' ? test.scorePercent + '%' : i18n.t('ui.not_available') }) }}
                    </span>
                  </div>
                </div>
                <div>
                  @if (test.status !== 'Submitted') {
                    <button
                      class="h-10 rounded-2xl bg-emerald-600 px-4 text-sm font-bold text-white hover:bg-emerald-500"
                      type="button"
                      (click)="submitTest(activeCourse()!.id, test.id)"
                    >
                      {{ i18n.t('action.submit_demo') }}
                    </button>
                  } @else {
                    <button
                      class="h-10 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-900 hover:bg-slate-50"
                      type="button"
                      (click)="toast.show(i18n.t('toast.result_not_implemented'))"
                    >
                      {{ i18n.t('action.view_result') }}
                    </button>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }
    </section>
  `,
})
export class TestsPage {
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

  async submitTest(courseId: string, testId: string) {
    await this.courseStore.submitTest(courseId, testId);
    this.toast.show(this.i18n.t('toast.test_submitted'));
  }

  statusLabel(status: string) {
    switch (status) {
      case 'Submitted':
        return this.i18n.t('status.submitted');
      case 'In progress':
        return this.i18n.t('status.in_progress');
      default:
        return this.i18n.t('status.not_started');
    }
  }

  switchToB2b() {
    this.orgStore.setOrg('B2B Tenant');
  }
}
