export type AuthLoginRequest = {
  email: string;
  password: string;
};

export type AuthTokenResponse = {
  access_token: string;
  token_type?: string;
  expires_in?: number;
  expires_at?: number | string;
  refresh_token?: string;
};

export type UserCreate = {
  first_name: string;
  email: string;
  password: string;
  confirm_password: string;
  domain?: string | null;
};

export type RoleCreate = {
  key: string;
  name: string;
  description?: string | null;
};

export type RoleRead = {
  id: string;
  key: string;
  name: string;
  description?: string | null;
};

export type RoleUpdate = {
  name?: string | null;
  description?: string | null;
};

export type RolePermissionsUpdate = {
  permission_keys: string[];
};

export type PermissionCreate = {
  key: string;
  description?: string | null;
};

export type PermissionRead = {
  id: string;
  key: string;
  description?: string | null;
};

export type PermissionUpdate = {
  key?: string | null;
  description?: string | null;
};
