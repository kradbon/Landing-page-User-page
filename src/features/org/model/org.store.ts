import { Injectable, computed, signal } from '@angular/core';

export type OrgId = 'Marketplace' | 'B2B Tenant' | 'Demo';

const STORAGE_KEY = 'user-page.org.v1';

function loadOrg(): OrgId {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === 'Marketplace' || raw === 'B2B Tenant' || raw === 'Demo') return raw;
  } catch {
    // ignore
  }
  return 'B2B Tenant';
}

function saveOrg(org: OrgId) {
  try {
    window.localStorage.setItem(STORAGE_KEY, org);
  } catch {
    // ignore
  }
}

@Injectable({ providedIn: 'root' })
export class OrgStore {
  readonly org = signal<OrgId>(loadOrg());
  readonly isB2b = computed(() => this.org() === 'B2B Tenant');

  setOrg(org: OrgId) {
    this.org.set(org);
    saveOrg(org);
  }
}

