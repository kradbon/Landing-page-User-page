const STORAGE_KEY = "user-page.domain.v1";
const LOCAL_DOMAIN_SUFFIX = "localhost:8000";

function resolveDomainSuffix() {
  if (typeof window === "undefined") return "";
  const hostname = window.location.hostname;
  if (!hostname) return "";
  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname.endsWith(".localhost")) {
    return LOCAL_DOMAIN_SUFFIX;
  }
  return "";
}

const DOMAIN_SUFFIX = resolveDomainSuffix();
const DOMAIN_SUFFIX_HOST = DOMAIN_SUFFIX.split(":")[0];
const DOMAIN_SUFFIX_PORT = DOMAIN_SUFFIX.split(":")[1] ?? "";

export function normalizeDomainInput(raw: string) {
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed) return "";
  const withoutProtocol = trimmed.replace(/^https?:\/\//, "");
  const host = withoutProtocol.split("/")[0];
  if (!host) return "";
  const suffixLabel = stripDomainSuffix(host);
  if (suffixLabel) return suffixLabel.replace(/[^a-z0-9-]/g, "");
  return host;
}

export function isValidDomainLabel(label: string) {
  if (!label) return false;
  if (label.length > 63) return false;
  return /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(label);
}

function isValidDomainHost(host: string) {
  if (!host) return false;
  const [hostname, port] = host.split(":");
  if (!hostname) return false;
  if (port) {
    if (!/^\d{1,5}$/.test(port)) return false;
    const portNumber = Number(port);
    if (portNumber < 1 || portNumber > 65535) return false;
  }
  const labels = hostname.split(".");
  return labels.every((label) => isValidDomainLabel(label));
}

function isHostValue(value: string) {
  return value.includes(".") || value.includes(":");
}

export function isValidDomainInput(value: string) {
  if (!value) return false;
  return isHostValue(value) ? isValidDomainHost(value) : isValidDomainLabel(value);
}

export function resolveFullDomain(value: string) {
  if (!value) return "";
  if (!DOMAIN_SUFFIX) return value;
  if (isHostValue(value)) return withSuffixPort(value);
  return `${value}.${DOMAIN_SUFFIX}`;
}

export function loadDomain() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const normalized = normalizeDomainInput(raw);
      if (isValidDomainInput(normalized)) return normalized;
    }
  } catch {
    // ignore
  }
  const host = readHostForSuffix();
  if (hostHasSuffix(host)) {
    const normalized = normalizeDomainInput(host);
    if (isValidDomainInput(normalized)) return normalized;
  }
  return "";
}

export function saveDomain(domain: string) {
  try {
    if (!domain) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, domain);
  } catch {
    // ignore
  }
}

export function getDomain() {
  if (typeof window === "undefined") return "";
  return loadDomain();
}

export function setDomain(raw: string) {
  const normalized = normalizeDomainInput(raw);
  if (!isValidDomainInput(normalized)) return false;
  saveDomain(normalized);
  return true;
}

export function clearDomain() {
  saveDomain("");
}

export function getFullDomain() {
  const domain = loadDomain();
  return resolveFullDomain(domain);
}

export const DOMAIN_SUFFIX_VALUE = DOMAIN_SUFFIX;

function stripDomainSuffix(host: string): string | null {
  if (!DOMAIN_SUFFIX_HOST) return null;
  if (DOMAIN_SUFFIX && host.endsWith(`.${DOMAIN_SUFFIX}`)) {
    const fromHost = host.slice(0, -(DOMAIN_SUFFIX.length + 1));
    return fromHost.split(".")[0];
  }
  const hostname = host.split(":")[0];
  if (hostname.endsWith(`.${DOMAIN_SUFFIX_HOST}`)) {
    const fromHost = hostname.slice(0, -(DOMAIN_SUFFIX_HOST.length + 1));
    return fromHost.split(".")[0];
  }
  return null;
}

function withSuffixPort(host: string): string {
  if (!DOMAIN_SUFFIX_HOST || !DOMAIN_SUFFIX_PORT) return host;
  const [hostname, port] = host.split(":");
  if (port) return host;
  if (hostname.endsWith(`.${DOMAIN_SUFFIX_HOST}`)) {
    return `${hostname}:${DOMAIN_SUFFIX_PORT}`;
  }
  return host;
}

function readHostForSuffix(): string {
  if (typeof window === "undefined") return "";
  if (DOMAIN_SUFFIX_PORT) return window.location.host;
  return window.location.hostname;
}

function hostHasSuffix(host: string): boolean {
  if (!DOMAIN_SUFFIX_HOST) return false;
  if (DOMAIN_SUFFIX && host.endsWith(`.${DOMAIN_SUFFIX}`)) return true;
  const hostname = host.split(":")[0];
  return hostname.endsWith(`.${DOMAIN_SUFFIX_HOST}`);
}

