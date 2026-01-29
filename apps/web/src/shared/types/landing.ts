export type ThemeTokens = {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  radius: string;
  fontDisplay: string;
  fontBody: string;
  spacing: "compact" | "cozy";
};

export type Block = {
  id: string;
  type:
    | "navbar"
    | "hero"
    | "feature-grid"
    | "paths"
    | "logos"
    | "gallery"
    | "testimonials"
    | "faq"
    | "apply-form"
    | "footer"
    | "custom";
  props: any;
  hidden?: boolean;
};

export type LandingData = {
  seo: { title: string; description: string };
  theme: ThemeTokens;
  blocks: Block[];
};

export type Tenant = {
  _id: string;
  name: string;
  slug: string;
  domain: string;
  logo?: { url: string };
  favicon?: { url: string };
  theme?: ThemeTokens;
};

export type Lead = {
  _id: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  applicant: { firstName: string; lastName: string; phone: string; email: string };
  submittedAt: string;
  invite?: { token?: string; expiresAt?: string };
};

export type AuditEvent = {
  _id: string;
  action: string;
  changes: { label: string; path: string; before: any; after: any }[];
  createdAt: string;
  actor?: { userId?: string; email?: string };
};

export type PageSection = {
  heading: string;
  body: string;
  image?: string;
};

export type PageCard = {
  title: string;
  body: string;
  image?: string;
  tag?: string;
  meta?: string[];
};

export type PageContent = {
  slug: string;
  layout: "standard" | "team" | "blog" | "courses";
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description?: string;
  heroImage?: string;
  bullets?: string[];
  sections?: PageSection[];
  cards?: PageCard[];
  cta?: { label: string; href: string };
};
