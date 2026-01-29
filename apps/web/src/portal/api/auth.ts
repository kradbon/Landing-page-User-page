import { loadSession } from "@/portal/auth-session";

export function authHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const session = loadSession();
  if (!session) return {};
  return { Authorization: `${session.tokenType} ${session.accessToken}` };
}

