import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthSessionService } from './auth-session.service';

const DOMAIN_STORAGE_KEY = 'user-page.domain.v1';
const COMPANY_DOMAIN_HEADER = 'X-Company-Domain';

function readCompanyDomain(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(DOMAIN_STORAGE_KEY);
    if (!raw) return null;
    const trimmed = raw.trim().toLowerCase();
    if (!trimmed) return null;
    const withoutProtocol = trimmed.replace(/^https?:\/\//, '');
    const host = withoutProtocol.split('/')[0];
    return host || null;
  } catch {
    return null;
  }
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const session = inject(AuthSessionService);
  const headers: Record<string, string> = {};
  const domain = readCompanyDomain();

  if (!req.headers.has(COMPANY_DOMAIN_HEADER) && domain) {
    headers[COMPANY_DOMAIN_HEADER] = domain;
  }

  if (!req.headers.has('Authorization')) {
    const token = session.getAccessToken();
    if (token) {
      headers['Authorization'] = `${session.getTokenType()} ${token}`;
    }
  }

  if (Object.keys(headers).length === 0) return next(req);
  return next(req.clone({ setHeaders: headers }));
};
