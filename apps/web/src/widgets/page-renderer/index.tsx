"use client";

import clsx from "clsx";
import { PageContent, Tenant } from "@/shared/types/landing";
import { env } from "@/shared/config/env";
import { PublicNav } from "@/shared/ui/public-nav";
import { Section } from "@/shared/ui/section";

type NavProps = {
  brand?: string;
  links?: { label: string; href: string }[];
  cta?: { label: string; href: string; variant?: "solid" | "outline" };
  secondaryCta?: { label: string; href: string };
  announcement?: { text: string; cta: string; href: string };
};

export function PageRenderer({
  tenant,
  nav,
  page
}: {
  tenant: Tenant;
  nav?: NavProps;
  page: PageContent;
}) {
  const resolveHref = (href?: string) => {
    if (!href) return "#";
    if (!href.startsWith("/")) return href;
    if (href === "/login" || href.endsWith("/login")) {
      const base = (env.userPageBaseUrl || "").replace(/\/+$/, "");
      return base ? `${base}/login` : "/portal/login";
    }
    if (href === "/") return `/${tenant.slug}`;
    if (href.startsWith(`/${tenant.slug}`) || href.startsWith(`/${tenant._id}`)) {
      return href;
    }
    return `/${tenant.slug}${href}`;
  };
  const navVariant = "light";

  return (
    <div className={clsx("min-h-screen bg-background text-text")}>
      {nav ? (
        <PublicNav
          tenant={tenant}
          brand={nav.brand}
          links={nav.links}
          cta={nav.cta}
          secondaryCta={nav.secondaryCta}
          announcement={nav.announcement}
          variant={navVariant}
        />
      ) : null}
      {page.layout === "blog" ? <BlogLayout page={page} resolveHref={resolveHref} /> : null}
      {page.layout === "team" ? <TeamLayout page={page} resolveHref={resolveHref} /> : null}
      {page.layout === "standard" ? <StandardLayout page={page} resolveHref={resolveHref} /> : null}
      {page.layout === "courses" ? <CoursesLayout page={page} resolveHref={resolveHref} /> : null}
      <PageFooter tenant={tenant} nav={nav} resolveHref={resolveHref} />
    </div>
  );
}

