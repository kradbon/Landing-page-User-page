import { getFullDomain } from "@/portal/domain";

export type AuthTokenResponse = {
  access_token: string;
  token_type?: string;
  expires_in?: number;
  expires_at?: number | string;
  refresh_token?: string;
};

export async function login(email: string, password: string): Promise<AuthTokenResponse> {
  const base = getFullDomain();
  const url = base ? `http://${base}/api/login` : "/api/login";
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Login failed");
  }
  return (await response.json()) as AuthTokenResponse;
}

