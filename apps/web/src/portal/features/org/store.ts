import { createStore, useStore } from "@/portal/store";

export type OrgId = "Marketplace" | "B2B Tenant" | "Demo";

const STORAGE_KEY = "user-page.org.v1";

function loadOrg(): OrgId {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === "Marketplace" || raw === "B2B Tenant" || raw === "Demo") return raw;
  } catch {
    // ignore
  }
  return "B2B Tenant";
}

function saveOrg(org: OrgId) {
  try {
    window.localStorage.setItem(STORAGE_KEY, org);
  } catch {
    // ignore
  }
}

const store = createStore<{ org: OrgId }>({ org: typeof window === "undefined" ? "B2B Tenant" : loadOrg() });

export function useOrg() {
  return useStore(store, (state) => state.org);
}

export function useIsB2b() {
  return useStore(store, (state) => state.org === "B2B Tenant");
}

export function setOrg(org: OrgId) {
  store.setState({ org });
  if (typeof window !== "undefined") saveOrg(org);
}

