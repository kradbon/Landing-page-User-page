"use client";

import { create } from "zustand";
import { LandingData } from "@/shared/types/landing";

type EditorMode = "editor" | "preview";
type PreviewVariant = "draft" | "published";
type Language = "en" | "ru" | "tj";
type AdminTheme = "light" | "dark";

type EditorState = {
  landing: LandingData | null;
  selectedBlockId: string | null;
  activePanel: "sections" | "block";
  mode: EditorMode;
  previewVariant: PreviewVariant;
  language: Language;
  adminTheme: AdminTheme;
  past: LandingData[];
  future: LandingData[];
  setLanding: (landing: LandingData) => void;
  updateLanding: (updater: (current: LandingData) => LandingData) => void;
  setSelectedBlockId: (id: string | null) => void;
  setActivePanel: (panel: "sections" | "block") => void;
  setMode: (mode: EditorMode) => void;
  setPreviewVariant: (variant: PreviewVariant) => void;
  setLanguage: (lang: Language) => void;
  setAdminTheme: (theme: AdminTheme) => void;
  undo: () => void;
  redo: () => void;
};

export const useLandingEditorStore = create<EditorState>((set, get) => ({
  landing: null,
  selectedBlockId: null,
  activePanel: "block",
  mode: "editor",
  previewVariant: "draft",
  language: "en",
  adminTheme: "light",
  past: [],
  future: [],
  setLanding: (landing) => set({ landing, past: [], future: [] }),
  updateLanding: (updater) =>
    set((state) => {
      if (!state.landing) return state;
      const next = updater(state.landing);
      return {
        landing: next,
        past: [...state.past, state.landing].slice(-30),
        future: []
      };
    }),
  setSelectedBlockId: (id) => set({ selectedBlockId: id, activePanel: id ? "block" : "sections" }),
  setActivePanel: (panel) => set({ activePanel: panel, selectedBlockId: panel === "sections" ? null : get().selectedBlockId }),
  setMode: (mode) => set({ mode }),
  setPreviewVariant: (variant) => set({ previewVariant: variant }),
  setLanguage: (lang) => set({ language: lang }),
  setAdminTheme: (theme) => set({ adminTheme: theme }),
  undo: () => {
    const { past, landing, future } = get();
    if (!landing || past.length === 0) return;
    const previous = past[past.length - 1];
    set({
      landing: previous,
      past: past.slice(0, -1),
      future: [landing, ...future].slice(0, 30)
    });
  },
  redo: () => {
    const { past, landing, future } = get();
    if (!landing || future.length === 0) return;
    const next = future[0];
    set({
      landing: next,
      past: [...past, landing].slice(-30),
      future: future.slice(1)
    });
  }
}));
