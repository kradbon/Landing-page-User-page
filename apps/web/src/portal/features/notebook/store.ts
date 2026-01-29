import { createStore, useStore } from "@/portal/store";
import { Note } from "@/portal/entities/note/types";
import { DEMO_NOTES } from "@/portal/entities/note/demo";
import { cryptoSafeId } from "@/portal/lib/crypto-safe-id";
import { mockDelay } from "@/portal/lib/mock-request";

type NotebookState = {
  notes: Note[];
  activeNoteId: string | null;
  editorTitle: string;
  editorContent: string;
};

const initialActiveId = DEMO_NOTES[0]?.id ?? null;
const initialActive = DEMO_NOTES.find((n) => n.id === initialActiveId) ?? null;

const store = createStore<NotebookState>({
  notes: DEMO_NOTES,
  activeNoteId: initialActiveId,
  editorTitle: initialActive?.title ?? "",
  editorContent: initialActive?.content ?? ""
});

export function useNotes() {
  return useStore(store, (state) => state.notes);
}

export function useActiveNote() {
  return useStore(store, (state) => state.notes.find((n) => n.id === state.activeNoteId) ?? null);
}

export function useNotebookEditor() {
  return useStore(store, (state) => ({
    editorTitle: state.editorTitle,
    editorContent: state.editorContent
  }));
}

export function selectNote(noteId: string) {
  const note = store.getState().notes.find((n) => n.id === noteId);
  if (!note) return;
  store.setState((current) => ({
    ...current,
    activeNoteId: noteId,
    editorTitle: note.title,
    editorContent: note.content
  }));
}

export function setEditorTitle(value: string) {
  store.setState((current) => ({ ...current, editorTitle: value }));
}

export function setEditorContent(value: string) {
  store.setState((current) => ({ ...current, editorContent: value }));
}

export async function createNote() {
  const note: Note = {
    id: cryptoSafeId(),
    title: "New note",
    content: "",
    updatedAt: new Date()
  };
  store.setState((current) => ({
    ...current,
    notes: [note, ...current.notes],
    activeNoteId: note.id,
    editorTitle: note.title,
    editorContent: note.content
  }));
  await mockDelay();
}

export async function saveNote() {
  const state = store.getState();
  const id = state.activeNoteId;
  if (!id) return;
  const title = state.editorTitle.trim() || "Untitled";
  const content = state.editorContent;
  const updatedAt = new Date();
  store.setState((current) => ({
    ...current,
    notes: current.notes.map((note) => (note.id === id ? { ...note, title, content, updatedAt } : note)),
    editorTitle: title
  }));
  await mockDelay();
}

export async function deleteNote(noteId: string) {
  const remaining = store.getState().notes.filter((n) => n.id !== noteId);
  const next = remaining[0] ?? null;
  store.setState((current) => ({
    ...current,
    notes: remaining,
    activeNoteId: next?.id ?? null,
    editorTitle: next?.title ?? "",
    editorContent: next?.content ?? ""
  }));
  await mockDelay();
}

