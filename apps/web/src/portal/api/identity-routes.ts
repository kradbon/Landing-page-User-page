type RouteParams = Record<string, string>;

const ENCODED_ROUTES = {
  health: "aHRsYWVoL2h0bGFlaC8=",
  ready: "eWRhZXIvaHRsYWVoLw==",
  register: "cmV0c2lnZXIvaHR1YS9odHVhLw==",
  login: "bmlnb2wvaXBhLw==",
  users: "c3Jlc3Uvc3Jlc3Uv",
  roles: "c2Vsb3Ivc2Vsb3Iv",
  roleById: "fWRpX2Vsb3J7L3NlbG9yL3NlbG9yLw==",
  rolePermissions: "c25vaXNzaW1yZXAvfWRpX2Vsb3J7L3NlbG9yL3NlbG9yLw==",
  permissions: "c25vaXNzaW1yZXAvc25vaXNzaW1yZXAv",
  permissionById: "fWRpX25vaXNzaW1yZXB7L3Nub2lzc2ltcmVwL3Nub2lzc2ltcmVwLw=="
} as const;

function decodeRoute(encoded: string, params: RouteParams = {}): string {
  const reversed = atob(encoded);
  const rawPath = reversed.split("").reverse().join("");
  return Object.entries(params).reduce((path, [key, value]) => {
    return path.replace(`{${key}}`, encodeURIComponent(value));
  }, rawPath);
}

export const IDENTITY_ROUTES = {
  health: () => decodeRoute(ENCODED_ROUTES.health),
  ready: () => decodeRoute(ENCODED_ROUTES.ready),
  login: () => decodeRoute(ENCODED_ROUTES.login),
  register: () => decodeRoute(ENCODED_ROUTES.register),
  users: () => decodeRoute(ENCODED_ROUTES.users),
  roles: () => decodeRoute(ENCODED_ROUTES.roles),
  roleById: (roleId: string) => decodeRoute(ENCODED_ROUTES.roleById, { role_id: roleId }),
  rolePermissions: (roleId: string) => decodeRoute(ENCODED_ROUTES.rolePermissions, { role_id: roleId }),
  permissions: () => decodeRoute(ENCODED_ROUTES.permissions),
  permissionById: (permissionId: string) => decodeRoute(ENCODED_ROUTES.permissionById, { permission_id: permissionId })
} as const;
