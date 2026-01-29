import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import { config } from "../config";

export type AuthActor = {
  tenantId: string;
  userId?: string;
  email?: string;
};

export type AuthedRequest = Request & { actor?: AuthActor };

function decodeToken(token: string) {
  if (config.jwtSecret) {
    try {
      return jwt.verify(token, config.jwtSecret) as any;
    } catch (_err) {
      return null;
    }
  }
  try {
    return jwtDecode(token);
  } catch (_err) {
    return null;
  }
}

export function tenantAuth(req: AuthedRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const decoded = token ? decodeToken(token) : null;

  const tenantId =
    (decoded && (decoded.tenantId || decoded.tenant_id)) ||
    req.headers["x-tenant-id"] ||
    config.devAdmin.tenantId;

  const userId = (decoded && (decoded.userId || decoded.sub)) || req.headers["x-user-id"] || config.devAdmin.userId;
  const email = (decoded && decoded.email) || req.headers["x-user-email"] || config.devAdmin.email;

  req.actor = {
    tenantId: String(tenantId),
    userId: userId ? String(userId) : undefined,
    email: email ? String(email) : undefined
  };

  next();
}

export function requireTenant(req: AuthedRequest, res: Response, next: NextFunction) {
  if (!req.actor?.tenantId) {
    res.status(401).json({ error: "Missing tenant context" });
    return;
  }
  next();
}
