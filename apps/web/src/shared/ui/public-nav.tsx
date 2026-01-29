"use client";

import clsx from "clsx";
import { LinkButton } from "@/shared/ui/button";
import { Tenant } from "@/shared/types/landing";
import { env } from "@/shared/config/env";

type NavLink = { label: string; href: string };
type NavCta = { label: string; href: string; variant?: "solid" | "outline" };

function resolveNavHref(tenant: Tenant, href: string) {
  if (!href.startsWith("/")) return href;
  const isTenantLogin =
    href === "/login" ||
    href === `/${tenant.slug}/login` ||
    href === `/${tenant._id}/login` ||
    href.endsWith("/login");
  if (isTenantLogin) {
    if (env.userPageBaseUrl) {
      const base = env.userPageBaseUrl.replace(/\/+$/, "");
      return `${base}/login`;
    }
    return "/portal/login";
  }
  if (href.startsWith(`/${tenant.slug}`) || href.startsWith(`/${tenant._id}`)) {
    return href;
  }
  return `/${tenant.slug}${href}`;
}

export function PublicNav({
  tenant,
  brand,
  links,
  cta,
  secondaryCta,
  announcement,
  variant = "light"
}: {
  tenant: Tenant;
  brand?: string;
  links?: NavLink[];
  cta?: NavCta;
  secondaryCta?: NavCta;
  announcement?: { text: string; cta: string; href: string };
  variant?: "light" | "dark";
}) {
  const isDark = variant === "dark";
  const navLinks = links ? [...links] : [];
  const hasHomeLink = navLinks.some((link) => link.href === "/" || link.href === `/${tenant.slug}` || link.href === `/${tenant._id}`);
  if (!hasHomeLink) {
    navLinks.unshift({ label: "Home", href: "/" });
  }
  return (
    <div className="sticky top-0 z-40">
      {announcement ? (
        <div className={isDark ? "bg-emerald-500 text-slate-950" : "bg-secondary text-slate-900"}>
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
            <span>{announcement.text}</span>
            <a
              href={resolveNavHref(tenant, announcement.href)}
              className={clsx(
                "rounded-full border px-4 py-1 text-[10px] font-semibold transition",
                isDark
                  ? "border-slate-900/50 hover:bg-slate-950 hover:text-white"
                  : "border-slate-900/40 hover:bg-slate-900 hover:text-white"
              )}
            >
              {announcement.cta}
            </a>
          </div>
        </div>
      ) : null}
      <div
        className={clsx(
          "border-b backdrop-blur-md",
          isDark ? "border-white/10 bg-slate-950/85" : "border-slate-200/80 bg-white/80"
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 px-6">
          <a href={resolveNavHref(tenant, "/")} className="flex items-center gap-3">
            {tenant.logo?.url ? <img src={tenant.logo.url} alt={tenant.name} className="h-9 w-auto object-contain" /> : null}
            <div className="leading-tight">
              <span className={clsx("font-display text-base font-medium tracking-tight", isDark ? "text-white" : "text-slate-900")}>
                {brand || tenant.name}
              </span>
            </div>
          </a>
          <nav
            className={clsx(
              "hidden items-center gap-6 text-xs font-semibold uppercase tracking-[0.2em] md:flex",
              isDark ? "text-white/80" : "text-slate-900"
            )}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={resolveNavHref(tenant, link.href)}
                className={clsx("transition", isDark ? "hover:text-white" : "hover:text-slate-900")}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            {secondaryCta ? (
              <a
                href={resolveNavHref(tenant, secondaryCta.href)}
                className={clsx(
                  "hidden rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition md:block",
                  isDark ? "text-white/80 hover:text-white" : "text-slate-900 hover:text-slate-900"
                )}
              >
                {secondaryCta.label}
              </a>
            ) : null}
            {cta ? (
              <LinkButton
                href={resolveNavHref(tenant, cta.href)}
                className={
                  cta.variant === "outline"
                    ? clsx(
                        "rounded-full border px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em]",
                        isDark ? "border-white/20 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-700"
                      )
                    : "rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-primary/90"
                }
              >
                {cta.label}
              </LinkButton>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
