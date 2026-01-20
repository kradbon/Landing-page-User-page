import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { AuthSessionService } from '@shared/api/auth-session.service';
import { IdentityApi } from '@shared/api/identity.api';

const OFFLINE_SESSION_TTL_DAYS = 30;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly api = inject(IdentityApi);
  private readonly session = inject(AuthSessionService);

  readonly loading = signal(false);
  readonly isSignedIn = computed(() => Boolean(this.session.getSession()));
  readonly email = computed(() => this.session.getSession()?.email ?? '');

  async signIn(email: string, password: string) {
    this.loading.set(true);
    try {
      const response = await this.api.login({ email, password });
      if (!response?.access_token) {
        throw new Error('Access token missing');
      }
      this.session.setFromTokenResponse(response, email);
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 0) {
        this.session.setSession({
          accessToken: `offline-${Date.now()}`,
          tokenType: 'Bearer',
          expiresAt: Date.now() + OFFLINE_SESSION_TTL_DAYS * MS_PER_DAY,
          email,
        });
        return;
      }
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  async signOut() {
    this.session.clearSession();
  }
}
