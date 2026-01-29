import { z } from "zod";

export const themeSchema = z.object({
  primary: z.string(),
  secondary: z.string(),
  background: z.string(),
  text: z.string(),
  radius: z.string(),
  fontDisplay: z.string(),
  fontBody: z.string(),
  spacing: z.enum(["compact", "cozy"])
});

const ctaSchema = z.object({
  label: z.string(),
  href: z.string()
});

export const blockSchema = z.object({
  id: z.string(),
  type: z.enum([
    "navbar",
    "hero",
    "feature-grid",
    "paths",
    "logos",
    "gallery",
    "testimonials",
    "faq",
    "apply-form",
    "footer",
    "custom"
  ]),
  props: z.record(z.any()),
  hidden: z.boolean().optional()
});

export const landingSchema = z.object({
  seo: z.object({
    title: z.string(),
    description: z.string()
  }),
  theme: themeSchema,
  blocks: z.array(blockSchema)
});
