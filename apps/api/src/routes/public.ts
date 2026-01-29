import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { LandingPageModel } from "../models/landingPage";
import { LandingVersionModel } from "../models/landingVersion";
import { TenantModel } from "../models/tenant";
import { LeadModel } from "../models/lead";
import { resolveTenantId } from "../utils/tenantResolve";

const router = Router();

const leadLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false
});

router.get("/landing/:tenant/:slug", async (req, res) => {
  const tenantId = await resolveTenantId(req, req.params.tenant);
  if (!tenantId) {
    res.status(404).json({ error: "Tenant not found" });
    return;
  }

  const landingPage = await LandingPageModel.findOne({ tenantId, slug: req.params.slug });
  if (!landingPage?.publishedVersionId) {
    res.status(404).json({ error: "Landing not published" });
    return;
  }

  const version = await LandingVersionModel.findById(landingPage.publishedVersionId);
  const tenant = await TenantModel.findById(tenantId);

  res.json({
    tenant,
    page: landingPage,
    version,
    data: version?.data
  });
});

const LeadSchema = z.object({
  tenant: z.string(),
  slug: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  email: z.string().email(),
  company: z.string().optional()
});

router.post("/leads", leadLimiter, async (req, res) => {
  const parsed = LeadSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid payload" });
    return;
  }

  if (parsed.data.company) {
    res.json({ ok: true });
    return;
  }

  const tenantId = await resolveTenantId(req, parsed.data.tenant);
  if (!tenantId) {
    res.status(404).json({ error: "Tenant not found" });
    return;
  }

  const landingPage = await LandingPageModel.findOne({ tenantId, slug: parsed.data.slug });
  if (!landingPage) {
    res.status(404).json({ error: "Landing not found" });
    return;
  }

  const lead = await LeadModel.create({
    tenantId,
    pageId: landingPage._id,
    status: "PENDING",
    applicant: {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      phone: parsed.data.phone,
      email: parsed.data.email
    },
    submittedAt: new Date()
  });

  res.status(201).json({ ok: true, id: lead._id });
});

router.get("/invite/validate", async (req, res) => {
  const token = String(req.query.token || "");
  if (!token) {
    res.status(400).json({ error: "Missing token" });
    return;
  }

  const lead = await LeadModel.findOne({ "invite.token": token });
  if (!lead) {
    res.status(404).json({ error: "Invite not found" });
    return;
  }

  if (lead.invite?.usedAt) {
    res.status(410).json({ error: "Invite already used" });
    return;
  }

  if (lead.invite?.expiresAt && lead.invite.expiresAt < new Date()) {
    res.status(410).json({ error: "Invite expired" });
    return;
  }

  const tenant = await TenantModel.findById(lead.tenantId);
  res.json({
    tenant,
    leadId: lead._id,
    email: lead.applicant?.email
  });
});

export default router;
