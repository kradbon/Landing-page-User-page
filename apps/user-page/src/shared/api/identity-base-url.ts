import { InjectionToken, inject } from '@angular/core';
import { DomainStore } from '@features/domain/model/domain.store';

const API_SCHEME = 'http';

function normalizeDomain(domain: string): string {
  if (!domain) return '';
  const withoutProtocol = domain.trim().replace(/^https?:\/\//, '');
  return withoutProtocol.replace(/\/+$/, '');
}

export const IDENTITY_API_BASE_URL = new InjectionToken<string>('identity api base url', {
  providedIn: 'root',
  factory: () => {
    const domainStore = inject(DomainStore);
    const normalized = normalizeDomain(domainStore.fullDomain());
    return normalized ? `${API_SCHEME}://${normalized}` : '';
  },
});
