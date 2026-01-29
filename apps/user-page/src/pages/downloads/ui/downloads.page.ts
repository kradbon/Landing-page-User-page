import { CommonModule, DatePipe } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CourseStore } from '@entities/course/model/course.store';
import { Lesson, LessonMaterial, LessonMaterialFormat } from '@entities/course/model/types';
import { OrgStore } from '@features/org/model/org.store';
import { mockDelay } from '@shared/lib/mock-request';
import { ToastService } from '@shared/ui/toast/toast.service';
import { I18nStore } from '@shared/i18n/i18n.store';

@Component({
  selector: 'page-downloads',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  template: `
    <section class="grid gap-5">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-2xl font-extrabold tracking-tight text-slate-900">{{ i18n.t('heading.downloads') }}</h1>
          <div class="mt-1 text-sm font-semibold text-slate-500">{{ i18n.t('message.downloads_intro') }}</div>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <label class="flex items-center gap-2">
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
      </div>

      @if (!isB2b()) {
        <div class="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm grid gap-2 place-items-center text-center">
          <div class="text-base font-extrabold text-slate-900">{{ i18n.t('message.coming_soon') }}</div>
          <div class="text-sm font-semibold text-slate-500">{{ i18n.t('message.b2b_only_downloads') }}</div>
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
          <div class="text-sm font-extrabold text-slate-500">{{ i18n.t('message.loading_downloads') }}</div>
        </div>
      } @else if (!activeCourse()) {
        <div class="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm grid place-items-center">
          <div class="text-base font-extrabold text-slate-900">{{ i18n.t('message.no_course_selected') }}</div>
        </div>
      } @else {
        <div class="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div class="px-5 py-4 border-b border-slate-100">
            <div class="text-sm font-extrabold text-slate-900">{{ i18n.t('heading.lesson_materials') }}</div>
            <div class="mt-1 text-sm font-semibold text-slate-500">{{ i18n.t('message.lesson_materials_intro') }}</div>
          </div>

          <div class="p-5 grid gap-4">
            @for (lesson of activeCourse()!.lessons; track lesson.id) {
              <div class="rounded-2xl border border-slate-200 bg-white p-4">
                <div class="flex items-start justify-between gap-4 flex-wrap">
                  <div class="min-w-0">
                    <div class="text-sm font-extrabold text-slate-900">{{ lesson.title }}</div>
                    <div class="mt-1 text-sm font-semibold text-slate-500">
                      {{ lesson.scheduledDate | date: 'MMM dd, yyyy' }} |
                      {{ i18n.t('ui.online_copy_status', { status: onlineStatusLabel(lesson.online.status) }) }}
                    </div>
                  </div>
                  <div class="text-sm font-extrabold text-slate-500">
                    {{ i18n.t('ui.items', { count: lesson.materials.length }) }}
                  </div>
                </div>

                @if (lesson.materials.length === 0) {
                  <div class="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-500">
                    {{ i18n.t('message.no_files') }}
                  </div>
                } @else {
                  <div class="mt-3 grid gap-2">
                    @for (item of lesson.materials; track item.id) {
                      <div class="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 flex-wrap">
                        <div class="min-w-0">
                          <div class="truncate text-sm font-extrabold text-slate-900">{{ item.title }}</div>
                          <div class="mt-1 text-xs font-semibold text-slate-500">
                            {{ formatSummary(item) }} |
                            {{
                              i18n.t('ui.updated', {
                                date: (latestUpdatedAt(item) | date: 'MMM dd, yyyy') ?? i18n.t('ui.not_set'),
                              })
                            }}
                          </div>
                        </div>

                        <div class="relative">
                          <button
                            class="h-10 rounded-2xl bg-emerald-600 px-4 text-sm font-bold text-white hover:bg-emerald-500"
                            type="button"
                            (click)="toggleMenu(menuKey(lesson, item), $event)"
                          >
                            {{ i18n.t('action.download') }}
                          </button>

                          @if (isMenuOpen(menuKey(lesson, item))) {
                            <div
                              class="absolute right-0 top-full z-20 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg"
                              (click)="$event.stopPropagation()"
                            >
                              <div class="px-3 py-2 text-xs font-extrabold text-slate-500">{{ i18n.t('action.choose_format') }}</div>
                              <div class="border-t border-slate-100">
                                @for (format of item.formats; track format.fileType) {
                                  <button
                                    class="flex w-full items-start justify-between gap-3 px-3 py-2 text-left hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                                    type="button"
                                    [disabled]="isFormatLocked(lesson, format)"
                                    (click)="downloadFormat(lesson, item, format, $event)"
                                  >
                                    <div class="min-w-0">
                                      <div class="text-sm font-extrabold text-slate-900">
                                        {{ format.fileType }}
                                        @if (isFormatLocked(lesson, format)) {
                                          <span
                                            class="ml-2 inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-extrabold text-slate-600"
                                          >
                                            {{ i18n.t('status.locked') }}
                                          </span>
                                        }
                                      </div>
                                      <div class="mt-0.5 text-xs font-semibold text-slate-500">
                                        {{ format.sizeMb }} MB |
                                        {{
                                          i18n.t('ui.updated', {
                                            date: (format.updatedAt | date: 'MMM dd, yyyy') ?? i18n.t('ui.not_set'),
                                          })
                                        }}
                                      </div>
                                    </div>
                                  </button>
                                }
                              </div>
                            </div>
                          }
                        </div>
                      </div>
                    }
                  </div>
                }
              </div>
            }
          </div>
        </div>
      }
    </section>
  `,
})
export class DownloadsPage {
  private readonly toast = inject(ToastService);
  private readonly courseStore = inject(CourseStore);
  private readonly orgStore = inject(OrgStore);
  readonly i18n = inject(I18nStore);

