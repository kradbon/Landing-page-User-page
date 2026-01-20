import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserStore } from '@entities/user/model/user.store';
import { StudentProfile, User } from '@entities/user/model/types';
import { ToastService } from '@shared/ui/toast/toast.service';
import { initials } from '@shared/lib/initials';
import { IconComponent } from '@shared/ui/icon/icon.component';
import { I18nStore, isSupportedLocale } from '@shared/i18n/i18n.store';

@Component({
  selector: 'page-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <section class="grid gap-5">
        <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-2xl font-extrabold tracking-tight text-slate-900">{{ i18n.t('heading.profile') }}</h1>
          <div class="mt-1 text-sm font-semibold text-slate-500">{{ i18n.t('message.profile_intro') }}</div>
        </div>
        <button
          class="h-11 rounded-2xl bg-emerald-600 px-4 text-sm font-bold text-white hover:bg-emerald-500"
          type="button"
          (click)="save()"
        >
          {{ i18n.t('action.save_changes') }}
        </button>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-100">
          <div class="text-sm font-extrabold text-slate-900">{{ i18n.t('heading.user') }}</div>
        </div>
        <div class="p-5 grid gap-4 md:grid-cols-2">
          <div class="md:col-span-2 flex items-center justify-between gap-4 flex-wrap">
            <div class="flex items-center gap-4">
              <div class="h-16 w-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black overflow-hidden">
                @if (userForm.avatar_url) {
                  <img class="h-full w-full object-cover" [src]="userForm.avatar_url" [attr.alt]="i18n.t('label.profile_photo')" />
                } @else {
                  {{ formInitials() }}
                }
              </div>
              <div>
                <div class="text-sm font-extrabold text-slate-900">{{ i18n.t('label.profile_photo') }}</div>
                <div class="mt-1 text-xs font-semibold text-slate-500">{{ i18n.t('message.profile_photo_intro') }}</div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <input #avatarFile class="hidden" type="file" accept="image/*" (change)="onAvatarFileChange($event)" />
              <button
                class="h-10 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-900 hover:bg-slate-50"
                type="button"
                (click)="avatarFile.click()"
              >
                {{ i18n.t('action.change') }}
              </button>
              @if (userForm.avatar_url) {
                <button
                  class="h-10 rounded-2xl border border-rose-200 bg-rose-50 px-4 text-sm font-bold text-rose-700 hover:bg-rose-100"
                  type="button"
                  (click)="removeAvatar()"
                >
                  {{ i18n.t('action.remove') }}
                </button>
              }
            </div>
          </div>
          <label class="grid gap-1">
            <span class="text-xs font-extrabold text-slate-500">{{ i18n.t('label.first_name') }}</span>
            <input class="tw-field" type="text" [(ngModel)]="userForm.first_name" />
          </label>
          <label class="grid gap-1">
            <span class="text-xs font-extrabold text-slate-500">{{ i18n.t('label.last_name') }}</span>
            <input class="tw-field" type="text" [(ngModel)]="userForm.last_name" />
          </label>
          <label class="grid gap-1">
            <span class="text-xs font-extrabold text-slate-500">{{ i18n.t('label.email') }}</span>
            <input class="tw-field" type="email" [(ngModel)]="userForm.email" />
          </label>
          <label class="grid gap-1">
            <span class="text-xs font-extrabold text-slate-500">{{ i18n.t('label.phone') }}</span>
            <input class="tw-field" type="text" [(ngModel)]="userForm.phone" />
          </label>
          <label class="grid gap-1">
            <span class="text-xs font-extrabold text-slate-500">{{ i18n.t('label.position_title') }}</span>
            <input class="tw-field" type="text" [(ngModel)]="userForm.position_title" />
          </label>
          <label class="grid gap-1">
            <span class="text-xs font-extrabold text-slate-500">{{ i18n.t('label.date_of_birth') }}</span>
            <div class="relative">
              <input class="tw-date" type="date" [(ngModel)]="userForm.date_of_birth" />
              <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                <shared-icon name="calendar" [size]="18"></shared-icon>
              </span>
            </div>
          </label>
          <label class="grid gap-1">
            <span class="text-xs font-extrabold text-slate-500">{{ i18n.t('label.gender') }}</span>
            <select class="tw-field" [(ngModel)]="userForm.gender">
              <option value="Male">{{ i18n.t('gender.male') }}</option>
              <option value="Female">{{ i18n.t('gender.female') }}</option>
              <option value="Other">{{ i18n.t('gender.other') }}</option>
            </select>
          </label>
          <label class="grid gap-1">
            <span class="text-xs font-extrabold text-slate-500">{{ i18n.t('label.language_preference') }}</span>
            <select class="tw-field" [ngModel]="userForm.language_preference" (ngModelChange)="setLanguagePreference($event)">
              @for (option of languageOptions; track option.id) {
                <option [value]="option.id">{{ option.label }}</option>
              }
            </select>
          </label>
          <label class="grid gap-1 md:col-span-2">
            <span class="text-xs font-extrabold text-slate-500">{{ i18n.t('label.bio') }}</span>
            <textarea class="tw-textarea min-h-[120px]" [(ngModel)]="userForm.bio"></textarea>
          </label>
        </div>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-100">
          <div class="text-sm font-extrabold text-slate-900">{{ i18n.t('heading.student_profile') }}</div>
        </div>
        <div class="p-5 grid gap-4 md:grid-cols-2">
          <label class="grid gap-1">
            <span class="text-xs font-extrabold text-slate-500">{{ i18n.t('label.grade_level') }}</span>
            <input class="tw-field" type="text" [(ngModel)]="studentForm.grade_level" />
          </label>
          <label class="grid gap-1">
            <span class="text-xs font-extrabold text-slate-500">{{ i18n.t('label.enrollment_date') }}</span>
            <div class="relative">
              <input class="tw-date" type="date" [(ngModel)]="studentForm.enrollment_date" />
              <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                <shared-icon name="calendar" [size]="18"></shared-icon>
              </span>
            </div>
          </label>
          <label class="grid gap-1">
            <span class="text-xs font-extrabold text-slate-500">{{ i18n.t('label.parent_guardian_name') }}</span>
            <input class="tw-field" type="text" [(ngModel)]="parentContact.name" />
          </label>
          <label class="grid gap-1">
            <span class="text-xs font-extrabold text-slate-500">{{ i18n.t('label.parent_guardian_phone') }}</span>
            <input class="tw-field" type="text" [(ngModel)]="parentContact.phone" />
          </label>
          <label class="grid gap-1">
            <span class="text-xs font-extrabold text-slate-500">{{ i18n.t('label.preferred_time') }}</span>
            <select class="tw-field" [(ngModel)]="extraInfo.preferred_time">
              <option value="">{{ i18n.t('time.select') }}</option>
              <option value="Mornings">{{ i18n.t('time.mornings') }}</option>
              <option value="Afternoons">{{ i18n.t('time.afternoons') }}</option>
              <option value="Evenings">{{ i18n.t('time.evenings') }}</option>
            </select>
          </label>
          <label class="grid gap-1 md:col-span-2">
            <span class="text-xs font-extrabold text-slate-500">{{ i18n.t('label.notes') }}</span>
            <textarea class="tw-textarea min-h-[140px]" [(ngModel)]="extraInfo.notes"></textarea>
          </label>
        </div>
      </div>
    </section>
  `,
})
export class ProfilePage implements OnInit {
  private readonly store = inject(UserStore);
  private readonly toast = inject(ToastService);
  readonly i18n = inject(I18nStore);
  readonly languageOptions = this.i18n.languageOptions;

  userForm: User = blankUser();
  studentForm: StudentProfile = blankStudentProfile();
  parentContact: ParentContact = { name: '', phone: '' };
  extraInfo: ExtraInfo = { preferred_time: '', notes: '' };

  ngOnInit() {
    this.userForm = { ...this.store.user() };
    this.studentForm = { ...this.store.studentProfile() };
    this.parentContact = parseJsonRecord(this.studentForm.parent_contact_json, { name: '', phone: '' });
    this.extraInfo = parseJsonRecord(this.studentForm.extra_info, { preferred_time: '', notes: '' });
    if (!isSupportedLocale(this.userForm.language_preference)) {
      this.userForm.language_preference = this.i18n.locale();
    }
  }

  async save() {
    await Promise.all([
      this.store.updateUser(this.userForm),
      this.store.updateStudentProfile({
        ...this.studentForm,
        parent_contact_json: JSON.stringify(this.parentContact, null, 2),
        extra_info: JSON.stringify(this.extraInfo, null, 2),
      }),
    ]);
    this.toast.show(this.i18n.t('toast.profile_saved'));
  }

  setLanguagePreference(value: string) {
    if (!isSupportedLocale(value)) return;
    this.userForm.language_preference = value;
    this.i18n.setLocale(value);
  }

  formInitials() {
    const label = `${this.userForm.first_name} ${this.userForm.last_name}`.trim() || this.userForm.email;
    return initials(label);
  }

  async onAvatarFileChange(event: Event) {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!input || !file) return;

    if (!file.type.startsWith('image/')) {
      this.toast.show(this.i18n.t('toast.image_invalid'));
      input.value = '';
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      this.toast.show(this.i18n.t('toast.image_too_large'));
      input.value = '';
      return;
    }

    this.userForm.avatar_url = await readFileAsDataUrl(file);
    input.value = '';
  }

  removeAvatar() {
    this.userForm.avatar_url = '';
  }
}

function blankUser(): User {
  return {
    email: '',
    password_hash: '',
    first_name: '',
    last_name: '',
    avatar_url: '',
    phone: '',
    bio: '',
    position_title: '',
    date_of_birth: '',
    gender: '',
    language_preference: '',
  };
}

function blankStudentProfile(): StudentProfile {
  return { grade_level: '', enrollment_date: '', parent_contact_json: '', extra_info: '' };
}

type ParentContact = {
  name: string;
  phone: string;
};

type ExtraInfo = {
  preferred_time: string;
  notes: string;
};

function parseJsonRecord<T extends Record<string, unknown>>(raw: string, fallback: T): T {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return fallback;
    return { ...fallback, ...(parsed as Record<string, unknown>) } as T;
  } catch {
    return fallback;
  }
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.readAsDataURL(file);
  });
}
