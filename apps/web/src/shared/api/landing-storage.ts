"use client";

import { AuditEvent, LandingData, Lead, Tenant, PageContent } from "@/shared/types/landing";
import { defaultLandingData, defaultTenant } from "@/entities/landing/model/defaults";
import { landingSchema } from "@/entities/landing/model/schema";
import { pageSchema } from "@/entities/landing/model/page-schema";
import { defaultPages } from "@/entities/landing/model/page-defaults";

const STORAGE_KEYS = {
  draft: "landing:draft",
  published: "landing:published",
  leads: "landing:leads",
  audit: "landing:audit",
  tenant: "landing:tenant",
  pages: "landing:pages",
  themeMigration: "landing:theme-migrated-2026-01-26"
};

function keyForLang(base: string, lang: string) {
  return `${base}:${lang}`;
}

function sleep(ms = 250) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function ensureSeedForLang(lang: string) {
  const draft = readJson<LandingData | null>(keyForLang(STORAGE_KEYS.draft, lang), null);
  const published = readJson<LandingData | null>(keyForLang(STORAGE_KEYS.published, lang), null);
  if (!draft) writeJson(keyForLang(STORAGE_KEYS.draft, lang), defaultLandingData);
  if (!published) writeJson(keyForLang(STORAGE_KEYS.published, lang), defaultLandingData);
}

function ensureSeed() {
  ensureSeedForLang("en");
  ensureSeedForLang("ru");
  ensureSeedForLang("tj");
  const tenant = readJson<Tenant | null>(STORAGE_KEYS.tenant, null);
  const pages = readJson<Record<string, PageContent> | null>(STORAGE_KEYS.pages, null);
  if (!tenant) writeJson(STORAGE_KEYS.tenant, defaultTenant);
  if (!pages) {
    writeJson(STORAGE_KEYS.pages, defaultPages);
  } else {
    const merged = { ...defaultPages, ...pages };
    writeJson(STORAGE_KEYS.pages, merged);
  }
  if (!readJson<Lead[] | null>(STORAGE_KEYS.leads, null)) writeJson(STORAGE_KEYS.leads, []);
  if (!readJson<AuditEvent[] | null>(STORAGE_KEYS.audit, null)) writeJson(STORAGE_KEYS.audit, []);
  migrateBranding();
}

const BRAND_FROM = "Arcadia";
const BRAND_TO = "Brooklyn LMS";
const ANNOUNCEMENT_FROM = "Fall cohort applications are now open";
const ANNOUNCEMENT_TO = "Brooklyn LMS";

function replaceBrandText(value: string) {
  if (!value.includes(BRAND_FROM)) return value;
  return value
    .replace(/Arcadia Labs/g, BRAND_TO)
    .replace(/Arcadia studio/g, `${BRAND_TO} studio`)
    .replace(/Arcadia/g, BRAND_TO);
}

function replaceAnnouncementText(value: string) {
  if (value !== ANNOUNCEMENT_FROM) return value;
  return ANNOUNCEMENT_TO;
}

function normalizeText(value: string) {
  return replaceAnnouncementText(replaceBrandText(value));
}

function replaceInObject<T>(value: T): T {
  if (typeof value === "string") {
    return normalizeText(value) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => replaceInObject(item)) as T;
  }
  if (value && typeof value === "object") {
    const next: Record<string, unknown> = {};
    Object.entries(value as Record<string, unknown>).forEach(([key, val]) => {
      next[key] = replaceInObject(val);
    });
    return next as T;
  }
  return value;
}