  readonly courses = this.courseStore.courses;
  readonly activeCourse = this.courseStore.activeCourse;
  readonly activeCourseId = this.courseStore.activeCourseId;
  readonly loading = this.courseStore.loading;
  readonly isB2b = this.orgStore.isB2b;

  private openMenuKey: string | null = null;

  @HostListener('document:click')
  closeMenus() {
    this.openMenuKey = null;
  }

  @HostListener('document:keydown.escape')
  closeMenusOnEscape() {
    this.openMenuKey = null;
  }

  setActiveCourse(courseId: string) {
    this.courseStore.setActiveCourse(courseId);
  }

  menuKey(lesson: Lesson, item: LessonMaterial) {
    return `${lesson.id}:${item.id}`;
  }

  isMenuOpen(key: string) {
    return this.openMenuKey === key;
  }

  toggleMenu(key: string, event: MouseEvent) {
    event.stopPropagation();
    this.openMenuKey = this.openMenuKey === key ? null : key;
  }

  formatSummary(item: LessonMaterial) {
    const formats = item.formats.map((f) => f.fileType).join(', ');
    return item.formats.length === 1
      ? this.i18n.t('ui.format_single', { formats })
      : this.i18n.t('ui.format_multiple', { formats });
  }

  latestUpdatedAt(item: LessonMaterial) {
    if (item.formats.length === 0) return null;
    return item.formats.reduce((max, current) => (current.updatedAt > max ? current.updatedAt : max), item.formats[0].updatedAt);
  }

  isFormatLocked(lesson: Lesson, format: LessonMaterialFormat) {
    if (format.fileType !== 'MP3' && format.fileType !== 'MP4') return false;
    return lesson.online.status !== 'Available' && lesson.online.status !== 'Completed';
  }

  async downloadFormat(lesson: Lesson, item: LessonMaterial, format: LessonMaterialFormat, event: MouseEvent) {
    event.stopPropagation();
    this.openMenuKey = null;
    await mockDelay();
    const key =
      format.fileType === 'MP3' || format.fileType === 'MP4' ? 'toast.download_opening' : 'toast.download_downloading';
    this.toast.show(this.i18n.t(key, { lesson: lesson.title, item: item.title, format: format.fileType }));
  }

  onlineStatusLabel(status: string) {
    switch (status) {
      case 'Available':
        return this.i18n.t('status.available');
      case 'Completed':
        return this.i18n.t('status.completed');
      case 'Locked':
        return this.i18n.t('status.locked');
      case 'In progress':
        return this.i18n.t('status.in_progress');
      default:
        return status;
    }
  }

  switchToB2b() {
    this.orgStore.setOrg('B2B Tenant');
  }
}
