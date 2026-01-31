"use client";

import { z } from "zod";
import type { ComponentType } from "react";
import { Block, Tenant } from "@/shared/types/landing";
import {
  NavbarEditor,
  HeroEditor,
  FeatureGridEditor,
  PathsEditor,
  LogosEditor,
  GalleryEditor,
  TestimonialsEditor,
  FaqEditor,
  ApplyFormEditor,
  FooterEditor,
  CustomSectionEditor
} from "@/features/landing-editor/ui/block-editors";
import {
  Hero,
  FeatureGrid,
  Paths,
  Logos,
  Gallery,
  Testimonials,
  Faq,
  ApplySection,
  Footer,
  CustomSection
} from "@/widgets/landing-renderer/blocks";

type BlockRendererProps = { block: Block; tenant?: Tenant; slug?: string };
type EditorLanguage = "en" | "ru" | "tj";

export type BlockDefinition = {
  type: Block["type"];
  label: string;
  defaultProps: Record<string, any>;
  schema: z.ZodTypeAny;
  Render: ComponentType<BlockRendererProps>;
  Editor: ComponentType<any>;
};

const blockLabels: Record<Block["type"], Record<EditorLanguage, string>> = {
  navbar: { en: "Navigation", ru: "Навигация", tj: "Навигатсия" },
  hero: { en: "Hero", ru: "Главный экран", tj: "Қисмати асосӣ" },
  "feature-grid": { en: "Features", ru: "Преимущества", tj: "Афзалиятҳо" },
  paths: { en: "Programs", ru: "Программы", tj: "Барномаҳо" },
  logos: { en: "Logo Strip", ru: "Логотипы", tj: "Логотипҳо" },
  gallery: { en: "Showcase", ru: "Примеры работ", tj: "Намунаҳо" },
  testimonials: { en: "Testimonials", ru: "Отзывы", tj: "Баррасиҳо" },
  faq: { en: "Pricing", ru: "Цены", tj: "Нархгузорӣ" },
  "apply-form": { en: "Contact Form", ru: "Форма заявки", tj: "Формаи дархост" },
  footer: { en: "Footer", ru: "Футер", tj: "Поён" },
  custom: { en: "Section", ru: "Раздел", tj: "Бахш" }
};

export function getBlockLabel(type: Block["type"], language: EditorLanguage) {
  return blockLabels[type]?.[language] || blockLabels[type]?.en || type;
}

