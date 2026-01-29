export type AuthSession = {
  accessToken: string;
  tokenType: string;
  expiresAt: number;
  email?: string;
};

const STORAGE_KEY = "user-page.session.v1";
const DEFAULT_SESSION_TTL_DAYS = 30;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function loadSession(): AuthSession | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AuthSession> | null;
    if (!parsed || typeof parsed.accessToken !== "string") return null;
    if (typeof parsed.expiresAt !== "number" || !Number.isFinite(parsed.expiresAt)) return null;
    if (parsed.expiresAt <= Date.now()) return null;
    return {
      accessToken: parsed.accessToken,
      tokenType: normalizeTokenType(parsed.tokenType),
      expiresAt: parsed.expiresAt,
      email: typeof parsed.email === "string" ? parsed.email : undefined
    };
  } catch {
    return null;
  }
}

export function saveSession(session: AuthSession | null) {
  try {
    if (!session) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    const normalized: AuthSession = { ...session, tokenType: normalizeTokenType(session.tokenType) };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  } catch {
    // ignore storage failures
  }
}

export function resolveExpiresAt(response: {
  expires_at?: number | string;
  expires_in?: number;
}): number {
  const now = Date.now();
  const expiresAt = response.expires_at;
  if (typeof expiresAt === "number" && Number.isFinite(expiresAt)) {
    return expiresAt < 1_000_000_000_000 ? expiresAt * 1000 : expiresAt;
  }
  if (typeof expiresAt === "string") {
    const parsedDate = Date.parse(expiresAt);
    if (!Number.isNaN(parsedDate)) return parsedDate;
    const parsedNumber = Number(expiresAt);
    if (!Number.isNaN(parsedNumber)) {
      return parsedNumber < 1_000_000_000_000 ? parsedNumber * 1000 : parsedNumber;
    }
  }
  if (typeof response.expires_in === "number" && Number.isFinite(response.expires_in)) {
    return now + Math.max(0, response.expires_in) * 1000;
  }
  return now + DEFAULT_SESSION_TTL_DAYS * MS_PER_DAY;
}

export function normalizeTokenType(tokenType?: string) {
  if (!tokenType) return "Bearer";
  return tokenType.toLowerCase() === "bearer" ? "Bearer" : tokenType;
}