function migrateLandingBranding(data: LandingData) {
  const legacyTheme = {
    primary: "15 23 42",
    secondary: "14 116 144",
    background: "248 250 252",
    text: "15 23 42"
  };
  const shouldResetTheme =
    data.theme.primary === legacyTheme.primary &&
    data.theme.secondary === legacyTheme.secondary &&
    data.theme.background === legacyTheme.background &&
    data.theme.text === legacyTheme.text;

  const next = {
    ...data,
    seo: {
      title: replaceBrandText(data.seo.title),
      description: replaceBrandText(data.seo.description)
    },
    theme: shouldResetTheme ? { ...data.theme, ...defaultLandingData.theme } : data.theme,
    blocks: data.blocks
      .filter((block) => block.type !== "logos")
      .map((block) => {
        const props = replaceInObject(block.props);
        if (block.type === "testimonials") {
          props.eyebrow = "Alumni";
          props.title = "Alumni work that opens doors";
          props.description =
            "Brooklyn LMS alumni build standout portfolios and ship real projects that hiring teams remember.";
          props.items = [
            {
              name: "Maya Ortiz",
              role: "Motion Designer, Orbit",
              quote:
                "The feedback loops were intense and practical. I rebuilt my reel and got interviews fast.",
              image:
                "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&q=80&auto=format&fit=crop"
            },
            {
              name: "Samir Patel",
              role: "3D Artist, Pinecone",
              quote:
                "I went from scattered experiments to a cohesive portfolio that landed me a studio role.",
              image:
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80&auto=format&fit=crop"
            },
            {
              name: "Aisha Noor",
              role: "UX Animator, Atlas",
              quote:
                "The program helped me turn motion studies into a polished case study that stood out.",
              image:
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80&auto=format&fit=crop"
            }
          ];
        }
        if (block.type === "navbar" && props?.secondaryCta?.label === "View curriculum") {
          props.secondaryCta = { ...props.secondaryCta, label: "Login", href: "/login" };
        }
        if (block.type === "paths" && props?.cta?.href === "#programs") {
          props.cta = { ...props.cta, href: "/programs" };
        }
        return { ...block, props };
      })
  };
  return next;
}

function migratePageBranding(page: PageContent) {
  return replaceInObject(page);
}

function migrateBranding() {
  const storedTenant = readJson<Tenant | null>(STORAGE_KEYS.tenant, null);
  if (storedTenant) {
    const nextTenant: Tenant = { ...storedTenant };
    if (storedTenant.name?.includes(BRAND_FROM)) nextTenant.name = BRAND_TO;
    if (storedTenant.slug !== defaultTenant.slug) nextTenant.slug = defaultTenant.slug;
    if (storedTenant._id !== defaultTenant._id) nextTenant._id = defaultTenant._id;
    if (storedTenant.domain !== defaultTenant.domain) nextTenant.domain = defaultTenant.domain;
    nextTenant.logo = { url: defaultTenant.logo?.url || "/brooklyn_lms_logo.png" };
    if (JSON.stringify(nextTenant) !== JSON.stringify(storedTenant)) {
      writeJson(STORAGE_KEYS.tenant, nextTenant);
    }
  }

  (["en", "ru", "tj"] as const).forEach((lang) => {
    const draftKey = keyForLang(STORAGE_KEYS.draft, lang);
    const publishedKey = keyForLang(STORAGE_KEYS.published, lang);
    const draft = readJson<LandingData | null>(draftKey, null);
    const published = readJson<LandingData | null>(publishedKey, null);
    if (draft) {
      const nextDraft = migrateLandingBranding(draft);
      if (JSON.stringify(nextDraft) !== JSON.stringify(draft)) {
        writeJson(draftKey, nextDraft);
      }
    }
    if (published) {
      const nextPublished = migrateLandingBranding(published);
      if (JSON.stringify(nextPublished) !== JSON.stringify(published)) {
        writeJson(publishedKey, nextPublished);
      }
    }
  });

  const pages = readJson<Record<string, PageContent> | null>(STORAGE_KEYS.pages, null);
  if (pages) {
    const nextPages: Record<string, PageContent> = {};
    Object.entries(pages).forEach(([slug, page]) => {
      nextPages[slug] = migratePageBranding(page);
    });
    if (JSON.stringify(nextPages) !== JSON.stringify(pages)) {
      writeJson(STORAGE_KEYS.pages, nextPages);
    }
  }

  migrateThemePaletteOnce();
}

