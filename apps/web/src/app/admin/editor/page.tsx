"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { blockRegistry, getBlockLabel } from "@/entities/landing/model/block-registry";
import { landingSchema } from "@/entities/landing/model/schema";
import { useLandingEditorStore } from "@/features/landing-editor/model/editor-store";
import { SeoEditor } from "@/features/landing-editor/ui/block-editors";
import { fileToBase64 } from "@/shared/lib/file";
import { getDraftLanding, getTenant, saveLandingDraft } from "@/shared/api/landing-repo";
import { LandingData } from "@/shared/types/landing";
import { Button } from "@/shared/ui/button";
import { defaultLandingData } from "@/entities/landing/model/defaults";
import { ThemeProvider } from "@/app/providers/theme-provider";
import { LandingRenderer } from "@/widgets/landing-renderer";

const slug = "home";

const ui = {
  en: {
    section: "Section",
    sections: "Sections",
    editSection: "Edit section",
    preview: "Preview",
    editor: "Editor",
    darkMode: "Dark mode",
    lightMode: "Light mode",
    language: "Language",
    saved: "Saved",
    saving: "Saving...",
    saveFailed: "Save failed",
    workspaceReady: "Workspace is ready. Select a section to start editing.",
    unsaved: "Unsaved changes",
    chooseSection: "Choose a section",
    addSection: "Add section",
    addHelp: "Add, hide, move, or remove sections.",
    editHelp: "Edit the text, buttons, and images.",
    previewHelp: "You are previewing this section as it will appear on the site.",
    moveUp: "Move up",
    moveDown: "Move down",
    hide: "Hide",
    show: "Show",
    remove: "Remove",
    confirmRemove: "Remove this section?",
    saveWorkspace: "Save",
    reload: "Reload",
    reset: "Reset",
    themeColors: "Theme colors",
    seo: "SEO",
    loading: "Loading editor..."
  },
  ru: {
    section: "Раздел",
    sections: "Разделы",
    editSection: "Редактировать раздел",
    preview: "Предпросмотр",
    editor: "Редактор",
    darkMode: "Темная тема",
    lightMode: "Светлая тема",
    language: "Язык",
    saved: "Сохранено",
    saving: "Сохранение...",
    saveFailed: "Сохранение не удалось",
    workspaceReady: "Рабочая область готова. Выберите раздел и приступайте к редактированию.",
    unsaved: "Несохраненные изменения",
    chooseSection: "Выберите раздел",
    addSection: "Добавить раздел",
    addHelp: "Добавляйте, скрывайте, перемещайте или удаляйте разделы.",
    editHelp: "Редактируйте текст, кнопки и изображения.",
    previewHelp: "Вы просматриваете этот раздел так, как он будет выглядеть на сайте.",
    moveUp: "Вверх",
    moveDown: "Вниз",
    hide: "Скрыть",
    show: "Показать",
    remove: "Удалить",
    confirmRemove: "Удалить этот раздел?",
    saveWorkspace: "Сохранить",
    reload: "Обновить",
    reset: "Сбросить",
    themeColors: "Цвета темы",
    seo: "SEO",
    loading: "Загрузка редактора..."
  },
  tj: {
    section: "Бахш",
    sections: "Бахшҳо",
    editSection: "Таҳрири бахш",
    preview: "Пешнамоиш",
    editor: "Муҳаррир",
    darkMode: "Режими торик",
    lightMode: "Режими равшан",
    language: "Забон",
    saved: "Сабт шуд",
    saving: "Сабт шуда истодааст...",
    saveFailed: "Сабт нашуд",
    workspaceReady: "Майдони корӣ омода аст. Бахшро интихоб кунед ва таҳрирро оғоз намоед.",
    unsaved: "Тағйироти сабтнашуда",
    chooseSection: "Бахшро интихоб кунед",
    addSection: "Иловаи бахш",
    addHelp: "Бахшҳоро илова, пинҳон, ҷобаҷо ё ҳазф кунед.",
    editHelp: "Матн, тугмаҳо ва тасвирҳоро таҳрир кунед.",
    previewHelp: "Шумо ин бахшро ҳамон тавре мебинед, ки дар сайт намоён мешавад.",
    moveUp: "Боло",
    moveDown: "Поён",
    hide: "Пинҳон",
    show: "Намоиш",
    remove: "Ҳазф",
    confirmRemove: "Ин бахшро ҳазф мекунед?",
    saveWorkspace: "Сабт",
    reload: "Аз нав бор кардан",
    reset: "Ба ҳолати аслӣ баргардондан",
    themeColors: "Рангҳои мавзӯъ",
    seo: "SEO",
    loading: "Муҳаррир бор мешавад..."
  }
};

