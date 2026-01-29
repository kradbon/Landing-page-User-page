const serverApiBaseUrl =
  typeof window === "undefined" ? process.env.API_INTERNAL_BASE_URL : undefined;

export const env = {
  apiBaseUrl: serverApiBaseUrl || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
  authApiBaseUrl: process.env.NEXT_PUBLIC_AUTH_API_BASE_URL || "",
  userPageBaseUrl: process.env.NEXT_PUBLIC_USER_PAGE_BASE_URL || "",
  baseDomain: process.env.NEXT_PUBLIC_BASE_DOMAIN || "ourdomain.com",
  adminTenantId: process.env.NEXT_PUBLIC_ADMIN_TENANT_ID || "arkon",
  adminUserId: process.env.NEXT_PUBLIC_ADMIN_USER_ID || "admin-user",
  adminEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@arkon.com"
};
