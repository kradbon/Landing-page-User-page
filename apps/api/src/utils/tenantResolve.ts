import { Request } from "express";
import { TenantModel } from "../models/tenant";
import { config } from "../config";

export async function resolveTenantId(req: Request, explicitTenant?: string) {
  const tenantFromParam = explicitTenant;
  if (tenantFromParam) {
    const tenant = await TenantModel.findOne({
      $or: [{ _id: tenantFromParam }, { slug: tenantFromParam }, { domain: tenantFromParam }]
    });
    return tenant?._id || null;
  }

  const host = req.headers.host || "";
  if (host && host.includes(".")) {
    const sub = host.split(":")[0].split(".")[0];
    if (sub && sub !== "www" && sub !== config.baseDomain.split(".")[0]) {
      const tenant = await TenantModel.findOne({ $or: [{ _id: sub }, { slug: sub }] });
      return tenant?._id || null;
    }
  }

  return null;
}
