import { Injectable, signal } from '@angular/core';
import { AuthTokenResponse } from './identity.types';

const STORAGE_KEY = 'user-page.session.v1';
const DEFAULT_SESSION_TTL_DAYS = 30;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export type AuthSession = {
  accessToken: string;
  tokenType: string;
  expiresAt: number;
  email?: string;
};

@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  private readonly sessionSignal = signal<AuthSession | null>(loadSession());
  readonly session = this.sessionSignal.asReadonly();

  getSession(): AuthSession | null {
    return this.ensureFreshSession();
  }

  getAccessToken(): string | null {
    return this.ensureFreshSession()?.accessToken ?? null;
  }

  getTokenType(): string {
    return this.ensureFreshSession()?.tokenType ?? 'Bearer';
  }

  setFromTokenResponse(response: AuthTokenResponse, email: string) {
    const session: AuthSession = {
      accessToken: response.access_token,
      tokenType: normalizeTokenType(response.token_type),
      expiresAt: resolveExpiresAt(response),
      email,
    };
    this.setSession(session);
  }

  setSession(session: AuthSession) {
    const normalized: AuthSession = { ...session, tokenType: normalizeTokenType(session.tokenType) };
    this.sessionSignal.set(normalized);
    persistSession(normalized);
  }

  clearSession() {
    this.sessionSignal.set(null);
    persistSession(null);
  }

  private ensureFreshSession(): AuthSession | null {
    const session = this.sessionSignal();
    if (!session) return null;
    if (session.expiresAt <= Date.now()) {
      this.clearSession();
      return null;
    }
    return session;
  }
}

function loadSession(): AuthSession | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!isRecord(parsed)) return null;
    if (typeof parsed['accessToken'] !== 'string') return null;
    if (typeof parsed['expiresAt'] !== 'number' || !Number.isFinite(parsed['expiresAt'])) return null;
    const session: AuthSession = {
      accessToken: parsed['accessToken'],
      tokenType: normalizeTokenType(typeof parsed['tokenType'] === 'string' ? parsed['tokenType'] : undefined),
      expiresAt: parsed['expiresAt'],
      email: typeof parsed['email'] === 'string' ? parsed['email'] : undefined,
    };
    if (session.expiresAt <= Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

function persistSession(session: AuthSession | null) {
  try {
    if (!session) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // ignore storage issues
  }
}

function resolveExpiresAt(response: AuthTokenResponse): number {
  const now = Date.now();
  if (typeof response.expires_at === 'number' && Number.isFinite(response.expires_at)) {
    return response.expires_at < 1_000_000_000_000 ? response.expires_at * 1000 : response.expires_at;
  }
  if (typeof response.expires_at === 'string') {
    const parsedDate = Date.parse(response.expires_at);
    if (!Number.isNaN(parsedDate)) return parsedDate;
    const parsedNumber = Number(response.expires_at);
    if (!Number.isNaN(parsedNumber)) {
      return parsedNumber < 1_000_000_000_000 ? parsedNumber * 1000 : parsedNumber;
    }
  }
  if (typeof response.expires_in === 'number' && Number.isFinite(response.expires_in)) {
    return now + Math.max(0, response.expires_in) * 1000;
  }
  return now + DEFAULT_SESSION_TTL_DAYS * MS_PER_DAY;
}

function normalizeTokenType(tokenType?: string): string {
  if (!tokenType) return 'Bearer';
  return tokenType.toLowerCase() === 'bearer' ? 'Bearer' : tokenType;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