function Hero({ page, resolveHref }: { page: PageContent; resolveHref: (href?: string) => string }) {
  return (
    <section className="relative overflow-hidden pb-12 pt-16">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-10 top-0 h-[360px] w-[360px] rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute right-20 top-20 h-[320px] w-[320px] rounded-full bg-secondary/20 blur-[120px]" />
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          {page.eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-secondary">{page.eyebrow}</p>
          ) : null}
          <h1 className="font-display text-4xl leading-tight md:text-6xl">{page.title}</h1>
          {page.subtitle ? <p className="text-lg text-slate-600">{page.subtitle}</p> : null}
          {page.description ? <p className="text-base text-slate-600">{page.description}</p> : null}
          {page.cta ? (
            <a
              href={resolveHref(page.cta.href)}
              className="inline-flex rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white"
            >
              {page.cta.label}
            </a>
          ) : null}
        </div>
        <div className="overflow-hidden rounded-[28px]">
          {page.heroImage ? (
            <img src={page.heroImage} alt={page.title} className="h-[360px] w-full object-cover" />
          ) : (
            <div className="flex h-[360px] items-center justify-center rounded-[22px] border border-dashed border-slate-200 text-sm text-slate-400">
              Upload a hero image
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function StandardLayout({ page, resolveHref }: { page: PageContent; resolveHref: (href?: string) => string }) {
  return (
    <>
      <Hero page={page} resolveHref={resolveHref} />
      {page.sections?.length ? (
        <Section>
          <div className="space-y-10">
            {page.sections.map((section, index) => {
              const isReversed = index % 2 === 1;
              return (
                <div
                  key={section.heading}
                  className={`grid items-center gap-8 border-b border-slate-200/70 pb-10 last:border-b-0 last:pb-0 md:grid-cols-2 ${
                    isReversed ? "md:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h2 className="font-display text-2xl">{section.heading}</h2>
                    <p className="text-sm text-slate-600">{section.body}</p>
                  </div>
                  {section.image ? (
                    <div className="overflow-hidden rounded-[20px] bg-slate-100">
                      <img src={section.image} alt={section.heading} className="h-56 w-full object-cover" />
                    </div>
                  ) : (
                    <div className="h-56 rounded-[20px] bg-slate-100" />
                  )}
                </div>
              );
            })}
          </div>
        </Section>
      ) : null}
    </>
  );
}

function TeamLayout({ page, resolveHref }: { page: PageContent; resolveHref: (href?: string) => string }) {
  return (
    <>
      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            {page.eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-secondary">{page.eyebrow}</p>
            ) : null}
            <h1 className="font-display text-4xl md:text-5xl">{page.title}</h1>
            {page.subtitle ? <p className="text-lg text-slate-600">{page.subtitle}</p> : null}
            {page.description ? <p className="text-sm text-slate-600">{page.description}</p> : null}
            {page.cta ? (
              <a href={resolveHref(page.cta.href)} className="text-sm font-semibold text-primary">
                {page.cta.label}
              </a>
            ) : null}
          </div>
          <div className="space-y-4">
            <p className="text-sm font-semibold">What teams get</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {(page.bullets || []).map((item, index) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      {page.heroImage ? (
        <Section>
          <img src={page.heroImage} alt={page.title} className="h-[420px] w-full rounded-[28px] object-cover" />
        </Section>
      ) : null}
    </>
  );
}

function BlogLayout({ page, resolveHref }: { page: PageContent; resolveHref: (href?: string) => string }) {
  return (
    <>
      <section className="bg-slate-950 py-16 text-white">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 md:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-[28px] bg-gradient-to-br from-emerald-500/20 via-slate-900 to-amber-900/40">
            {page.heroImage ? (
              <img src={page.heroImage} alt={page.title} className="h-64 w-full object-cover" />
            ) : (
              <div className="flex h-64 items-center justify-center rounded-[20px] border border-white/10 text-sm text-slate-300">
                Add a featured image
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center gap-4">
            {page.eyebrow ? (
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/70">{page.eyebrow}</span>
            ) : null}
            <h1 className="font-display text-3xl md:text-4xl">{page.title}</h1>
            {page.subtitle ? <p className="text-sm text-slate-300">{page.subtitle}</p> : null}
            {page.cta ? (
              <a href={resolveHref(page.cta.href)} className="text-sm font-semibold text-secondary">
                {page.cta.label}
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <Section>
        <div className="grid gap-6 md:grid-cols-3">
          {(page.cards || []).map((card) => (
            <div key={card.title} className="space-y-3">
              {card.image ? (
                <img src={card.image} alt={card.title} className="h-36 w-full rounded-[16px] object-cover" />
              ) : (
                <div className="flex h-36 items-center justify-center rounded-[16px] bg-slate-100 text-xs text-slate-400">
                  Thumbnail
                </div>
              )}
              {card.tag ? (
                <span className="inline-flex w-fit rounded-full bg-slate-100/70 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-slate-500">
                  {card.tag}
                </span>
              ) : null}
              <h3 className="text-sm font-semibold">{card.title}</h3>
              <p className="text-xs text-slate-500">{card.body}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

function CoursesLayout({ page, resolveHref }: { page: PageContent; resolveHref: (href?: string) => string }) {
  const filters = page.bullets?.length ? page.bullets : ["Format", "Tools"];
  return (
    <div className="pb-16">
      <section className="relative overflow-hidden px-6 pb-10 pt-14">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -left-20 top-10 h-[360px] w-[360px] rounded-full bg-primary/15 blur-[140px]" />
          <div className="absolute right-10 top-0 h-[320px] w-[320px] rounded-full bg-secondary/15 blur-[140px]" />
          <div className="absolute bottom-0 left-1/3 h-[360px] w-[360px] rounded-full bg-primary/10 blur-[160px]" />
        </div>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          {page.eyebrow ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-secondary">{page.eyebrow}</p>
          ) : null}
          <h1 className="font-display text-4xl leading-tight md:text-6xl">{page.title}</h1>
          {page.subtitle ? <p className="max-w-2xl text-lg text-slate-600">{page.subtitle}</p> : null}
          {page.description ? <p className="max-w-2xl text-sm text-slate-600">{page.description}</p> : null}
        </div>
      </section>

      {page.sections?.length ? (
        <section className="mx-auto w-full max-w-6xl px-6 pb-10">
          <div className="grid gap-6 md:grid-cols-3">
            {page.sections.map((section) => (
              <div
                key={section.heading}
                className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
              >
                <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                  {section.image ? (
                    <img src={section.image} alt={section.heading} className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="space-y-3 p-5">
                  <h3 className="text-lg font-semibold">{section.heading}</h3>
                  <p className="text-sm text-slate-600">{section.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mx-auto w-full max-w-6xl px-6 pb-10">
        <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white px-6 py-10 md:px-10">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(13,110,106,0.12),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(214,153,67,0.18),_transparent_60%)]" />
          <div className="grid gap-8 md:grid-cols-[1.15fr_0.85fr] md:items-center">
            <div className="space-y-4">
              <h2 className="font-display text-3xl md:text-4xl">Learn UX Animation</h2>
              <p className="text-sm text-slate-600">
                In UX Animation Essentials, learn to transform static interfaces into engaging experiences using industry-standard motion tools.
              </p>
              {page.cta ? (
                <a
                  href={resolveHref(page.cta.href)}
                  className="inline-flex rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-primary/90"
                >
                  {page.cta.label}
                </a>
              ) : null}
            </div>
            <div className="overflow-hidden rounded-[18px] border border-slate-200 bg-slate-100">
              {page.heroImage ? (
                <img src={page.heroImage} alt={page.title} className="h-56 w-full object-cover" />
              ) : (
                <div className="flex h-56 items-center justify-center text-xs text-slate-400">Add a featured image</div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-center gap-2 text-slate-400">
          {Array.from({ length: 7 }).map((_, index) => (
            <span
              key={`dot-${index}`}
              className={clsx("h-0.5 w-6 rounded-full bg-slate-200", index === 2 && "bg-slate-400")}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
            <span className="text-xs uppercase tracking-[0.3em] text-slate-500">Filter by</span>
            {filters.map((filter) => (
              <button
                type="button"
                key={filter}
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 transition hover:border-slate-300"
              >
                {filter}
              </button>
            ))}
            <span className="text-xs text-slate-500">{page.cards?.length || 0} Results</span>
          </div>
          <button
            type="button"
            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 transition hover:border-slate-300"
          >
            Sort by
          </button>
        </div>
      </section>

      {page.cards?.length ? (
        <section className="mx-auto w-full max-w-6xl px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {page.cards.map((card) => (
              <div
                key={card.title}
                className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition hover:-translate-y-1"
              >
                <div className="relative overflow-hidden bg-slate-100">
                  {card.image ? (
                    <img src={card.image} alt={card.title} className="h-44 w-full object-cover transition duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-44 items-center justify-center text-xs text-slate-400">Thumbnail</div>
                  )}
                  {card.tag ? (
                    <span className="absolute right-3 top-3 rounded-full bg-primary/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                      {card.tag}
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <h3 className="text-lg font-semibold">{card.title}</h3>
                  <p className="text-sm text-slate-600">{card.body}</p>
                  {card.meta?.length ? (
                    <ul className="mt-2 space-y-2 border-t border-slate-200 pt-3 text-xs text-slate-600">
                      {card.meta.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function PageFooter({
  tenant,
  nav,
  resolveHref
}: {
  tenant: Tenant;
  nav?: NavProps;
  resolveHref: (href?: string) => string;
}) {
  const navLinks = nav?.links?.length
    ? nav.links
    : [
        { label: "Home", href: "/" },
        { label: "All Access", href: "/all-access" },
        { label: "Community", href: "/community" },
        { label: "About", href: "/about-us" },
        { label: "Blog", href: "/blog" },
        { label: "Contact Us", href: "/#contact" }
      ];
  const socials = ["Facebook", "Twitter", "Instagram", "LinkedIn", "YouTube"];

  return (
    <footer className="border-t border-slate-200 bg-white py-10 text-slate-900">
      <div className="mx-auto w-full max-w-6xl px-6 text-center">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr_1fr] lg:text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 lg:justify-start">
              {tenant.logo?.url ? <img src={tenant.logo.url} alt={tenant.name} className="h-8 w-auto object-contain" /> : null}
              <span className="font-display text-lg">{tenant.name}</span>
            </div>
            <h3 className="font-display text-2xl">Stay close to the Brooklyn LMS</h3>
            <p className="text-sm text-slate-600">
              Subscribe to our weekly newsletter and start your week with the latest industry news and inspiration.
            </p>
            <div className="mx-auto flex max-w-md gap-3 lg:mx-0">
              <input
                placeholder="Email address"
                className="flex-1 rounded-[12px] border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button className="rounded-[12px] bg-primary px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-primary/90">
                Subscribe
              </button>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Navigation</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={resolveHref(link.href)} className="hover:text-slate-900">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Socials</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {socials.map((link) => (
                <li key={link} className="flex items-center justify-center gap-3 lg:justify-start">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{link.slice(0, 1)}</span>
                  <span>{link}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-4 text-xs text-slate-500 md:flex-row">
          <p>Brooklyn LMS © 2026. All rights reserved.</p>
          <p>Cookie settings · Terms of use · Privacy policy</p>
        </div>
      </div>
    </footer>
  );
}
