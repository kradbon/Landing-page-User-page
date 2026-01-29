"use client";

import { Block, LandingData, Tenant } from "@/shared/types/landing";
import { PublicNav } from "@/shared/ui/public-nav";
import { blockRegistry } from "@/entities/landing/model/block-registry";
import { env } from "@/shared/config/env";

export function LandingRenderer({
  data,
  tenant,
  slug,
  selectedBlockId,
  onSelectBlock,
  showHidden
}: {
  data: LandingData;
  tenant: Tenant;
  slug: string;
  selectedBlockId?: string | null;
  onSelectBlock?: (id: string) => void;
  showHidden?: boolean;
}) {
  const base = (env.userPageBaseUrl || "http://localhost:4200").replace(/\/+$/, "");
  const rewritten = rewriteLoginLinks(data, base);
  const navBlock = data.blocks.find(
    (block) => block.type === "navbar" && (showHidden || !block.hidden)
  );
  return (
    <main className="min-h-screen bg-background text-text">
      {navBlock ? (
        <PublicNav
          tenant={tenant}
          brand={navBlock.props.brand}
          links={navBlock.props.links}
          cta={navBlock.props.cta}
          secondaryCta={navBlock.props.secondaryCta}
          announcement={navBlock.props.announcement}
        />
      ) : null}
      <div className="flex flex-col gap-[72px] pb-6 lg:gap-[80px] lg:pb-8">
        {rewritten.blocks
          .filter((block) => block.type !== "navbar")
          .filter((block) => (showHidden ? true : !block.hidden))
          .map((block) => (
            <div
              key={block.id}
              className={`transition ${selectedBlockId === block.id ? "ring-2 ring-primary/40 ring-offset-4 ring-offset-background" : ""}`}
              onClick={() => onSelectBlock?.(block.id)}
            >
              {renderBlock(block, tenant, slug)}
            </div>
          ))}
      </div>
    </main>
  );
}

function renderBlock(block: Block, tenant: Tenant, slug: string) {
  const definition = blockRegistry[block.type];
  if (!definition) return null;
  const Render = definition.Render;
  return <Render block={block} tenant={tenant} slug={slug} />;
}

function rewriteLoginLinks(data: LandingData, base: string): LandingData {
  const rewriteHref = (href?: string) => {
    if (!href) return href;
    const clean = href.trim();
    if (clean.includes("/login")) {
      return `${base}/login`;
    }
    return href;
  };

  return {
    ...data,
    blocks: data.blocks.map((block) => {
      const props = block.props || {};
      const nextProps = { ...props };

      if (nextProps.cta?.href) nextProps.cta = { ...nextProps.cta, href: rewriteHref(nextProps.cta.href) };
      if (nextProps.secondaryCta?.href) nextProps.secondaryCta = { ...nextProps.secondaryCta, href: rewriteHref(nextProps.secondaryCta.href) };
      if (nextProps.primaryCta?.href) nextProps.primaryCta = { ...nextProps.primaryCta, href: rewriteHref(nextProps.primaryCta.href) };
      if (nextProps.announcement?.href) nextProps.announcement = { ...nextProps.announcement, href: rewriteHref(nextProps.announcement.href) };

      if (Array.isArray(nextProps.links)) {
        nextProps.links = nextProps.links.map((link: { label: string; href: string }) => ({
          ...link,
          href: rewriteHref(link.href)
        }));
      }

      if (Array.isArray(nextProps.items)) {
        nextProps.items = nextProps.items.map((item: any) => {
          if (!item || !item.href) return item;
          return { ...item, href: rewriteHref(item.href) };
        });
      }

      return { ...block, props: nextProps };
    })
  };
}