const languageLabels = {
  en: "English",
  ru: "Русский",
  tj: "Тоҷикӣ"
};

function SectionsManager({
  blocks,
  onAdd,
  onMove,
  onRemove,
  onToggleHidden,
  onSelect,
  t,
  language
}: {
  blocks: LandingData["blocks"];
  onAdd: () => void;
  onMove: (id: string, direction: "up" | "down") => void;
  onRemove: (id: string) => void;
  onToggleHidden: (id: string) => void;
  onSelect: (id: string) => void;
  t: typeof ui.en;
  language: "en" | "ru" | "tj";
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-[14px] border admin-card px-4 py-3">
        <p className="text-xs font-semibold">{t.chooseSection}</p>
        <p className="text-xs admin-muted">{t.addHelp}</p>
      </div>

      <button
        type="button"
        className="flex w-full items-center justify-between rounded-[10px] border admin-card px-4 py-2 text-xs font-semibold hover:bg-[rgb(var(--admin-surface))]"
        onClick={onAdd}
      >
        <span>{t.addSection}</span>
        <span className="text-sm admin-muted">+</span>
      </button>

      <div className="space-y-2">
        {blocks.map((block, index) => {
          const baseLabel = getBlockLabel(block.type, language);
          const label = block.type === "custom" ? `${t.section} ${index + 1}` : baseLabel;
          return (
            <div key={block.id} className="flex flex-wrap items-center gap-2 rounded-[12px] border admin-card px-4 py-3">
              <button type="button" onClick={() => onSelect(block.id)} className="text-sm font-semibold">
                {label}
              </button>
              <div className="ml-auto flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-[10px] border admin-border px-3 py-1 text-[11px] admin-muted hover:bg-[rgb(var(--admin-surface))]"
                  onClick={() => onMove(block.id, "up")}
                >
                  {t.moveUp}
                </button>
                <button
                  type="button"
                  className="rounded-[10px] border admin-border px-3 py-1 text-[11px] admin-muted hover:bg-[rgb(var(--admin-surface))]"
                  onClick={() => onMove(block.id, "down")}
                >
                  {t.moveDown}
                </button>
                <button
                  type="button"
                  className="rounded-[10px] border admin-border px-3 py-1 text-[11px] admin-muted hover:bg-[rgb(var(--admin-surface))]"
                  onClick={() => onToggleHidden(block.id)}
                >
                  {block.hidden ? t.show : t.hide}
                </button>
                <button
                  type="button"
                  className="rounded-[10px] border border-rose-300 px-3 py-1 text-[11px] text-rose-600 hover:bg-rose-50/40"
                  onClick={() => onRemove(block.id)}
                >
                  {t.remove}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminEditorPage() {
  const queryClient = useQueryClient();
  const lastSavedRef = useRef<string>("");

  const {
    landing,
    selectedBlockId,
    mode,
    setLanding,
    updateLanding,
    setSelectedBlockId,
    setMode,
    activePanel,
    setActivePanel,
    language,
    setLanguage,
    adminTheme,
    setAdminTheme
  } = useLandingEditorStore();

  const t = ui[language] || ui.en;
  const [statusKey, setStatusKey] = useState<"loading" | "ready" | "saving" | "saved" | "saveFailed">("loading");

  const { data: tenant } = useQuery({ queryKey: ["tenant"], queryFn: getTenant });

  const { data: draft } = useQuery({
    queryKey: ["landing", "draft", slug, language],
    queryFn: () => getDraftLanding(slug, language)
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("admin:lang");
    if (stored === "en" || stored === "ru" || stored === "tj") {
      setLanguage(stored);
    }
  }, [setLanguage]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("admin:lang", language);
  }, [language]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("admin:theme");
    if (stored === "light" || stored === "dark") {
      setAdminTheme(stored);
    }
  }, [setAdminTheme]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("admin:theme", adminTheme);
  }, [adminTheme]);

  useEffect(() => {
    if (!draft) return;
    setLanding(draft);
    lastSavedRef.current = JSON.stringify(draft);
    setStatusKey("ready");
    const hasSelected = draft.blocks.some((block) => block.id === selectedBlockId);
    if ((!selectedBlockId || !hasSelected) && draft.blocks.length && activePanel !== "sections") {
      setSelectedBlockId(draft.blocks[0].id);
    }
  }, [draft, setLanding, selectedBlockId, setSelectedBlockId, activePanel]);

  const saveMutation = useMutation({
    mutationFn: async (data: LandingData) => {
      landingSchema.parse(data);
      return saveLandingDraft(slug, data, language);
    },
    onMutate: () => setStatusKey("saving"),
    onSuccess: (_, variables) => {
      lastSavedRef.current = JSON.stringify(variables);
      setStatusKey("saved");
      queryClient.invalidateQueries({ queryKey: ["landing", "draft", slug, language] });
      toast.success(t.saved);
    },
    onError: () => {
      setStatusKey("saveFailed");
      toast.error(t.saveFailed);
    }
  });

  const autoSaveMutation = useMutation({
    mutationFn: async (data: LandingData) => {
      landingSchema.parse(data);
      return saveLandingDraft(slug, data, language);
    },
    onMutate: () => setStatusKey("saving"),
    onSuccess: (_, variables) => {
      lastSavedRef.current = JSON.stringify(variables);
      setStatusKey("saved");
      queryClient.invalidateQueries({ queryKey: ["landing", "draft", slug, language] });
    },
    onError: () => {
      setStatusKey("saveFailed");
    }
  });

  const isDirty = useMemo(() => {
    if (!landing) return false;
    return JSON.stringify(landing) !== lastSavedRef.current;
  }, [landing]);

  useEffect(() => {
    if (!landing || !isDirty || autoSaveMutation.isPending) return;
    const timeout = setTimeout(() => {
      autoSaveMutation.mutate(landing);
    }, 2500);
    return () => clearTimeout(timeout);
  }, [landing, isDirty, autoSaveMutation]);

  const blocks = landing?.blocks || [];
  const selectedBlock = blocks.find((block) => block.id === selectedBlockId) || null;

  function updateBlockProps(nextProps: Record<string, any>) {
    if (!landing || !selectedBlock) return;
    updateLanding((current) => {
      const nextBlocks = current.blocks.map((block) =>
        block.id === selectedBlock.id ? { ...block, props: nextProps } : block
      );
      return { ...current, blocks: nextBlocks };
    });
  }

  const editorComponent = selectedBlock ? blockRegistry[selectedBlock.type]?.Editor : null;
  const EditorView = editorComponent as React.ComponentType<any> | null;

  async function handleUpload(file: File) {
    return fileToBase64(file);
  }

  if (!landing || !tenant) {
    return <div className="rounded-[16px] border admin-surface p-6">{t.loading}</div>;
  }

  const selectedIndex = selectedBlock ? blocks.findIndex((block) => block.id === selectedBlock.id) : -1;
  const selectedLabel =
    selectedBlock && selectedBlock.type === "custom" && selectedIndex >= 0
      ? `${t.section} ${selectedIndex + 1}`
      : selectedBlock
      ? getBlockLabel(selectedBlock.type, language)
      : t.chooseSection;
  const activeLabel = activePanel === "sections" ? t.sections : selectedLabel;
  const isPreview = mode === "preview";
  const isEditor = mode === "editor";
  const statusText =
    statusKey === "ready"
      ? ""
      : statusKey === "loading"
      ? t.loading
      : statusKey === "saving"
      ? t.saving
      : statusKey === "saved"
      ? t.saved
      : t.saveFailed;

  function rgbStringToHex(value: string) {
    if (!value) return "#000000";
    if (value.startsWith("#")) return value;
    const parts = value.split(" ").map((item) => Number(item));
    if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) return "#000000";
    return `#${parts.map((part) => part.toString(16).padStart(2, "0")).join("")}`;
  }

  function hexToRgbString(hex: string) {
    const cleaned = hex.replace("#", "");
    if (cleaned.length !== 6) return "0 0 0";
    const r = parseInt(cleaned.slice(0, 2), 16);
    const g = parseInt(cleaned.slice(2, 4), 16);
    const b = parseInt(cleaned.slice(4, 6), 16);
    return `${r} ${g} ${b}`;
  }

  return (
    <div className="space-y-2">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-[16px] border admin-surface px-5 py-4 admin-shadow">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] admin-muted">{t.section}</p>
          <h1 className="text-xl font-semibold">{activeLabel}</h1>
          {statusText || isDirty ? (
            <p className="text-sm admin-muted">
              {statusText}
              {isDirty ? `${statusText ? " - " : ""}${t.unsaved}` : ""}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-[12px] border admin-card p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setMode("editor")}
              className={`rounded-[10px] px-4 py-1 ${isEditor ? "bg-[rgb(var(--admin-accent))] text-white" : "admin-muted"}`}
              aria-pressed={isEditor}
            >
              {t.editor}
            </button>
            <button
              type="button"
              onClick={() => setMode("preview")}
              className={`rounded-[10px] px-4 py-1 ${isPreview ? "bg-[rgb(var(--admin-accent))] text-white" : "admin-muted"}`}
              aria-pressed={isPreview}
            >
              {t.preview}
            </button>
          </div>
          <button
            type="button"
            onClick={() => setAdminTheme(adminTheme === "dark" ? "light" : "dark")}
            className={`flex items-center gap-2 rounded-[12px] border admin-card px-4 py-2 text-xs font-semibold ${
              adminTheme === "dark" ? "bg-[rgb(var(--admin-card))] text-[rgb(var(--admin-text))]" : "admin-muted"
            }`}
            aria-pressed={adminTheme === "dark"}
          >
            <span className={`h-2 w-2 rounded-full ${adminTheme === "dark" ? "bg-[rgb(var(--admin-accent))]" : "bg-[rgb(var(--admin-border))]"}`} />
            {adminTheme === "dark" ? t.lightMode : t.darkMode}
          </button>
          <div className="flex items-center gap-2 rounded-[12px] border admin-card px-4 py-2 text-xs font-semibold">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] admin-muted">{t.language}</span>
            <select
              className="admin-select rounded-theme border px-2 py-1 text-xs font-semibold"
              value={language}
              onChange={(e) => setLanguage(e.target.value as "en" | "ru" | "tj")}
            >
              <option value="en">{languageLabels.en}</option>
              <option value="ru">{languageLabels.ru}</option>
              <option value="tj">{languageLabels.tj}</option>
            </select>
          </div>
        </div>
      </header>

      <section className="rounded-[16px] border admin-surface px-5 py-5 admin-shadow">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold">
              {isPreview ? t.preview : activePanel === "sections" ? t.sections : t.editSection}
            </h2>
            <p className="text-sm admin-muted">
              {isPreview ? t.previewHelp : activePanel === "sections" ? t.addHelp : t.editHelp}
            </p>
          </div>
          {!isPreview ? (
            <div className="flex flex-wrap gap-3">
              <Button
                className="rounded-[10px] bg-[rgb(var(--admin-accent))] px-4 py-2 text-xs font-semibold text-white admin-shadow hover:opacity-90"
                onClick={() => landing && saveMutation.mutate(landing)}
                disabled={saveMutation.isPending}
              >
                {t.saveWorkspace}
              </Button>
              <Button
                className="rounded-[10px] text-xs"
                variant="ghost"
                onClick={async () => {
                  const fresh = await getDraftLanding(slug, language);
                  setLanding(fresh);
                  toast.success(t.saved);
                }}
              >
                {t.reload}
              </Button>
              <Button
                className="rounded-[10px] text-xs"
                variant="ghost"
                onClick={() => {
                  setLanding(defaultLandingData);
                  toast.success(t.saved);
                }}
              >
                {t.reset}
              </Button>
            </div>
          ) : null}
        </div>
        <div className="mt-5 space-y-4">
          {isPreview ? (
            <div className="rounded-[14px] border admin-card">
              {selectedBlock ? (
                <ThemeProvider theme={landing.theme}>
                  <LandingRenderer data={{ ...landing, blocks: [selectedBlock] }} tenant={tenant} slug={slug} showHidden />
                </ThemeProvider>
              ) : (
                <p className="p-6 text-sm admin-muted">{t.chooseSection}</p>
              )}
            </div>
          ) : activePanel === "sections" ? (
            <SectionsManager
              blocks={blocks}
              language={language}
              onAdd={() => {
                const definition = blockRegistry.custom;
                const newBlock = {
                  id: `block_${Math.random().toString(36).slice(2, 9)}`,
                  type: definition.type,
                  props: JSON.parse(JSON.stringify(definition.defaultProps)),
                  hidden: false
                };
                updateLanding((current) => ({ ...current, blocks: [...current.blocks, newBlock] }));
                setSelectedBlockId(newBlock.id);
                setActivePanel("block");
                toast.success(t.saved);
              }}
              onMove={(id, direction) => {
                const index = blocks.findIndex((block) => block.id === id);
                if (index === -1) return;
                const targetIndex = direction === "up" ? index - 1 : index + 1;
                if (targetIndex < 0 || targetIndex >= blocks.length) return;
                updateLanding((current) => {
                  const nextBlocks = [...current.blocks];
                  const [moved] = nextBlocks.splice(index, 1);
                  nextBlocks.splice(targetIndex, 0, moved);
                  return { ...current, blocks: nextBlocks };
                });
              }}
              onRemove={(id) => {
                const confirmed = window.confirm(t.confirmRemove);
                if (!confirmed) return;
                updateLanding((current) => ({
                  ...current,
                  blocks: current.blocks.filter((block) => block.id !== id)
                }));
                if (selectedBlockId === id) {
                  setSelectedBlockId(blocks.find((block) => block.id !== id)?.id || null);
                }
              }}
              onToggleHidden={(id) =>
                updateLanding((current) => ({
                  ...current,
                  blocks: current.blocks.map((block) =>
                    block.id === id ? { ...block, hidden: !block.hidden } : block
                  )
                }))
              }
              onSelect={(id) => {
                setSelectedBlockId(id);
                setActivePanel("block");
              }}
              t={t}
            />
          ) : selectedBlock && EditorView ? (
            <EditorView block={selectedBlock} onChange={updateBlockProps} onUpload={handleUpload} />
          ) : (
            <p className="text-sm admin-muted">{t.chooseSection}</p>
          )}
        </div>
      </section>

      {isPreview ? null : (
        <section className="rounded-[16px] border admin-surface px-5 py-5 admin-shadow">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] admin-muted">{t.themeColors}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Accent", field: "primary" },
              { label: "Accent deep", field: "secondary" },
              { label: "Background", field: "background" },
              { label: "Text", field: "text" },
              { label: "Corner radius", field: "radius" }
            ].map((item) => (
              <div key={item.field} className="flex items-center justify-between rounded-[12px] border admin-card px-4 py-2 text-sm">
                <span>{item.label}</span>
                {item.field === "radius" ? (
                  <input
                    value={(landing.theme as Record<string, string>)[item.field] || ""}
                    onChange={(e) =>
                      updateLanding((current) => ({
                        ...current,
                        theme: { ...current.theme, [item.field]: e.target.value }
                      }))
                    }
                    className="w-28 rounded-[10px] border admin-card px-3 py-1 text-xs"
                    disabled={isPreview}
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={rgbStringToHex((landing.theme as Record<string, string>)[item.field] || "")}
                      onChange={(e) =>
                        updateLanding((current) => ({
                          ...current,
                          theme: { ...current.theme, [item.field]: hexToRgbString(e.target.value) }
                        }))
                      }
                      className="h-7 w-7 rounded-full border admin-card"
                      disabled={isPreview}
                    />
                    <input
                      value={rgbStringToHex((landing.theme as Record<string, string>)[item.field] || "")}
                      onChange={(e) =>
                        updateLanding((current) => ({
                          ...current,
                          theme: { ...current.theme, [item.field]: hexToRgbString(e.target.value) }
                        }))
                      }
                      className="w-20 rounded-[10px] border admin-card px-3 py-1 text-xs"
                      disabled={isPreview}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {isPreview ? null : (
        <section className="rounded-[16px] border admin-surface px-5 py-5 admin-shadow">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] admin-muted">{t.seo}</p>
          <SeoEditor
            title={landing.seo.title}
            description={landing.seo.description}
            onChange={(next) =>
              updateLanding((current) => ({
                ...current,
                seo: { title: next.title, description: next.description }
              }))
            }
          />
        </section>
      )}
    </div>
  );
}