function migrateThemePaletteOnce() {
  const alreadyMigrated = readJson<boolean>(STORAGE_KEYS.themeMigration, false);
  if (alreadyMigrated) return;

  (["en", "ru", "tj"] as const).forEach((lang) => {
    const draftKey = keyForLang(STORAGE_KEYS.draft, lang);
    const publishedKey = keyForLang(STORAGE_KEYS.published, lang);
    const draft = readJson<LandingData | null>(draftKey, null);
    const published = readJson<LandingData | null>(publishedKey, null);
    if (draft) {
      writeJson(draftKey, { ...draft, theme: { ...defaultLandingData.theme } });
    }
    if (published) {
      writeJson(publishedKey, { ...published, theme: { ...defaultLandingData.theme } });
    }
  });

  writeJson(STORAGE_KEYS.themeMigration, true);
}

function createAuditEvent(
  action: string,
  changes: AuditEvent["changes"],
  actor?: AuditEvent["actor"]
): AuditEvent {
  return {
    _id: `audit_${Math.random().toString(36).slice(2)}`,
    action,
    changes,
    createdAt: new Date().toISOString(),
    actor
  };
}

export async function loadDraftLanding(lang = "en") {
  ensureSeed();
  await sleep();
  return readJson<LandingData>(keyForLang(STORAGE_KEYS.draft, lang), defaultLandingData);
}

export async function loadPublishedLanding(lang = "en") {
  ensureSeed();
  await sleep();
  return readJson<LandingData>(keyForLang(STORAGE_KEYS.published, lang), defaultLandingData);
}

export async function saveDraftLanding(data: LandingData, actor?: AuditEvent["actor"], lang = "en") {
  ensureSeed();
  landingSchema.parse(data);
  const previous = readJson<LandingData>(keyForLang(STORAGE_KEYS.draft, lang), defaultLandingData);
  writeJson(keyForLang(STORAGE_KEYS.draft, lang), data);
  const changes = summarizeLandingChanges(previous, data);
  await addAuditEvent(
    createAuditEvent(
      `Saved draft (${lang.toUpperCase()})`,
      changes.length ? changes : [{ label: "Draft saved", path: `draft.${lang}` }],
      actor
    )
  );
  await sleep(200);
  return data;
}

export async function publishLanding(data: LandingData, actor?: AuditEvent["actor"], lang = "en") {
  ensureSeed();
  landingSchema.parse(data);
  const previous = readJson<LandingData>(keyForLang(STORAGE_KEYS.published, lang), defaultLandingData);
  writeJson(keyForLang(STORAGE_KEYS.published, lang), data);
  const changes = summarizeLandingChanges(previous, data);
  await addAuditEvent(
    createAuditEvent(
      `Published (${lang.toUpperCase()})`,
      changes.length ? changes : [{ label: "Published landing", path: `published.${lang}` }],
      actor
    )
  );
  await sleep(200);
  return data;
}

export async function loadTenant() {
  ensureSeed();
  await sleep();
  return readJson<Tenant>(STORAGE_KEYS.tenant, defaultTenant);
}

export async function loadPages() {
  ensureSeed();
  await sleep();
  return readJson<Record<string, PageContent>>(STORAGE_KEYS.pages, defaultPages);
}

export async function loadPage(slug: string) {
  const pages = await loadPages();
  return pages[slug] || defaultPages[slug];
}

export async function savePage(slug: string, data: PageContent, actor?: AuditEvent["actor"]) {
  ensureSeed();
  pageSchema.parse(data);
  const pages = readJson<Record<string, PageContent>>(STORAGE_KEYS.pages, defaultPages);
  const next = { ...pages, [slug]: data };
  writeJson(STORAGE_KEYS.pages, next);
  await addAuditEvent(
    createAuditEvent("Updated page", [{ label: `Updated ${slug} page`, path: `pages.${slug}` }], actor)
  );
  await sleep(200);
  return data;
}

