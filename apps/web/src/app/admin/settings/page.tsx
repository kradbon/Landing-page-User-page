"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useLandingEditorStore } from "@/features/landing-editor/model/editor-store";

const copy = {
  en: {
    title: "Workspace settings",
    subtitle: "Simple, clear controls for your team.",
    org: "Organization",
    company: "Company name",
    support: "Support email",
    timezone: "Timezone",
    save: "Save settings"
  },
  ru: {
    title: "Настройки рабочего пространства",
    subtitle: "Простые и понятные настройки.",
    org: "Организация",
    company: "Название компании",
    support: "Email поддержки",
    timezone: "Часовой пояс",
    save: "Сохранить настройки"
  },
  tj: {
    title: "Танзимоти фазои корӣ",
    subtitle: "Танзимоти содда ва фаҳмо.",
    org: "Созмон",
    company: "Номи ширкат",
    support: "Почтаи дастгирӣ",
    timezone: "Минтақаи вақт",
    save: "Сабт"
  }
};

export default function AdminSettingsPage() {
  const { language } = useLandingEditorStore();
  const t = copy[language] || copy.en;
  const [companyName, setCompanyName] = useState("Brooklyn LMS");
  const [timezone, setTimezone] = useState("Asia/Dushanbe");
  const [supportEmail, setSupportEmail] = useState("admin@landing.local");

  return (
    <div className="space-y-4">
      <header className="rounded-[16px] border admin-surface px-5 py-4 admin-shadow">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] admin-muted">Settings</p>
        <h1 className="text-xl font-semibold">{t.title}</h1>
        <p className="text-xs admin-muted">{t.subtitle}</p>
      </header>

      <section className="rounded-[16px] border admin-surface px-5 py-5 admin-shadow">
        <h2 className="text-base font-semibold">{t.org}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <label className="text-xs font-semibold admin-muted">
            {t.company}
            <Input className="mt-2" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          </label>
          <label className="text-xs font-semibold admin-muted">
            {t.support}
            <Input className="mt-2" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
          </label>
          <label className="text-xs font-semibold admin-muted">
            {t.timezone}
            <Input className="mt-2" value={timezone} onChange={(e) => setTimezone(e.target.value)} />
          </label>
        </div>
        <div className="mt-5">
          <Button className="rounded-[10px] bg-[rgb(var(--admin-accent))] px-4 py-2 text-xs font-semibold text-white">{t.save}</Button>
        </div>
      </section>
    </div>
  );
}
