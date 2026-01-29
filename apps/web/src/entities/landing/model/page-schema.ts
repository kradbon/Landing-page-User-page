import { z } from "zod";

export const pageSectionSchema = z.object({
  heading: z.string(),
  body: z.string(),
  image: z.string().optional()
});

export const pageCardSchema = z.object({
  title: z.string(),
  body: z.string(),
  image: z.string().optional(),
  tag: z.string().optional(),
  meta: z.array(z.string()).optional()
});

export const pageSchema = z.object({
  slug: z.string(),
  layout: z.enum(["standard", "team", "blog", "courses"]),
  eyebrow: z.string().optional(),
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  heroImage: z.string().optional(),
  bullets: z.array(z.string()).optional(),
  sections: z.array(pageSectionSchema).optional(),
  cards: z.array(pageCardSchema).optional(),
  cta: z.object({ label: z.string(), href: z.string() }).optional()
});