export async function saveTenant(tenant: Tenant, actor?: AuditEvent["actor"]) {
  ensureSeed();
  writeJson(STORAGE_KEYS.tenant, tenant);
  await addAuditEvent(
    createAuditEvent("Updated branding", [{ label: "Updated tenant branding", path: "tenant" }], actor)
  );
  await sleep(200);
  return tenant;
}

export async function listLeads() {
  ensureSeed();
  await sleep();
  return readJson<Lead[]>(STORAGE_KEYS.leads, []);
}

export async function createLead(lead: Lead) {
  ensureSeed();
  const leads = readJson<Lead[]>(STORAGE_KEYS.leads, []);
  const next = [lead, ...leads];
  writeJson(STORAGE_KEYS.leads, next);
  await addAuditEvent(
    createAuditEvent("New lead", [{ label: `${lead.applicant.firstName} ${lead.applicant.lastName} applied`, path: "leads" }])
  );
  await sleep(200);
  return lead;
}

export async function updateLeadStatus(id: string, status: Lead["status"]) {
  ensureSeed();
  const leads = readJson<Lead[]>(STORAGE_KEYS.leads, []);
  const next = leads.map((lead) => {
    if (lead._id !== id) return lead;
    const invite =
      status === "ACCEPTED"
        ? {
            token: Math.random().toString(36).slice(2),
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString()
          }
        : lead.invite;
    return { ...lead, status, invite };
  });
  writeJson(STORAGE_KEYS.leads, next);
  await addAuditEvent(
    createAuditEvent("Lead status", [{ label: `Lead ${id} marked ${status.toLowerCase()}`, path: "leads" }])
  );
  await sleep(200);
  return next.find((lead) => lead._id === id);
}

export async function listAuditEvents() {
  ensureSeed();
  await sleep();
  return readJson<AuditEvent[]>(STORAGE_KEYS.audit, []);
}

export async function addAuditEvent(event: AuditEvent) {
  ensureSeed();
  const events = readJson<AuditEvent[]>(STORAGE_KEYS.audit, []);
  writeJson(STORAGE_KEYS.audit, [event, ...events].slice(0, 200));
  await sleep(100);
}

export function summarizeLandingChanges(prev: LandingData, next: LandingData): AuditEvent["changes"] {
  const changes: AuditEvent["changes"] = [];
  if (prev.seo.title !== next.seo.title) {
    changes.push({ label: "SEO title", path: "seo.title", before: prev.seo.title, after: next.seo.title });
  }
  if (prev.seo.description !== next.seo.description) {
    changes.push({
      label: "SEO description",
      path: "seo.description",
      before: prev.seo.description,
      after: next.seo.description
    });
  }
  (["primary", "secondary", "background", "text", "radius", "fontDisplay", "fontBody", "spacing"] as const).forEach(
    (key) => {
      if (prev.theme[key] !== next.theme[key]) {
        changes.push({ label: `Theme ${key}`, path: `theme.${key}`, before: prev.theme[key], after: next.theme[key] });
      }
    }
  );

  if (prev.blocks.length !== next.blocks.length) {
    changes.push({
      label: "Section count",
      path: "blocks",
      before: prev.blocks.length,
      after: next.blocks.length
    });
  }

  const prevMap = new Map(prev.blocks.map((block) => [block.id, block]));
  next.blocks.forEach((block) => {
    const previous = prevMap.get(block.id);
    if (!previous) {
      changes.push({ label: `Added ${block.type}`, path: `blocks.${block.id}`, after: block.type });
      return;
    }
    if (previous.type !== block.type) {
      changes.push({
        label: `Section type changed`,
        path: `blocks.${block.id}.type`,
        before: previous.type,
        after: block.type
      });
    }
    if (JSON.stringify(previous.props) !== JSON.stringify(block.props)) {
      changes.push({
        label: `Updated ${block.type}`,
        path: `blocks.${block.id}.props`,
        before: previous.props,
        after: block.props
      });
    }
  });

  return changes.slice(0, 8);
}
