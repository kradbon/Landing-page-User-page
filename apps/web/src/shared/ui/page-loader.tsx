import type { CSSProperties } from "react";
import type { PageContent, Tenant, ThemeTokens } from "@/shared/types/landing";
import { defaultLandingData } from "@/entities/landing/model/defaults";
import { defaultPages } from "@/entities/landing/model/page-defaults";

type LoaderProps = {
  page?: PageContent;
  tenant?: Tenant;
  theme?: ThemeTokens;
};

export function PageLoader({ page, tenant, theme }: LoaderProps) {
  const fallback = defaultPages.loader;
  const config = page || fallback;
  const tokens = theme || tenant?.theme || defaultLandingData.theme;
  const logo = config.heroImage || tenant?.logo?.url || "/brooklyn_lms_logo.png";
  const title = config.title || tenant?.name || "Brooklyn LMS";
  const subtitle = config.subtitle || config.description || "Loading...";
  const eyebrow = config.eyebrow || "Loading";

  const styles: CSSProperties = {
    ["--loader-accent" as any]: `rgb(${tokens.primary})`,
    ["--color-background" as any]: tokens.background,
    ["--color-text" as any]: tokens.text,
    ["--color-primary" as any]: tokens.primary
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-background text-text" style={styles}>
      <div className="absolute left-0 top-0 h-1 w-full overflow-hidden bg-slate-200/70 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="h-full w-1/3 animate-loader-bar bg-gradient-to-r from-transparent via-[var(--loader-accent)] to-transparent opacity-80" />
      </div>

      <div className="mx-auto flex w-full max-w-md flex-col items-center px-6 text-center">
        {logo ? <img src={logo} alt={title} className="h-24 w-auto object-contain" /> : null}
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">{eyebrow}</p>
        <h1 className="mt-3 font-display text-3xl text-[var(--loader-text)]">{title}</h1>
        <p className="mt-3 text-base text-slate-600">{subtitle}</p>
      </div>
    </div>
  );
}
