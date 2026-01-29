import { getFullDomain } from "@/portal/domain";

const API_SCHEME = "http";

function normalizeDomain(domain: string): string {
  if (!domain) return "";
  const withoutProtocol = domain.trim().replace(/^https?:\/\//, "");
  return withoutProtocol.replace(/\/+$/, "");
}

export function getIdentityBaseUrl() {
  const normalized = normalizeDomain(getFullDomain());
  return normalized ? `${API_SCHEME}://${normalized}` : "";
}

