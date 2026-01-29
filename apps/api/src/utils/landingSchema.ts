import { z } from "zod";

export const ThemeSchema = z.object({
  primary: z.string(),
  secondary: z.string(),
  background: z.string(),
  text: z.string(),
  font: z.string(),
  radius: z.string()
});

const BlockTypes = z.enum([
  "navbar",
  "hero",
  "feature-grid",
  "paths",
  "logos",
  "gallery",
  "testimonials",
  "faq",
  "apply-form",
  "footer"
]);

export const BlockSchema = z.object({
  id: z.string(),
  type: BlockTypes,
  props: z.record(z.any())
});

export const LandingDataSchema = z.object({
  seo: z.object({
    title: z.string(),
    description: z.string()
  }),
  theme: ThemeSchema,
  blocks: z.array(BlockSchema)
});

export type LandingData = z.infer<typeof LandingDataSchema>;
