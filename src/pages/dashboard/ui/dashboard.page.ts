import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CourseStore } from '@entities/course/model/course.store';
import { UserStore } from '@entities/user/model/user.store';
import { OrgStore } from '@features/org/model/org.store';
import { I18nStore } from '@shared/i18n/i18n.store';

@Component({
  selector: 'page-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="grid gap-5">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {{ i18n.t('message.welcome_user', { name: user().first_name }) }}
          </h1>
          <div class="mt-1 text-sm font-semibold text-slate-500">{{ i18n.t('message.dashboard_continue') }}</div>
        </div>
        @if (!isB2b()) {
          <button
            class="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-900 hover:bg-slate-50"
            type="button"
            (click)="switchToB2b()"
          >
            {{ i18n.t('action.switch_to_b2b') }}
          </button>
        } @else {
          <button
            class="h-11 rounded-2xl bg-emerald-600 px-4 text-sm font-bold text-white hover:bg-emerald-500"
            type="button"
            (click)="goToCourses()"
          >
            {{ i18n.t('action.my_courses') }}
          </button>
        }
      </div>

      @if (!isB2b()) {
        <div class="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm grid gap-2 place-items-center text-center">
          <div class="text-base font-extrabold text-slate-900">{{ i18n.t('message.coming_soon') }}</div>
          <div class="text-sm font-semibold text-slate-500">{{ i18n.t('message.b2b_only_dashboard') }}</div>
        </div>
      } @else if (loading()) {
        <div class="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm grid place-items-center">
          <div class="text-sm font-extrabold text-slate-500">{{ i18n.t('message.loading_dashboard') }}</div>
        </div>
      } @else {
        <div class="grid gap-3 sm:grid-cols-3">
          <div class="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div class="text-xs font-extrabold tracking-[0.12em] uppercase text-slate-400">
              {{ i18n.t('dashboard.courses_in_progress') }}
            </div>
            <div class="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">{{ coursesInProgressCount() }}</div>
          </div>
          <div class="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div class="text-xs font-extrabold tracking-[0.12em] uppercase text-slate-400">
              {{ i18n.t('dashboard.lessons_completed') }}
            </div>
            <div class="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">{{ completedLessonsCount() }}</div>
          </div>
          <div class="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div class="text-xs font-extrabold tracking-[0.12em] uppercase text-slate-400">
              {{ i18n.t('dashboard.next_up') }}
            </div>
            @if (nextUp()) {
              <div class="mt-2 text-sm font-extrabold text-slate-900">{{ nextUp()!.lesson.title }}</div>
              <div class="mt-1 text-sm font-semibold text-slate-500">{{ nextUp()!.course.title }}</div>
            } @else {
              <div class="mt-2 text-sm font-extrabold text-slate-900">{{ i18n.t('message.all_caught_up') }}</div>
              <div class="mt-1 text-sm font-semibold text-slate-500">{{ i18n.t('message.great_work') }}</div>
            }
          </div>
        </div>

        <div class="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div class="flex items-center justify-between gap-3 px-5 py-4">
            <div class="text-sm font-extrabold text-slate-900">{{ i18n.t('action.my_courses') }}</div>
            <button
              class="h-10 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-900 hover:bg-slate-50"
              type="button"
              (click)="goToCourses()"
            >
              {{ i18n.t('action.view_all') }}
            </button>
          </div>
          <div class="divide-y divide-slate-100">
            @for (course of courses(); track course.id) {
              <div class="px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
                <div class="min-w-0">
                  <div class="truncate text-sm font-extrabold text-slate-900">{{ course.title }}</div>
                  <div class="mt-1 text-sm font-semibold text-slate-500">
                    {{ i18n.t('ui.teacher', { name: course.teacher }) }}
                  </div>
                </div>
                <div class="flex items-center gap-3 flex-wrap">
                  <div class="flex items-center gap-3 min-w-[190px]">
                    <div class="h-2 w-36 rounded-full bg-slate-100 overflow-hidden">
                      <div class="h-full rounded-full bg-emerald-500" [style.width.%]="course.progress"></div>
                    </div>
                    <div class="text-sm font-extrabold text-slate-600">{{ course.progress }}%</div>
                  </div>
                  <button
                    class="h-10 rounded-2xl bg-slate-900 px-4 text-sm font-bold text-white hover:bg-slate-800"
                    type="button"
                    (click)="continueCourse(course.id)"
                  >
                    {{ i18n.t('action.continue') }}
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </section>
  `,
})
export class DashboardPage {
  private readonly router = inject(Router);
  private readonly userStore = inject(UserStore);
  private readonly courseStore = inject(CourseStore);
  private readonly orgStore = inject(OrgStore);
  readonly i18n = inject(I18nStore);

  readonly user = this.userStore.user;
  readonly courses = this.courseStore.courses;
  readonly loading = this.courseStore.loading;
  readonly coursesInProgressCount = this.courseStore.coursesInProgressCount;
  readonly completedLessonsCount = this.courseStore.completedLessonsCount;
  readonly nextUp = this.courseStore.nextUp;
  readonly isB2b = this.orgStore.isB2b;

  goToCourses() {
    void this.router.navigateByUrl('/courses');
  }

  continueCourse(courseId: string) {
    this.courseStore.setActiveCourse(courseId);
    void this.router.navigateByUrl('/lessons');
  }

  switchToB2b() {
    this.orgStore.setOrg('B2B Tenant');
  }
}
