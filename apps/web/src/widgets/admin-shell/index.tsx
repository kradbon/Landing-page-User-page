"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { blockRegistry, getBlockLabel } from "@/entities/landing/model/block-registry";
import { useLandingEditorStore } from "@/features/landing-editor/model/editor-store";

const navItems = [
  { key: "editor", href: "/admin/editor" },
  { key: "pages", href: "/admin/pages" },
  { key: "leads", href: "/admin/leads" },
  { key: "history", href: "/admin/history" },
  { key: "settings", href: "/admin/settings" },
  { key: "integrations", href: "/admin/integrations" }
];

const labels = {
  en: {
    section: "Section",
    dashboard: "Dashboard",
    workspace: "Workspace default",
    sections: "Sections",
    manageSections: "Manage sections",
    pickSection: "",
    previewNote: "Preview mode is on. Pick a section to see how it will look on the site.",
    nav: {
      editor: "Landing Editor",
      pages: "Pages",
      leads: "Leads",
      history: "History",
      settings: "Settings",
      integrations: "Integrations"
    },
    settings: "Settings",
    integrations: "Integrations",
    apiKeys: "API keys",
    signOut: "Sign out"
  },
  ru: {
    section: "Раздел",
    dashboard: "Панель",
    workspace: "Рабочее пространство",
    sections: "Разделы",
    manageSections: "Управление разделами",
    pickSection: "",
    previewNote: "Включен предпросмотр. Выберите раздел, чтобы увидеть его на сайте.",
    nav: {
      editor: "Редактор лендинга",
      pages: "Страницы",
      leads: "Заявки",
      history: "История",
      settings: "Настройки",
      integrations: "Интеграции"
    },
    settings: "Настройки",
    integrations: "Интеграции",
    apiKeys: "API ключи",
    signOut: "Выйти"
  },
  tj: {
    section: "Бахш",
    dashboard: "Панель",
    workspace: "Фазои корӣ",
    sections: "Бахшҳо",
    manageSections: "Идоракунии бахшҳо",
    pickSection: "",
    previewNote: "Пешнамоиш фаъол аст. Бахшро интихоб кунед, то намуди онро бинед.",
    nav: {
      editor: "Муҳаррири лендинг",
      pages: "Саҳифаҳо",
      leads: "Дархостҳо",
      history: "Таърих",
      settings: "Танзимот",
      integrations: "Интегратсияҳо"
    },
    settings: "Танзимот",
    integrations: "Интегратсияҳо",
    apiKeys: "Калидҳои API",
    signOut: "Баромадан"
  }
};

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isEditor = pathname?.startsWith("/admin/editor");
  const { landing, selectedBlockId, setSelectedBlockId, setActivePanel, activePanel, mode, adminTheme, language } =
    useLandingEditorStore();
  const blocks = landing?.blocks || [];
  const [profileOpen, setProfileOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const workspaceRef = useRef<HTMLDivElement | null>(null);
  const t = labels[language] || labels.en;

  const pageLabelMap: Record<string, string> = {
    home: "Landing page",
    "all-access": "All access page",
    community: "Community page",
    "about-us": "About page",
    blog: "Blog page",
    "team-training": "Teams page",
    login: "Login page",
    loader: "Loader"
  };

  const pageSlug = pathname?.startsWith("/admin/pages") ? searchParams?.get("slug") || "about-us" : "home";
  const workspaceLabel = pageLabelMap[pageSlug] || "Landing page";
  const safePath = pathname || "";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!workspaceRef.current) return;
      if (workspaceRef.current.contains(event.target as Node)) return;
      setWorkspaceOpen(false);
    }

    if (!workspaceOpen) return;
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [workspaceOpen]);

  const isPreview = mode === "preview";
  const theme = landing?.theme;
  const baseBg = theme?.background || "250 249 245";
  const baseText = theme?.text || "19 24 29";
  const accent = theme?.primary || "13 110 106";
  const isDark = adminTheme === "dark";

  function parseRgb(value: string) {
    const [r, g, b] = value.split(" ").map((part) => Number(part));
    if ([r, g, b].some((channel) => Number.isNaN(channel))) {
      return [0, 0, 0];
    }
    return [r, g, b];
  }

  function mixRgb(a: string, b: string, amount: number) {
    const [ar, ag, ab] = parseRgb(a);
    const [br, bg, bb] = parseRgb(b);
    const mix = (from: number, to: number) => Math.round(from + (to - from) * amount);
    return `${mix(ar, br)} ${mix(ag, bg)} ${mix(ab, bb)}`;
  }

  const adminVars: CSSProperties = {
    ["--admin-bg" as any]: isDark ? baseText : baseBg,
    ["--admin-surface" as any]: isDark ? mixRgb(baseText, baseBg, 0.08) : mixRgb(baseBg, baseText, 0.06),
    ["--admin-card" as any]: isDark ? mixRgb(baseText, baseBg, 0.16) : mixRgb(baseBg, baseText, 0.12),
    ["--admin-border" as any]: isDark ? mixRgb(baseText, baseBg, 0.28) : mixRgb(baseBg, baseText, 0.2),
    ["--admin-text" as any]: isDark ? baseBg : baseText,
    ["--admin-muted" as any]: isDark ? mixRgb(baseBg, baseText, 0.55) : mixRgb(baseText, baseBg, 0.45),
    ["--admin-accent" as any]: accent
  };

  return (
    <div className={`${adminTheme === "dark" ? "dark" : ""} admin-theme admin-bg min-h-screen`} style={adminVars}>
      <div className="flex w-full flex-col gap-4 px-4 py-4 lg:flex-row lg:gap-6 lg:px-6 lg:py-6">
        <aside className="flex w-full flex-col rounded-[16px] border p-5 admin-surface admin-shadow lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:w-[320px]">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] admin-muted">{t.dashboard}</p>
            <div className="relative" ref={workspaceRef}>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-[10px] border px-3 py-2 text-left text-sm font-semibold admin-surface admin-shadow"
                onClick={() => setWorkspaceOpen((open) => !open)}
                aria-expanded={workspaceOpen}
              >
                <span>{workspaceLabel}</span>
                <span className={`text-xs admin-muted transition-transform ${workspaceOpen ? "rotate-180" : ""}`}>▾</span>
              </button>
              {workspaceOpen ? (
                <div className="absolute left-0 mt-2 w-full rounded-[12px] border p-2 text-xs admin-surface admin-shadow">
                  {[
                    { label: "Landing page", href: "/admin/editor", slug: "home" },
                    { label: "All access page", href: "/admin/pages?slug=all-access", slug: "all-access" },
                    { label: "Community page", href: "/admin/pages?slug=community", slug: "community" },
                    { label: "About page", href: "/admin/pages?slug=about-us", slug: "about-us" },
                    { label: "Blog page", href: "/admin/pages?slug=blog", slug: "blog" },
                    { label: "Teams page", href: "/admin/pages?slug=team-training", slug: "team-training" },
                    { label: "Login page", href: "/admin/pages?slug=login", slug: "login" },
                    { label: "Loader", href: "/admin/pages?slug=loader", slug: "loader" }
                  ].map((item) => {
                    const active = item.slug === pageSlug;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex w-full items-center rounded-[10px] px-3 py-2 transition ${
                          active ? "bg-[rgb(var(--admin-accent))] text-white" : "admin-muted hover:bg-[rgb(var(--admin-card))]"
                        }`}
                        onClick={() => setWorkspaceOpen(false)}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-5 flex-1 overflow-y-auto pr-1">
            {isEditor ? (
              <div className="space-y-3">
                {isPreview ? (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] admin-muted">{t.sections}</p>
                    <p className="text-sm admin-muted">{t.previewNote}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] admin-muted">{t.sections}</p>
                    <p className="text-sm font-semibold">{t.manageSections}</p>
                    {t.pickSection ? <p className="text-sm admin-muted">{t.pickSection}</p> : null}
                  </div>
                )}
                <button
                  type="button"
                  className={`flex w-full items-center justify-between rounded-[10px] px-4 py-2 text-xs font-semibold transition ${
                    activePanel === "sections"
                      ? "bg-[rgb(var(--admin-accent))] text-white"
                      : "admin-muted hover:bg-[rgb(var(--admin-card))]"
                  }`}
                  onClick={() => setActivePanel("sections")}
                >
                  {t.sections}
                </button>
                <div className="space-y-2">
                  {blocks.map((block, index) => {
                    const baseLabel = getBlockLabel(block.type, language);
                    const label = block.type === "custom" ? `${t.section} ${index + 1}` : baseLabel;
                    return (
                      <button
                        key={block.id}
                        type="button"
                        onClick={() => setSelectedBlockId(block.id)}
                        className={`flex w-full items-center justify-between rounded-[10px] px-4 py-2 text-xs font-semibold transition ${
                          selectedBlockId === block.id && activePanel === "block"
                            ? "bg-[rgb(var(--admin-accent))] text-white"
                            : "admin-muted hover:bg-[rgb(var(--admin-card))]"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const active = safePath === item.href || safePath.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between rounded-[10px] px-4 py-2 text-sm font-semibold transition ${
                        active
                          ? "bg-[rgb(var(--admin-accent))] text-white"
                          : "admin-muted hover:bg-[rgb(var(--admin-card))]"
                      }`}
                    >
                      {t.nav[item.key as keyof typeof t.nav] || item.key}
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>

          <div className="relative mt-4 rounded-[12px] border px-3 py-2 admin-surface">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] admin-muted">Admin</p>
            <button
              type="button"
              className="mt-2 flex w-full items-center gap-3 rounded-[12px] border px-3 py-2 text-left admin-card transition hover:bg-[rgb(var(--admin-surface))]"
              onClick={() => setProfileOpen((open) => !open)}
              aria-expanded={profileOpen}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[rgb(var(--admin-accent))] text-xs font-semibold text-white">A</div>
              <div className="flex-1 text-xs">
                <p className="font-semibold text-[rgb(var(--admin-text))] leading-none">Admin</p>
                <p className="mt-1 text-[11px] admin-muted">admin@landing.local</p>
              </div>
              <span className={`text-xs admin-muted transition-transform ${profileOpen ? "rotate-180" : ""}`}>▾</span>
            </button>
            {profileOpen ? (
              <div className="absolute bottom-[70px] left-0 w-full rounded-[12px] border p-2 text-xs admin-surface admin-shadow">
                <Link href="/admin/settings" className="flex w-full items-center rounded-[10px] px-3 py-2 admin-muted hover:bg-[rgb(var(--admin-card))]">
                  {t.settings}
                </Link>
                <Link href="/admin/integrations" className="flex w-full items-center rounded-[10px] px-3 py-2 admin-muted hover:bg-[rgb(var(--admin-card))]">
                  {t.integrations}
                </Link>
                <button type="button" className="flex w-full items-center rounded-[10px] px-3 py-2 admin-muted hover:bg-[rgb(var(--admin-card))]">
                  {t.apiKeys}
                </button>
                <button type="button" className="flex w-full items-center rounded-[10px] px-3 py-2 admin-muted hover:bg-[rgb(var(--admin-card))]">
                  {t.signOut}
                </button>
              </div>
            ) : null}
          </div>
        </aside>
        <div className="w-full flex-1 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto lg:pr-2">{children}</div>
      </div>
    </div>
  );
}
