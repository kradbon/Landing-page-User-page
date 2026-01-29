"use client";

import { env } from "@/shared/config/env";
import { apiFetch } from "@/shared/api/client";
import { AuditEvent, LandingData, Lead, Tenant, PageContent } from "@/shared/types/landing";
import {
  loadDraftLanding,
  loadPublishedLanding,
  saveDraftLanding,
  publishLanding,
  loadTenant,
  saveTenant,
  listLeads,
  updateLeadStatus,
  createLead,
  listAuditEvents,
  loadPage,
  savePage
} from "@/shared/api/landing-storage";

const headers = {
  "Content-Type": "application/json",
  "x-tenant-id": env.adminTenantId,
  "x-user-id": env.adminUserId,
  "x-user-email": env.adminEmail
};

const useLocalStorage =
  typeof window !== "undefined" && (process.env.NEXT_PUBLIC_USE_LOCAL_STORAGE || "true") !== "false";

export async function getDraftLanding(slug: string, lang = "en") {
  if (useLocalStorage) return loadDraftLanding(lang);
  const response = await apiFetch<{ data: LandingData }>(`${env.apiBaseUrl}/admin/landing/${slug}`, { headers });
  return response.data;
}

export async function getPublishedLanding(slug: string, lang = "en") {
  if (useLocalStorage) return loadPublishedLanding(lang);
  const response = await apiFetch<{ data: LandingData }>(`${env.apiBaseUrl}/public/landing/${slug}`);
  return response.data;
}

export async function saveLandingDraft(slug: string, data: LandingData, lang = "en") {
  if (useLocalStorage) return saveDraftLanding(data, { userId: env.adminUserId, email: env.adminEmail }, lang);
  return apiFetch(`${env.apiBaseUrl}/admin/landing/${slug}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ data, reason: "manual-save" })
  });
}

export async function publishLandingDraft(slug: string, data: LandingData, lang = "en") {
  if (useLocalStorage) return publishLanding(data, { userId: env.adminUserId, email: env.adminEmail }, lang);
  return apiFetch(`${env.apiBaseUrl}/admin/landing/${slug}/publish`, { method: "POST", headers });
}

export async function getTenant() {
  if (useLocalStorage) return loadTenant();
  const response = await apiFetch<{ tenant: Tenant }>(`${env.apiBaseUrl}/admin/tenant`, { headers });
  return response.tenant;
}

export async function updateTenant(tenant: Tenant) {
  if (useLocalStorage) return saveTenant(tenant, { userId: env.adminUserId, email: env.adminEmail });
  return apiFetch(`${env.apiBaseUrl}/admin/tenant`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ logo: tenant.logo, favicon: tenant.favicon, theme: tenant.theme })
  });
}

export async function getLeads() {
  if (useLocalStorage) return listLeads();
  const statuses = ["PENDING", "ACCEPTED", "DECLINED"];
  const results = await Promise.all(
    statuses.map((status) =>
      apiFetch<{ items: Lead[] }>(`${env.apiBaseUrl}/admin/leads?status=${status}`, { headers })
    )
  );
  return results.flatMap((res) => res.items);
}

export async function setLeadStatus(id: string, status: Lead["status"]) {
  if (useLocalStorage) return updateLeadStatus(id, status);
  const action = status === "ACCEPTED" ? "accept" : "decline";
  return apiFetch(`${env.apiBaseUrl}/admin/leads/${id}/${action}`, { method: "POST", headers });
}

type LeadSubmission = {
  tenant: string;
  slug: string;
  applicant: Lead["applicant"];
  company?: string;
};

export async function createLeadSubmission(payload: LeadSubmission) {
  if (useLocalStorage) {
    const lead: Lead = {
      _id: `lead_${Math.random().toString(36).slice(2)}`,
      status: "PENDING",
      applicant: payload.applicant,
      submittedAt: new Date().toISOString()
    };
    return createLead(lead);
  }
  return apiFetch(`${env.apiBaseUrl}/public/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export async function getAuditEvents(slug: string) {
  if (useLocalStorage) return listAuditEvents();
  const response = await apiFetch<{ items: AuditEvent[] }>(`${env.apiBaseUrl}/admin/audit?slug=${slug}`, { headers });
  return response.items;
}

export async function getPageContent(slug: string) {
  if (useLocalStorage) return loadPage(slug);
  const response = await apiFetch<{ data: PageContent }>(`${env.apiBaseUrl}/public/pages/${slug}`);
  return response.data;
}

export async function savePageContent(slug: string, data: PageContent) {
  if (useLocalStorage) return savePage(slug, data, { userId: env.adminUserId, email: env.adminEmail });
  return apiFetch(`${env.apiBaseUrl}/admin/pages/${slug}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ data })
  });
}
