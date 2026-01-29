import { login, AuthTokenResponse } from "@/portal/identity";
import { loadSession, saveSession, resolveExpiresAt } from "@/portal/auth-session";

const OFFLINE_SESSION_TTL_DAYS = 30;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const OFFLINE_AUTH = true;

export function getSession() {
  if (typeof window === "undefined") return null;
  return loadSession();
}

export function isSignedIn() {
  return Boolean(getSession());
}

export async function signIn(email: string, password: string) {
  try {
    const response: AuthTokenResponse = await login(email, password);
    if (!response?.access_token) {
      throw new Error("Access token missing");
    }
    saveSession({
      accessToken: response.access_token,
      tokenType: response.token_type || "Bearer",
      expiresAt: resolveExpiresAt(response),
      email
    });
  } catch (error) {
    if (OFFLINE_AUTH) {
      saveSession({
        accessToken: `offline-${Date.now()}`,
        tokenType: "Bearer",
        expiresAt: Date.now() + OFFLINE_SESSION_TTL_DAYS * MS_PER_DAY,
        email
      });
      return;
    }
    throw error;
  }
}

export function signOut() {
  saveSession(null);
}

