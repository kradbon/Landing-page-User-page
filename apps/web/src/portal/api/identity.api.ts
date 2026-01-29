import { getIdentityBaseUrl } from "@/portal/api/identity-base-url";
import { IDENTITY_ROUTES } from "@/portal/api/identity-routes";
import {
  AuthLoginRequest,
  AuthTokenResponse,
  PermissionCreate,
  PermissionRead,
  PermissionUpdate,
  RoleCreate,
  RolePermissionsUpdate,
  RoleRead,
  RoleUpdate,
  UserCreate
} from "@/portal/api/identity.types";

function url(path: string) {
  const base = getIdentityBaseUrl();
  return base ? `${base}${path}` : path;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {})
    }
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Request failed");
  }
  return (await response.json()) as T;
}

export const IdentityApi = {
  login(payload: AuthLoginRequest): Promise<AuthTokenResponse> {
    return request<AuthTokenResponse>(IDENTITY_ROUTES.login(), { method: "POST", body: JSON.stringify(payload) });
  },
  register(payload: UserCreate): Promise<unknown> {
    return request(IDENTITY_ROUTES.register(), { method: "POST", body: JSON.stringify(payload) });
  },
  listUsers(): Promise<unknown> {
    return request(IDENTITY_ROUTES.users());
  },
  createUser(payload: UserCreate): Promise<unknown> {
    return request(IDENTITY_ROUTES.users(), { method: "POST", body: JSON.stringify(payload) });
  },
  listRoles(): Promise<RoleRead[]> {
    return request<RoleRead[]>(IDENTITY_ROUTES.roles());
  },
  createRole(payload: RoleCreate): Promise<RoleRead> {
    return request<RoleRead>(IDENTITY_ROUTES.roles(), { method: "POST", body: JSON.stringify(payload) });
  },
  updateRole(roleId: string, payload: RoleUpdate): Promise<RoleRead> {
    return request<RoleRead>(IDENTITY_ROUTES.roleById(roleId), { method: "PATCH", body: JSON.stringify(payload) });
  },
  deleteRole(roleId: string): Promise<void> {
    return request<void>(IDENTITY_ROUTES.roleById(roleId), { method: "DELETE" });
  },
  setRolePermissions(roleId: string, payload: RolePermissionsUpdate): Promise<void> {
    return request<void>(IDENTITY_ROUTES.rolePermissions(roleId), { method: "PUT", body: JSON.stringify(payload) });
  },
  listPermissions(): Promise<PermissionRead[]> {
    return request<PermissionRead[]>(IDENTITY_ROUTES.permissions());
  },
  createPermission(payload: PermissionCreate): Promise<PermissionRead> {
    return request<PermissionRead>(IDENTITY_ROUTES.permissions(), { method: "POST", body: JSON.stringify(payload) });
  },
  updatePermission(permissionId: string, payload: PermissionUpdate): Promise<PermissionRead> {
    return request<PermissionRead>(IDENTITY_ROUTES.permissionById(permissionId), { method: "PATCH", body: JSON.stringify(payload) });
  },
  health(): Promise<unknown> {
    return request(IDENTITY_ROUTES.health());
  },
  ready(): Promise<unknown> {
    return request(IDENTITY_ROUTES.ready());
  }
};

