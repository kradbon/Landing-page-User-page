import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CourseStore } from '@entities/course/model/course.store';
import { OrgStore } from '@features/org/model/org.store';
import { IconComponent } from '@shared/ui/icon/icon.component';
import { I18nStore } from '@shared/i18n/i18n.store';

@Component({
  selector: 'page-courses',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <section class="grid gap-5">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-2xl font-extrabold tracking-tight text-slate-900">{{ i18n.t('heading.courses') }}</h1>
          <div class="mt-1 text-sm font-semibold text-slate-500">{{ i18n.t('message.courses_intro') }}</div>
        </div>
      </div>

      @if (!isB2b()) {
        <div class="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm grid gap-2 place-items-center text-center">
          <div class="text-base font-extrabold text-slate-900">{{ i18n.t('message.coming_soon') }}</div>
          <div class="text-sm font-semibold text-slate-500">{{ i18n.t('message.b2b_only_courses') }}</div>
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
          <div class="text-sm font-extrabold text-slate-500">{{ i18n.t('message.loading_courses') }}</div>
        </div>
      } @else if (courses().length === 0) {
        <div class="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm grid place-items-center">
          <div class="text-base font-extrabold text-slate-900">{{ i18n.t('message.no_courses') }}</div>
        </div>
      } @else {
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          @for (course of courses(); track course.id) {
            <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm grid gap-3">
              <div class="text-base font-extrabold tracking-tight text-slate-900">{{ course.title }}</div>
              <div class="text-sm font-semibold text-slate-500">{{ i18n.t('ui.teacher', { name: course.teacher }) }}</div>
              <div class="text-sm font-semibold text-slate-600">{{ course.description }}</div>

              <div class="mt-1 grid gap-2">
                <div class="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div class="h-full rounded-full bg-emerald-500" [style.width.%]="course.progress"></div>
                </div>
                <div class="text-sm font-extrabold text-slate-600">
                  {{ i18n.t('ui.course_progress', { percent: course.progress }) }}
                </div>
              </div>

              <div class="mt-2 flex flex-wrap gap-2">
                <button
                  class="h-10 rounded-2xl bg-slate-900 px-4 text-sm font-bold text-white hover:bg-slate-800 inline-flex items-center gap-2"
                  type="button"
                  (click)="continueCourse(course.id)"
                >
                  <shared-icon name="play" [size]="18"></shared-icon>
                  {{ i18n.t('action.continue') }}
                </button>
                <button
                  class="h-10 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-900 hover:bg-slate-50 inline-flex items-center gap-2"
                  type="button"
                  (click)="openLessons(course.id)"
                >
                  <shared-icon name="lessons" [size]="18"></shared-icon>
                  {{ i18n.t('nav.lessons') }}
                </button>
                <button
                  class="h-10 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-900 hover:bg-slate-50 inline-flex items-center gap-2"
                  type="button"
                  (click)="openQuizzes(course.id)"
                >
                  <shared-icon name="quizzes" [size]="18"></shared-icon>
                  {{ i18n.t('nav.quizzes') }}
                </button>
                <button
                  class="h-10 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-900 hover:bg-slate-50 inline-flex items-center gap-2"
                  type="button"
                  (click)="openTests(course.id)"
                >
                  <shared-icon name="tests" [size]="18"></shared-icon>
                  {{ i18n.t('nav.tests') }}
                </button>
              </div>
            </div>
          }
        </div>
      }
    </section>
  `,
})
export class CoursesPage {
  private readonly router = inject(Router);
  private readonly courseStore = inject(CourseStore);
  private readonly orgStore = inject(OrgStore);
  readonly i18n = inject(I18nStore);

  readonly courses = this.courseStore.courses;
  readonly loading = this.courseStore.loading;
  readonly isB2b = this.orgStore.isB2b;

  continueCourse(courseId: string) {
    this.courseStore.setActiveCourse(courseId);
    void this.router.navigateByUrl('/lessons');
  }

  openLessons(courseId: string) {
    this.courseStore.setActiveCourse(courseId);
    void this.router.navigateByUrl('/lessons');
  }

  openQuizzes(courseId: string) {
    this.courseStore.setActiveCourse(courseId);
    void this.router.navigateByUrl('/quizzes');
  }

  openTests(courseId: string) {
    this.courseStore.setActiveCourse(courseId);
    void this.router.navigateByUrl('/tests');
  }

  switchToB2b() {
    this.orgStore.setOrg('B2B Tenant');
  }
}
