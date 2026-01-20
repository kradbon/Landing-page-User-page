import { Injectable, computed, signal } from '@angular/core';
import { Note } from '@entities/note/model/types';
import { DEMO_NOTES } from '@entities/note/model/demo';
import { cryptoSafeId } from '@shared/lib/crypto-safe-id';
import { mockDelay } from '@shared/lib/mock-request';

@Injectable({ providedIn: 'root' })
export class NotebookStore {
  readonly notes = signal<Note[]>(DEMO_NOTES);
  readonly activeNoteId = signal<string | null>(DEMO_NOTES[0]?.id ?? null);

  readonly activeNote = computed(() => {
    const id = this.activeNoteId();
    if (!id) return null;
    return this.notes().find((n) => n.id === id) ?? null;
  });

  readonly editorTitle = signal(this.activeNote()?.title ?? '');
  readonly editorContent = signal(this.activeNote()?.content ?? '');

  selectNote(noteId: string) {
    const note = this.notes().find((n) => n.id === noteId);
    if (!note) return;
    this.activeNoteId.set(noteId);
    this.editorTitle.set(note.title);
    this.editorContent.set(note.content);
  }

  async createNote() {
    const note: Note = {
      id: cryptoSafeId(),
      title: 'New note',
      content: '',
      updatedAt: new Date(),
    };
    this.notes.update((notes) => [note, ...notes]);
    this.selectNote(note.id);
    await mockDelay();
  }

  async saveNote() {
    const id = this.activeNoteId();
    if (!id) return;

    const title = this.editorTitle().trim() || 'Untitled';
    const content = this.editorContent();
    const updatedAt = new Date();
    this.notes.update((notes) =>
      notes.map((note) => (note.id === id ? { ...note, title, content, updatedAt } : note)),
    );
    this.editorTitle.set(title);
    await mockDelay();
  }

  async deleteNote(noteId: string) {
    const remaining = this.notes().filter((n) => n.id !== noteId);
    this.notes.set(remaining);
    if (this.activeNoteId() === noteId) {
      const next = remaining[0] ?? null;
      this.activeNoteId.set(next?.id ?? null);
      this.editorTitle.set(next?.title ?? '');
      this.editorContent.set(next?.content ?? '');
    }
    await mockDelay();
  }
}
