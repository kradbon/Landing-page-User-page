import { Injectable, computed, inject, signal } from '@angular/core';
import { AuthSessionService } from '@shared/api/auth-session.service';
import { IdentityApi } from '@shared/api/identity.api';

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
    } finally {
      this.loading.set(false);
    }
  }

  async signOut() {
    this.session.clearSession();
  }
}
