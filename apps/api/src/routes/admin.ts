import { Router } from "express";
import { z } from "zod";
import { LandingPageModel } from "../models/landingPage";
import { LandingVersionModel } from "../models/landingVersion";
import { AuditEventModel } from "../models/auditEvent";
import { LeadModel } from "../models/lead";
import { TenantModel } from "../models/tenant";
import { LandingDataSchema } from "../utils/landingSchema";
import { computeChanges } from "../utils/diff";
import { presignUpload } from "../services/minio";
import { v4 as uuidv4 } from "uuid";
import { AuthedRequest } from "../middleware/auth";
import { config } from "../config";

const router = Router();

router.get("/tenant", async (req: AuthedRequest, res) => {
  const tenantId = req.actor?.tenantId;
  const tenant = await TenantModel.findById(tenantId);
  if (!tenant) {
    res.status(404).json({ error: "Tenant not found" });
    return;
  }
  res.json({ tenant });
});

const TenantUpdateSchema = z.object({
  logo: z
    .object({
      key: z.string().optional(),
      url: z.string().optional(),
      contentType: z.string().optional(),
      size: z.number().optional()
    })
    .optional(),
  theme: z
    .object({
      primary: z.string().optional(),
      secondary: z.string().optional(),
      background: z.string().optional(),
      text: z.string().optional(),
      font: z.string().optional(),
      radius: z.string().optional()
    })
    .optional()
});

router.patch("/tenant", async (req: AuthedRequest, res) => {
  const tenantId = req.actor?.tenantId;
  const parsed = TenantUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid payload" });
    return;
  }
  const tenant = await TenantModel.findByIdAndUpdate(
    tenantId,
    { $set: parsed.data },
    { new: true }
  );
  res.json({ tenant });
});

router.get("/landing/:slug", async (req: AuthedRequest, res) => {
  const tenantId = req.actor?.tenantId;
  const landingPage = await LandingPageModel.findOne({ tenantId, slug: req.params.slug });
  if (!landingPage) {
    res.status(404).json({ error: "Landing not found" });
    return;
  }

  const versionId = landingPage.draftVersionId || landingPage.publishedVersionId;
  const version = versionId ? await LandingVersionModel.findById(versionId) : null;

  res.json({
    page: landingPage,
    version,
    data: version?.data
  });
});

const UpdateSchema = z.object({
  data: LandingDataSchema,
  reason: z.enum(["autosave", "manual-save"]).optional()
});

router.patch("/landing/:slug", async (req: AuthedRequest, res) => {
  const tenantId = req.actor?.tenantId;
  const parsed = UpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid payload" });
    return;
  }

  const landingPage = await LandingPageModel.findOne({ tenantId, slug: req.params.slug });
  if (!landingPage) {
    res.status(404).json({ error: "Landing not found" });
    return;
  }

  const latestVersionId = landingPage.draftVersionId || landingPage.publishedVersionId;
  const latestVersion = latestVersionId ? await LandingVersionModel.findById(latestVersionId) : null;
  const nextVersionNumber = (latestVersion?.version || 0) + 1;

  const version = await LandingVersionModel.create({
    tenantId,
    pageId: landingPage._id,
    version: nextVersionNumber,
    data: parsed.data.data,
    createdBy: req.actor?.userId,
    reason: parsed.data.reason || "manual-save"
  });

  landingPage.draftVersionId = version._id;
  await landingPage.save();

  const changes = computeChanges(latestVersion?.data || {}, version.data);
  await AuditEventModel.create({
    tenantId,
    pageId: landingPage._id,
    slug: landingPage.slug,
    actor: {
      userId: req.actor?.userId,
      email: req.actor?.email,
      ip: req.ip
    },
    action: "update",
    changes,
    fromVersionId: latestVersion?._id,
    toVersionId: version._id
  });

  res.json({ ok: true, versionId: version._id });
});

