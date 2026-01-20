import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { IDENTITY_API_BASE_URL } from './identity-base-url';
import { IDENTITY_ROUTES } from './identity-routes';
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
  UserCreate,
} from './identity.types';

@Injectable({ providedIn: 'root' })
export class IdentityApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(IDENTITY_API_BASE_URL);

  private url(path: string) {
    return this.baseUrl ? `${this.baseUrl}${path}` : path;
  }

  login(payload: AuthLoginRequest): Promise<AuthTokenResponse> {
    return firstValueFrom(this.http.post<AuthTokenResponse>(this.url(IDENTITY_ROUTES.login()), payload));
  }

  register(payload: UserCreate): Promise<unknown> {
    return firstValueFrom(this.http.post(this.url(IDENTITY_ROUTES.register()), payload));
  }

  listUsers(): Promise<unknown> {
    return firstValueFrom(this.http.get(this.url(IDENTITY_ROUTES.users())));
  }

  createUser(payload: UserCreate): Promise<unknown> {
    return firstValueFrom(this.http.post(this.url(IDENTITY_ROUTES.users()), payload));
  }

  listRoles(): Promise<RoleRead[]> {
    return firstValueFrom(this.http.get<RoleRead[]>(this.url(IDENTITY_ROUTES.roles())));
  }

  createRole(payload: RoleCreate): Promise<RoleRead> {
    return firstValueFrom(this.http.post<RoleRead>(this.url(IDENTITY_ROUTES.roles()), payload));
  }

  updateRole(roleId: string, payload: RoleUpdate): Promise<RoleRead> {
    return firstValueFrom(this.http.patch<RoleRead>(this.url(IDENTITY_ROUTES.roleById(roleId)), payload));
  }

  deleteRole(roleId: string): Promise<void> {
    return firstValueFrom(this.http.delete<void>(this.url(IDENTITY_ROUTES.roleById(roleId))));
  }

  setRolePermissions(roleId: string, payload: RolePermissionsUpdate): Promise<void> {
    return firstValueFrom(
      this.http.put<void>(this.url(IDENTITY_ROUTES.rolePermissions(roleId)), payload),
    );
  }

  listPermissions(): Promise<PermissionRead[]> {
    return firstValueFrom(this.http.get<PermissionRead[]>(this.url(IDENTITY_ROUTES.permissions())));
  }

  createPermission(payload: PermissionCreate): Promise<PermissionRead> {
    return firstValueFrom(this.http.post<PermissionRead>(this.url(IDENTITY_ROUTES.permissions()), payload));
  }

  updatePermission(permissionId: string, payload: PermissionUpdate): Promise<PermissionRead> {
    return firstValueFrom(
      this.http.patch<PermissionRead>(this.url(IDENTITY_ROUTES.permissionById(permissionId)), payload),
    );
  }

  health(): Promise<unknown> {
    return firstValueFrom(this.http.get(this.url(IDENTITY_ROUTES.health())));
  }

  ready(): Promise<unknown> {
    return firstValueFrom(this.http.get(this.url(IDENTITY_ROUTES.ready())));
  }
}
