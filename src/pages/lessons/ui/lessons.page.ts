import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CourseStore } from '@entities/course/model/course.store';
import { Lesson } from '@entities/course/model/types';
import { OrgStore } from '@features/org/model/org.store';
import { ToastService } from '@shared/ui/toast/toast.service';
import { I18nStore } from '@shared/i18n/i18n.store';

@Component({
  selector: 'page-lessons',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  template: `
    <section class="grid gap-5">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-2xl font-extrabold tracking-tight text-slate-900">{{ i18n.t('heading.lessons') }}</h1>
          <div class="mt-1 text-sm font-semibold text-slate-500">{{ i18n.t('message.lessons_intro') }}</div>
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
          <div class="text-sm font-semibold text-slate-500">{{ i18n.t('message.b2b_only_lessons') }}</div>
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
          <div class="text-sm font-extrabold text-slate-500">{{ i18n.t('message.loading_lessons') }}</div>
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
                    {{ i18n.t('label.lesson') }}
                  </th>
                  <th class="px-5 py-3 text-left text-[11px] font-extrabold tracking-[0.12em] uppercase text-slate-400">
                    {{ i18n.t('label.date') }}
                  </th>
                  <th class="px-5 py-3 text-left text-[11px] font-extrabold tracking-[0.12em] uppercase text-slate-400">
                    {{ i18n.t('label.duration') }}
                  </th>
                  <th class="px-5 py-3 text-left text-[11px] font-extrabold tracking-[0.12em] uppercase text-slate-400">
                    {{ i18n.t('label.status') }}
                  </th>
                  <th class="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (lesson of activeCourse()!.lessons; track lesson.id) {
                  <tr>
                    <td class="px-5 py-4">
                      <div class="text-sm font-extrabold text-slate-900">{{ lesson.title }}</div>
                      <div class="mt-1 text-xs font-semibold text-slate-500">
                        {{ modeLabel(lesson.mode) }} • {{ offlineLabel(lesson) }}
                      </div>
                    </td>
                    <td class="px-5 py-4 text-sm font-semibold text-slate-500">{{ lesson.scheduledDate | date: 'MMM dd, yyyy' }}</td>
                    <td class="px-5 py-4 text-sm font-semibold text-slate-500">
                      {{ i18n.t('ui.unit_minutes', { minutes: lesson.durationMinutes }) }}
                    </td>
                    <td class="px-5 py-4">
                      <div class="flex flex-wrap gap-2">
                        <span class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-extrabold text-slate-700">
                          {{ i18n.t('ui.offline_status', { status: offlineLabel(lesson) }) }}
                        </span>
                        <span
                          class="inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold"
                          [class.bg-emerald-50]="lesson.online.status === 'Available' || lesson.online.status === 'Completed'"
                          [class.text-emerald-700]="lesson.online.status === 'Available' || lesson.online.status === 'Completed'"
                          [class.bg-slate-100]="lesson.online.status === 'Locked'"
                          [class.text-slate-700]="lesson.online.status === 'Locked'"
                          [class.bg-sky-50]="lesson.online.status === 'In progress'"
                          [class.text-sky-700]="lesson.online.status === 'In progress'"
                        >
                          {{ i18n.t('ui.online_copy_status', { status: onlineStatusLabel(lesson.online.status) }) }}
                        </span>
                      </div>
                    </td>
                    <td class="px-5 py-4 text-right">
                      <button
                        class="h-10 rounded-2xl px-4 text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-500 disabled:bg-slate-100 disabled:text-slate-500 disabled:hover:bg-slate-100 disabled:cursor-not-allowed"
                        type="button"
                        [disabled]="!canOpenOnline(lesson)"
                        (click)="openOnline(activeCourse()!.id, lesson)"
                      >
                        {{ actionLabel(lesson) }}
                      </button>
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
export class LessonsPage {
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

  offlineLabel(lesson: Lesson) {
    if (lesson.offlineStatus === 'Completed') return this.i18n.t('status.completed');
    if (lesson.offlineStatus === 'Cancelled') return this.i18n.t('status.cancelled');
    return this.i18n.t('status.scheduled');
  }

  modeLabel(mode: Lesson['mode']) {
    return mode === 'Online' ? this.i18n.t('status.online') : this.i18n.t('status.offline');
  }

  onlineStatusLabel(status: Lesson['online']['status']) {
    switch (status) {
      case 'Available':
        return this.i18n.t('status.available');
      case 'Completed':
        return this.i18n.t('status.completed');
      case 'In progress':
        return this.i18n.t('status.in_progress');
      default:
        return this.i18n.t('status.locked');
    }
  }

  canOpenOnline(lesson: Lesson) {
    return lesson.online.status !== 'Locked';
  }

  actionLabel(lesson: Lesson) {
    switch (lesson.online.status) {
      case 'Available':
        return this.i18n.t('action.start');
      case 'In progress':
        return this.i18n.t('action.continue');
      case 'Completed':
        return this.i18n.t('action.review');
      default:
        return this.i18n.t('message.coming_soon');
    }
  }

  async openOnline(courseId: string, lesson: Lesson) {
    if (!this.canOpenOnline(lesson)) return;
    await this.courseStore.startOrContinueLesson(courseId, lesson.id);
    this.toast.show(
      this.i18n.t(lesson.online.status === 'Available' ? 'toast.lesson_started' : 'toast.opening_lesson'),
    );
  }

  switchToB2b() {
    this.orgStore.setOrg('B2B Tenant');
  }
}