router.post("/landing/:slug/publish", async (req: AuthedRequest, res) => {
  const tenantId = req.actor?.tenantId;
  const landingPage = await LandingPageModel.findOne({ tenantId, slug: req.params.slug });
  if (!landingPage?.draftVersionId) {
    res.status(400).json({ error: "No draft to publish" });
    return;
  }

  const draft = await LandingVersionModel.findById(landingPage.draftVersionId);
  if (!draft) {
    res.status(404).json({ error: "Draft not found" });
    return;
  }

  const publishVersion = await LandingVersionModel.create({
    tenantId,
    pageId: landingPage._id,
    version: draft.version + 1,
    data: draft.data,
    createdBy: req.actor?.userId,
    reason: "publish"
  });

  landingPage.publishedVersionId = publishVersion._id;
  landingPage.publishedAt = new Date();
  await landingPage.save();

  const changes = computeChanges(draft.data || {}, publishVersion.data);
  await AuditEventModel.create({
    tenantId,
    pageId: landingPage._id,
    slug: landingPage.slug,
    actor: {
      userId: req.actor?.userId,
      email: req.actor?.email,
      ip: req.ip
    },
    action: "publish",
    changes,
    fromVersionId: draft._id,
    toVersionId: publishVersion._id
  });

  res.json({ ok: true, publishedVersionId: publishVersion._id });
});

router.get("/audit", async (req: AuthedRequest, res) => {
  const tenantId = req.actor?.tenantId;
  const slug = String(req.query.slug || "home");
  const events = await AuditEventModel.find({ tenantId, slug }).sort({ createdAt: -1 }).limit(200);
  res.json({ items: events });
});

router.get("/leads", async (req: AuthedRequest, res) => {
  const tenantId = req.actor?.tenantId;
  const status = req.query.status ? String(req.query.status) : undefined;
  const query: any = { tenantId };
  if (status) {
    query.status = status;
  }
  const leads = await LeadModel.find(query).sort({ submittedAt: -1 }).limit(200);
  res.json({ items: leads });
});

router.post("/leads/:id/accept", async (req: AuthedRequest, res) => {
  const tenantId = req.actor?.tenantId;
  const lead = await LeadModel.findOne({ _id: req.params.id, tenantId });
  if (!lead) {
    res.status(404).json({ error: "Lead not found" });
    return;
  }

  const token = lead.invite?.token || uuidv4();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  lead.status = "ACCEPTED";
  lead.decidedAt = new Date();
  lead.decidedBy = req.actor?.userId;
  lead.invite = { token, expiresAt, usedAt: lead.invite?.usedAt };
  await lead.save();

  const base = config.publicBaseUrl || "http://localhost:3001";
  const inviteUrl = `${base}/register/${token}?tenant=${tenantId}`;

  res.json({ ok: true, inviteUrl });
});

router.post("/leads/:id/decline", async (req: AuthedRequest, res) => {
  const tenantId = req.actor?.tenantId;
  const lead = await LeadModel.findOne({ _id: req.params.id, tenantId });
  if (!lead) {
    res.status(404).json({ error: "Lead not found" });
    return;
  }

  lead.status = "DECLINED";
  lead.decidedAt = new Date();
  lead.decidedBy = req.actor?.userId;
  await lead.save();

  res.json({ ok: true });
});

const PresignSchema = z.object({
  filename: z.string(),
  contentType: z.string(),
  purpose: z.string(),
  pageId: z.string().optional()
});

router.post("/assets/presign-upload", async (req: AuthedRequest, res) => {
  const tenantId = req.actor?.tenantId;
  const parsed = PresignSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid payload" });
    return;
  }

  const ext = parsed.data.filename.includes(".") ? parsed.data.filename.slice(parsed.data.filename.lastIndexOf(".")) : "";
  const id = uuidv4();
  let key = `tenants/${tenantId}/landings/${parsed.data.pageId || "unknown"}/${parsed.data.purpose}/${id}${ext}`;
  if (parsed.data.purpose === "logo") {
    key = `tenants/${tenantId}/logo/${id}${ext}`;
  }

  const { uploadUrl, publicUrl } = await presignUpload(key, parsed.data.contentType);
  res.json({ key, uploadUrl, publicUrl });
});

export default router;