export const blockRegistry: Record<Block["type"], BlockDefinition> = {
  navbar: {
    type: "navbar",
    label: "Navigation",
    defaultProps: {
      brand: "Brooklyn LMS",
      links: [
        { label: "Home", href: "/" },
        { label: "All Access", href: "/all-access" },
        { label: "Community", href: "/community" },
        { label: "About", href: "/about-us" },
        { label: "Blog", href: "/blog" }
      ],
      secondaryCta: { label: "Login", href: "/login" },
      cta: { label: "Apply now", href: "/#contact", variant: "solid" }
    },
    schema: z.object({
      brand: z.string(),
      links: z.array(z.object({ label: z.string(), href: z.string() })),
      cta: z.object({ label: z.string(), href: z.string(), variant: z.string().optional() }).optional()
    }),
    Render: () => null,
    Editor: NavbarEditor
  },
  hero: {
    type: "hero",
    label: "Hero",
    defaultProps: {
      eyebrow: "Design + Product Fellowship",
      headline: "Build the craft and",
      headlineAccent: "confidence teams hire",
      subheadline: "Short, confident hero description goes here.",
      primaryCta: { label: "Start your application", href: "/#contact", variant: "solid" },
      secondaryCta: { label: "See outcomes", href: "/about-us" },
      bullets: ["Mentor-led Brooklyn LMS", "Portfolio-grade case study", "Hiring playbook"],
      image: ""
    },
    schema: z.object({
      eyebrow: z.string(),
      headline: z.string(),
      headlineAccent: z.string().optional(),
      subheadline: z.string(),
      primaryCta: z.object({ label: z.string(), href: z.string(), variant: z.string().optional() }).optional(),
      secondaryCta: z.object({ label: z.string(), href: z.string() }).optional(),
      bullets: z.array(z.string()).optional()
    }),
    Render: ({ block, tenant }) => <Hero block={block} tenant={tenant} />,
    Editor: HeroEditor
  },
  "feature-grid": {
    type: "feature-grid",
    label: "Features",
    defaultProps: {
      eyebrow: "What you build",
      title: "Programs shaped around real product teams",
      description: "A short explanation of your signature value.",
      items: [
        { title: "Product narrative", body: "Map user journeys and outcomes." },
        { title: "Design systems", body: "Build reusable components." }
      ]
    },
    schema: z.object({
      eyebrow: z.string(),
      title: z.string(),
      description: z.string(),
      items: z.array(z.object({ title: z.string(), body: z.string() }))
    }),
    Render: ({ block }) => <FeatureGrid block={block} />,
    Editor: FeatureGridEditor
  },
  paths: {
    type: "paths",
    label: "Programs",
    defaultProps: {
      eyebrow: "Choose your path",
      title: "Specializations built for modern teams",
      description: "Pick a track and build deep expertise.",
      items: [{ title: "Product Design", body: "Ship a full SaaS experience.", image: "" }],
      cta: { label: "Explore all programs", href: "/programs" }
    },
    schema: z.object({
      eyebrow: z.string(),
      title: z.string(),
      description: z.string(),
      items: z.array(z.object({ title: z.string(), body: z.string(), image: z.string().optional() })),
      cta: z.object({ label: z.string(), href: z.string() }).optional()
    }),
    Render: ({ block, tenant }) => <Paths block={block} tenant={tenant} />,
    Editor: PathsEditor
  },
  logos: {
    type: "logos",
    label: "Logo Strip",
    defaultProps: {
      variant: "brands",
      title: "Graduates hired by teams at",
      logos: [{ name: "Atlas" }, { name: "Orbit" }]
    },
    schema: z.object({
      variant: z.string().optional(),
      title: z.string(),
      logos: z.array(z.object({ name: z.string(), url: z.string().optional() }))
    }),
    Render: ({ block }) => <Logos block={block} />,
    Editor: LogosEditor
  },
  gallery: {
    type: "gallery",
    label: "Showcase",
    defaultProps: {
      eyebrow: "Student work",
      title: "Portfolio case studies from recent Brooklyn LMS",
      description: "Highlight your best work.",
      images: [{ url: "", caption: "Case study" }]
    },
    schema: z.object({
      eyebrow: z.string(),
      title: z.string(),
      description: z.string(),
      images: z.array(z.object({ url: z.string(), caption: z.string() }))
    }),
    Render: ({ block }) => <Gallery block={block} />,
    Editor: GalleryEditor
  },
  testimonials: {
    type: "testimonials",
    label: "Testimonials",
    defaultProps: {
      eyebrow: "Outcomes",
      title: "Designed to land the offer",
      description: "Brooklyn LMS feedback and results.",
      items: [{ name: "Avery Holt", role: "Product Designer", quote: "A strong quote goes here.", image: "" }]
    },
    schema: z.object({
      eyebrow: z.string(),
      title: z.string(),
      description: z.string(),
      items: z.array(z.object({ name: z.string(), role: z.string(), quote: z.string(), image: z.string().optional() }))
    }),
    Render: ({ block }) => <Testimonials block={block} />,
    Editor: TestimonialsEditor
  },
  faq: {
    type: "faq",
    label: "Pricing",
    defaultProps: {
      variant: "pricing",
      eyebrow: "Brooklyn LMS plans",
      title: "Choose a format that matches your pace",
      items: [
        { title: "Full-time", price: "$2,800", billing: "8-week immersion", features: ["Daily live sessions"], cta: "Apply now" }
      ]
    },
    schema: z.object({
      variant: z.string(),
      eyebrow: z.string(),
      title: z.string(),
      items: z.array(
        z.object({
          title: z.string(),
          price: z.string(),
          billing: z.string(),
          features: z.array(z.string()),
          cta: z.string(),
          highlight: z.boolean().optional(),
          badge: z.string().optional()
        })
      )
    }),
    Render: ({ block, tenant }) => <Faq block={block} tenant={tenant} />,
    Editor: FaqEditor
  },
  "apply-form": {
    type: "apply-form",
    label: "Contact Form",
    defaultProps: {
      eyebrow: "Start your application",
      title: "Tell us about your goals",
      description: "We review every application within 48 hours.",
      submitLabel: "Submit application",
      fields: { firstName: "First name", lastName: "Last name", phone: "Phone number", email: "Email address" }
    },
    schema: z.object({
      eyebrow: z.string(),
      title: z.string(),
      description: z.string(),
      submitLabel: z.string().optional()
    }),
    Render: ({ block, tenant, slug }) => <ApplySection block={block} tenant={tenant} slug={slug || "home"} />,
    Editor: ApplyFormEditor
  },
  footer: {
    type: "footer",
    label: "Footer",
    defaultProps: {
      newsletterTitle: "Stay close to the Brooklyn LMS",
      newsletterBody: "Get monthly insights and Brooklyn LMS announcements.",
      columns: [{ title: "Programs", links: ["Product Design"] }],
      socials: { title: "Connect", links: ["Instagram", "LinkedIn"] },
      note: "Brooklyn LMS (c) 2026",
      legal: "Privacy - Terms"
    },
    schema: z.object({
      newsletterTitle: z.string(),
      newsletterBody: z.string(),
      columns: z.array(z.object({ title: z.string(), links: z.array(z.string()) })),
      socials: z.object({ title: z.string(), links: z.array(z.string()) }),
      note: z.string(),
      legal: z.string()
    }),
    Render: ({ block, tenant }) => <Footer block={block} tenant={tenant} />,
    Editor: FooterEditor
  },
  custom: {
    type: "custom",
    label: "Section",
    defaultProps: {
      eyebrow: "Section label",
      title: "Custom section headline",
      body: "Describe the story you want to tell here. This section is fully editable.",
      image: "",
      ctaLabel: "Learn more",
      ctaHref: "#",
      layout: "image-right"
    },
    schema: z.object({
      eyebrow: z.string().optional(),
      title: z.string(),
      body: z.string(),
      image: z.string().optional(),
      ctaLabel: z.string().optional(),
      ctaHref: z.string().optional(),
      layout: z.string().optional()
    }),
    Render: ({ block, tenant }) => <CustomSection block={block} tenant={tenant} />,
    Editor: CustomSectionEditor
  }
};

export const blockTypeOrder = Object.values(blockRegistry).map((block) => ({
  type: block.type,
  label: block.label
}));
