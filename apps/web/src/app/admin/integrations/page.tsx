"use client";

import { useEffect, useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useLandingEditorStore } from "@/features/landing-editor/model/editor-store";

const copy = {
  en: {
    title: "Connect your tools",
    subtitle: "Create API keys and webhooks in one place.",
    apiKey: "API key",
    apiHelp: "Use this key to connect external services.",
    generate: "Generate",
    copy: "Copy",
    webhook: "Webhook",
    webhookHelp: "Send updates to your CRM or automation tools.",
    saveWebhook: "Save webhook"
  },
  ru: {
    title: "Интеграции",
    subtitle: "Создайте ключи и вебхуки.",
    apiKey: "API ключ",
    apiHelp: "Используйте этот ключ для подключения внешних сервисов.",
    generate: "Создать",
    copy: "Копировать",
    webhook: "Вебхук",
    webhookHelp: "Отправляйте обновления в CRM или инструменты автоматизации.",
    saveWebhook: "Сохранить вебхук"
  },
  tj: {
    title: "Интегратсияҳо",
    subtitle: "Калидҳо ва вебхукҳоро эҷод кунед.",
    apiKey: "Калиди API",
    apiHelp: "Ин калидро барои пайваст кардани хидматҳои беруна истифода баред.",
    generate: "Эҷод кардан",
    copy: "Нусха",
    webhook: "Вебхук",
    webhookHelp: "Навсозиҳоро ба CRM ё абзорҳои автоматизатсия фиристед.",
    saveWebhook: "Сабт"
  }
};

function generateKey() {
  return `key_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
}

export default function AdminIntegrationsPage() {
  const { language } = useLandingEditorStore();
  const t = copy[language] || copy.en;
  const [apiKey, setApiKey] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem("admin:apiKey");
    if (saved) setApiKey(saved);
  }, []);

  function saveKey(next: string) {
    setApiKey(next);
    window.localStorage.setItem("admin:apiKey", next);
  }

  return (
    <div className="space-y-4">
      <header className="rounded-[16px] border admin-surface px-5 py-4 admin-shadow">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] admin-muted">Integrations</p>
        <h1 className="text-xl font-semibold">{t.title}</h1>
        <p className="text-xs admin-muted">{t.subtitle}</p>
      </header>

      <section className="rounded-[16px] border admin-surface px-5 py-5 admin-shadow">
        <h2 className="text-base font-semibold">{t.apiKey}</h2>
        <p className="text-xs admin-muted">{t.apiHelp}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Input className="min-w-[260px] flex-1" value={apiKey} readOnly placeholder="Generate an API key" />
          <Button
            type="button"
            className="rounded-[10px] bg-[rgb(var(--admin-accent))] px-4 py-2 text-xs font-semibold text-white"
            onClick={() => saveKey(generateKey())}
          >
            {t.generate}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="rounded-[10px] text-xs"
            onClick={() => navigator.clipboard.writeText(apiKey)}
            disabled={!apiKey}
          >
            {t.copy}
          </Button>
        </div>
      </section>

      <section className="rounded-[16px] border admin-surface px-5 py-5 admin-shadow">
        <h2 className="text-base font-semibold">{t.webhook}</h2>
        <p className="text-xs admin-muted">{t.webhookHelp}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Input
            className="min-w-[260px] flex-1"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://example.com/webhook"
          />
          <Button className="rounded-[10px] bg-[rgb(var(--admin-accent))] px-4 py-2 text-xs font-semibold text-white">{t.saveWebhook}</Button>
        </div>
      </section>
    </div>
  );
}
