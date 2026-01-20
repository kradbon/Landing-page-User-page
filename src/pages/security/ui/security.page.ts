import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthStore } from '@features/auth/model/auth.store';
import { mockDelay } from '@shared/lib/mock-request';
import { ToastService } from '@shared/ui/toast/toast.service';
import { I18nStore } from '@shared/i18n/i18n.store';

@Component({
  selector: 'page-security',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="grid gap-5">
      <div>
        <h1 class="text-2xl font-extrabold tracking-tight text-slate-900">{{ i18n.t('heading.security') }}</h1>
        <div class="mt-1 text-sm font-semibold text-slate-500">{{ i18n.t('message.security_intro') }}</div>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-100">
          <div class="text-sm font-extrabold text-slate-900">{{ i18n.t('heading.change_password') }}</div>
        </div>
        <div class="p-5 grid gap-4 md:grid-cols-3">
          <label class="grid gap-1">
            <span class="text-xs font-extrabold text-slate-500">{{ i18n.t('label.current_password') }}</span>
            <input class="tw-field" type="password" [(ngModel)]="currentPassword" autocomplete="current-password" />
          </label>
          <label class="grid gap-1">
            <span class="text-xs font-extrabold text-slate-500">{{ i18n.t('label.new_password') }}</span>
            <input class="tw-field" type="password" [(ngModel)]="newPassword" autocomplete="new-password" />
          </label>
          <label class="grid gap-1">
            <span class="text-xs font-extrabold text-slate-500">{{ i18n.t('label.confirm_new_password') }}</span>
            <input class="tw-field" type="password" [(ngModel)]="confirmNewPassword" autocomplete="new-password" />
          </label>
        </div>
        <div class="px-5 pb-5 flex justify-end">
          <button
            class="h-11 rounded-2xl bg-slate-900 px-4 text-sm font-bold text-white hover:bg-slate-800"
            type="button"
            (click)="changePassword()"
          >
            {{ i18n.t('action.update_password') }}
          </button>
        </div>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-100">
          <div class="text-sm font-extrabold text-slate-900">{{ i18n.t('heading.session') }}</div>
        </div>
        <div class="p-5 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div class="text-sm font-semibold text-slate-700">{{ i18n.t('message.sign_out_device') }}</div>
            <div class="mt-1 text-sm font-semibold text-slate-500">{{ auth.email() }}</div>
          </div>
          <button
            class="h-11 rounded-2xl border border-rose-200 bg-rose-50 px-4 text-sm font-bold text-rose-700 hover:bg-rose-100"
            type="button"
            (click)="signOut()"
          >
            {{ i18n.t('action.sign_out') }}
          </button>
        </div>
      </div>
    </section>
  `,
})
export class SecurityPage {
  readonly auth = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  readonly i18n = inject(I18nStore);

  currentPassword = '';
  newPassword = '';
  confirmNewPassword = '';

  async changePassword() {
    if (!this.currentPassword.trim() || !this.newPassword.trim() || !this.confirmNewPassword.trim()) {
      this.toast.show(this.i18n.t('toast.password_required'));
      return;
    }
    if (this.newPassword.trim().length < 8) {
      this.toast.show(this.i18n.t('toast.password_length'));
      return;
    }
    if (this.newPassword.trim() !== this.confirmNewPassword.trim()) {
      this.toast.show(this.i18n.t('toast.password_mismatch'));
      return;
    }
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmNewPassword = '';
    await mockDelay();
    this.toast.show(this.i18n.t('toast.password_updated'));
  }

  async signOut() {
    await this.auth.signOut();
    void this.router.navigateByUrl('/login');
    this.toast.show(this.i18n.t('toast.signed_out'));
  }
}
